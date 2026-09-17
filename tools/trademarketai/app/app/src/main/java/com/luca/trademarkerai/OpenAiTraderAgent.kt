package com.luca.trademarkerai

import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

class OpenAiTraderAgent(
    private val openAiKey: String,
    private val toolbox: BinanceToolbox,
    private val model: String = "gpt-5.6-sol"
) {
    data class Progress(val round: Int, val toolCalls: Int, val message: String)

    fun run(capital: Double, riskPct: Double, onProgress: (Progress) -> Unit): TradePlan {
        require(openAiKey.isNotBlank()) { "Inserisci la OpenAI API Key nelle Impostazioni API" }
        require(toolbox.ping()) { "Binance non raggiungibile" }

        val history = JSONArray()
        history.put(JSONObject().put("role", "user").put("content", initialTask(capital, riskPct)))
        val tools = tools()
        var rounds = 0
        var toolCalls = 0

        while (rounds < 12 && toolCalls < 45) {
            rounds++
            onProgress(Progress(rounds, toolCalls, if (rounds == 1) "GPT avvia l'analisi" else "GPT continua l'analisi"))
            val response = createResponse(history, tools)
            val output = response.optJSONArray("output") ?: throw IllegalStateException("OpenAI: output mancante")

            for (i in 0 until output.length()) history.put(output.get(i))

            val calls = mutableListOf<JSONObject>()
            for (i in 0 until output.length()) {
                val item = output.optJSONObject(i) ?: continue
                if (item.optString("type") == "function_call") calls += item
            }

            if (calls.isEmpty()) {
                history.put(JSONObject().put("role", "user").put("content", "Non hai ancora finalizzato. Se hai dati sufficienti usa submit_trade_plan; altrimenti richiedi altri dati Binance con i tool."))
                continue
            }

            for (call in calls) {
                toolCalls++
                val name = call.optString("name")
                val callId = call.optString("call_id")
                val args = try { JSONObject(call.optString("arguments", "{}")) } catch (_: Exception) { JSONObject() }
                onProgress(Progress(rounds, toolCalls, toolLabel(name, args)))

                if (name == "submit_trade_plan") {
                    val plan = TradePlan.fromToolArgs(args, toolCalls, rounds)
                    val errors = plan.validationErrors()
                    if (errors.isEmpty()) return plan
                    history.put(
                        JSONObject().put("type", "function_call_output").put("call_id", callId)
                            .put("output", JSONObject().put("accepted", false).put("validationErrors", errors.toJsonArray()).put("instruction", "Correggi il piano usando i dati reali e richiama submit_trade_plan.").toString())
                    )
                    continue
                }

                val toolOutput = try {
                    toolbox.execute(name, args)
                } catch (e: Exception) {
                    JSONObject().put("error", e.message ?: e.javaClass.simpleName).put("tool", name).toString()
                }
                history.put(JSONObject().put("type", "function_call_output").put("call_id", callId).put("output", toolOutput))
            }
        }
        throw IllegalStateException("GPT non ha finalizzato il piano entro il limite di analisi. Riprova.")
    }

    private fun createResponse(history: JSONArray, tools: JSONArray): JSONObject {
        val body = JSONObject()
            .put("model", model)
            .put("store", false)
            .put("reasoning", JSONObject().put("effort", "high"))
            .put("instructions", SYSTEM_PROMPT)
            .put("input", history)
            .put("tools", tools)
            .put("tool_choice", "auto")
            .put("parallel_tool_calls", true)
            .put("max_output_tokens", 12000)

        val c = URL("https://api.openai.com/v1/responses").openConnection() as HttpURLConnection
        c.requestMethod = "POST"; c.doOutput = true; c.connectTimeout = 20_000; c.readTimeout = 120_000
        c.setRequestProperty("Authorization", "Bearer $openAiKey")
        c.setRequestProperty("Content-Type", "application/json")
        c.setRequestProperty("Accept", "application/json")
        c.outputStream.use { it.write(body.toString().toByteArray()) }
        val code = c.responseCode
        val stream = if (code in 200..299) c.inputStream else c.errorStream
        val txt = BufferedReader(InputStreamReader(stream)).use { it.readText() }
        c.disconnect()
        if (code !in 200..299) throw IllegalStateException("OpenAI HTTP $code: ${safeApiError(txt)}")
        return JSONObject(txt)
    }

    private fun safeApiError(raw: String): String = try {
        JSONObject(raw).optJSONObject("error")?.optString("message")?.take(300) ?: "Errore API"
    } catch (_: Exception) { raw.take(180) }

    private fun initialTask(capital: Double, riskPct: Double): String = """
        Esegui ADESSO un'analisi autonoma completa del mercato crypto Binance per swing trading 2-7 giorni.
        Capitale indicativo dell'utente: $capital USDT. Rischio massimo indicativo per trade: $riskPct%.
        Parti dal quadro generale, identifica i mercati che meritano approfondimento e usa autonomamente i tool Binance necessari.
        Non esiste una coppia preselezionata: devi trovarla tu. Non sei obbligato a fare trade: WAIT è corretto se non trovi un setup di qualità.
        Quando hai dati sufficienti, DEVI finalizzare esclusivamente chiamando il tool submit_trade_plan.
    """.trimIndent()

    private fun toolLabel(name: String, args: JSONObject): String = when (name) {
        "market_overview" -> "GPT chiede panoramica mercato Binance"
        "multi_timeframe_snapshot" -> "GPT approfondisce ${args.optString("symbol")} su 1W/1D/4H/1H/15M"
        "technical_snapshot" -> "GPT analizza ${args.optString("symbol")} • ${args.optString("interval")}"
        "klines" -> "GPT legge price action ${args.optString("symbol")} • ${args.optString("interval")}"
        "order_book" -> "GPT chiede order book ${args.optString("symbol")}"
        "recent_trades" -> "GPT chiede flusso trade ${args.optString("symbol")}"
        "futures_snapshot" -> "GPT chiede derivati ${args.optString("symbol")}"
        "correlation" -> "GPT calcola correlazione ${args.optString("symbolA")}/${args.optString("symbolB")}"
        "submit_trade_plan" -> "GPT finalizza il piano operativo"
        else -> "GPT richiede $name"
    }

    private fun tools(): JSONArray = JSONArray()
        .put(fn("market_overview", "Restituisce i mercati spot USDT Binance più liquidi con prezzo, volume 24h, variazione, high/low, trade count e spread. Usalo per iniziare lo screening; scegli tu quante coppie richiedere.", obj(
            "limit" to intSchema("Numero mercati da restituire, 10-80")
        )))
        .put(fn("multi_timeframe_snapshot", "Analisi tecnica completa di una coppia su 1W, 1D, 4H, 1H e 15M. Include EMA/SMA, RSI, MACD, ATR, ADX, Bollinger, volume, taker ratio, struttura, swing, supporti/resistenze, trendline e ultime candele.", obj(
            "symbol" to strSchema("Coppia Binance, es. BTCUSDT")
        )))
        .put(fn("technical_snapshot", "Analisi tecnica dettagliata di un singolo timeframe. Richiedila quando vuoi approfondire un timeframe o usare più storico.", obj(
            "symbol" to strSchema("Coppia Binance"),
            "interval" to enumSchema("Timeframe", listOf("15m","1h","4h","1d","1w")),
            "candles" to intSchema("Numero candele, 60-500")
        )))
        .put(fn("klines", "Candele OHLCV raw Binance per leggere direttamente price action, breakout, retest, wick, compressioni e pattern. Le colonne sono documentate nel risultato.", obj(
            "symbol" to strSchema("Coppia Binance"),
            "interval" to enumSchema("Timeframe", listOf("5m","15m","30m","1h","4h","1d","1w")),
            "limit" to intSchema("Numero candele richieste, 20-300")
        )))
        .put(fn("order_book", "Snapshot order book spot Binance con migliori livelli, notional bid/ask, spread e imbalance. È un dato istantaneo, non una certezza predittiva.", obj(
            "symbol" to strSchema("Coppia Binance"),
            "limit" to intSchema("Profondità richiesta: 5-100 livelli")
        )))
        .put(fn("recent_trades", "Recent trades spot Binance e taker buy/sell notional ratio. Usalo solo quando il flusso recente è rilevante per il timing.", obj(
            "symbol" to strSchema("Coppia Binance"),
            "limit" to intSchema("Numero trade 10-200")
        )))
        .put(fn("futures_snapshot", "Dati pubblici Binance USD-M Futures: mark/index price, funding, open interest, storico OI, global long/short e taker long/short. Può restituire errori per asset senza perpetual.", obj(
            "symbol" to strSchema("Perpetual symbol, es. BTCUSDT"),
            "period" to enumSchema("Periodo delle serie derivati", listOf("15m","30m","1h","2h","4h","6h","12h","1d"))
        )))
        .put(fn("correlation", "Calcola correlazione Pearson dei log-return tra due coppie Binance sul timeframe scelto. Utile per contestualizzare altcoin contro BTC/ETH.", obj(
            "symbolA" to strSchema("Prima coppia"),
            "symbolB" to strSchema("Seconda coppia"),
            "interval" to enumSchema("Timeframe", listOf("1h","4h","1d")),
            "limit" to intSchema("Campioni 30-300")
        )))
        .put(submitTool())

    private fun fn(name: String, description: String, parameters: JSONObject): JSONObject = JSONObject()
        .put("type", "function").put("name", name).put("description", description).put("parameters", parameters).put("strict", true)

    private fun obj(vararg props: Pair<String, JSONObject>): JSONObject {
        val p = JSONObject(); val required = JSONArray()
        props.forEach { (k, v) -> p.put(k, v); required.put(k) }
        return JSONObject().put("type", "object").put("properties", p).put("required", required).put("additionalProperties", false)
    }

    private fun strSchema(desc: String) = JSONObject().put("type", "string").put("description", desc)
    private fun intSchema(desc: String) = JSONObject().put("type", "integer").put("description", desc)
    private fun enumSchema(desc: String, values: List<String>) = JSONObject().put("type", "string").put("description", desc).put("enum", JSONArray(values))
    private fun nullableNumber(desc: String) = JSONObject().put("type", JSONArray(listOf("number", "null"))).put("description", desc)
    private fun stringArray(desc: String) = JSONObject().put("type", "array").put("description", desc).put("items", JSONObject().put("type", "string"))

    private fun submitTool(): JSONObject {
        val props = linkedMapOf<String, JSONObject>(
            "decision" to enumSchema("Decisione finale", listOf("LONG","SHORT","WAIT")),
            "symbol" to strSchema("Coppia scelta. Per WAIT generale usa MARKET se nessuna coppia è idonea."),
            "setupQuality" to enumSchema("Qualità qualitativa documentata del setup", listOf("LOW","MEDIUM","HIGH")),
            "currentPrice" to nullableNumber("Prezzo corrente osservato; null per WAIT generale"),
            "expectedHoldingPeriod" to strSchema("Orizzonte stimato, tipicamente 2-7 giorni"),
            "entryMode" to enumSchema("Modalità ingresso", listOf("NOW","WAIT_FOR_RETRACE","WAIT_FOR_BREAKOUT","WAIT_FOR_RETEST","NONE")),
            "entryZoneLow" to nullableNumber("Limite basso zona ingresso; null per WAIT senza setup"),
            "entryZoneHigh" to nullableNumber("Limite alto zona ingresso; null per WAIT senza setup"),
            "preferredEntry" to nullableNumber("Entry preferita; null per WAIT senza setup"),
            "doNotChase" to nullableNumber("Prezzo oltre il quale non inseguire il movimento; null se non applicabile"),
            "stopLoss" to nullableNumber("Stop loss strutturale; null per WAIT senza setup"),
            "takeProfit1" to nullableNumber("TP1; null per WAIT senza setup"),
            "takeProfit2" to nullableNumber("TP2; null se non giustificato"),
            "takeProfit3" to nullableNumber("TP3; null se non giustificato"),
            "invalidation" to strSchema("Condizione tecnica che invalida la tesi"),
            "bullishEvidence" to stringArray("Evidenze bullish osservate"),
            "bearishEvidence" to stringArray("Evidenze bearish osservate"),
            "contradictions" to stringArray("Dati che contraddicono la tesi scelta"),
            "mainRisks" to stringArray("Rischi principali"),
            "actionNow" to strSchema("Cosa fare adesso in termini chiari"),
            "reasoningSummary" to strSchema("Sintesi concisa del ragionamento basato sui dati, senza inventare informazioni"),
            "dataUsed" to stringArray("Dati e timeframe realmente consultati"),
            "missingData" to stringArray("Dati mancanti o non disponibili")
        )
        val p = JSONObject(); val r = JSONArray(); props.forEach { (k, v) -> p.put(k, v); r.put(k) }
        val params = JSONObject().put("type", "object").put("properties", p).put("required", r).put("additionalProperties", false)
        return fn("submit_trade_plan", "FINALIZZA l'analisi. Chiamalo solo quando hai confrontato il mercato e hai dati sufficienti. Questo tool non apre ordini: consegna il piano all'utente. Per WAIT usa valori null dove non esiste un livello tecnico sensato.", params)
    }

    companion object {
        private val SYSTEM_PROMPT = """
SEI IL MOTORE DECISIONALE DI TRADEMARKERAI.

Agisci come un Senior Cryptocurrency Swing Trader di livello istituzionale, Quantitative Trader, Technical Analyst, Market Structure Analyst, Derivatives Analyst e Risk Manager. Il tuo orizzonte operativo principale è 2-7 giorni.

AUTONOMIA
Sei tu a decidere quali dati chiedere a Binance, in quale ordine e quanto approfondire. L'app NON preseleziona una moneta e NON prende una decisione tecnica al posto tuo. Usa i tool come useresti un terminale professionale: prima quadro generale, poi screening, poi approfondimento dei candidati realmente interessanti. Non richiedere dati inutili.

OBIETTIVO
Non devi trovare sempre un trade. Devi proteggere il capitale e proporre LONG o SHORT solo se esiste un setup sufficientemente coerente. WAIT è una decisione corretta e frequente.

METODO
Ragiona top-down: 1W contesto, 1D trend/struttura dominante, 4H struttura operativa, 1H setup/timing, 15M affinamento. Non lasciare che rumore intraday ribalti senza ragioni una struttura 1D/4H chiara. Analizza BTC ed ETH come riferimenti prima di assumere rischio su altcoin quando pertinente.

PRICE ACTION PRIMA DI TUTTO
Dai grande peso a trend, HH/HL/LH/LL, swing, supporti/resistenze, trendline, breakout/retest/false breakout, compressione/espansione e liquidità. EMA/SMA, RSI, MACD, ADX, ATR, Bollinger e volume sono strumenti di contesto e conferma, non regole automatiche.

MEDIE MOBILI
EMA e SMA sono diverse. Valuta EMA 9/20/50/100/200 e SMA 50/100/200 quando disponibili. Non trasformare crossover in segnali automatici.

ANTI-BIAS
Per ogni candidato formula tesi bullish e bearish. Cerca attivamente ciò che invalida la tua prima idea. Non inseguire pump, non fare FOMO, non usare RSI>70=SHORT o RSI<30=LONG, non inventare probabilità di successo.

DERIVATI
Quando migliorano davvero la decisione, chiedi funding, OI, storico OI, long/short e taker ratio. Interpretali nel contesto; non applicare formule semplicistiche.

ENTRY E RISCHIO
Per LONG/SHORT devi definire una invalidazione reale. Entry, SL e TP devono derivare da struttura, livelli, ATR/volatilità, trendline e/o liquidità. Non usare percentuali fisse arbitrarie. Se il setup è buono ma il prezzo è troppo esteso, usa WAIT_FOR_RETRACE / WAIT_FOR_BREAKOUT / WAIT_FOR_RETEST invece di inseguire il prezzo.

DATI
Non inventare prezzi, indicatori, order book, OI, funding o news. Se un dato è necessario, chiedilo con un tool. Se non è disponibile, dichiaralo in missingData. Usa soltanto i dati ricevuti in questa sessione.

FINALIZZAZIONE
Quando hai dati sufficienti devi chiamare submit_trade_plan. LONG/SHORT richiedono livelli numerici coerenti; WAIT può non avere entry/SL/TP. Il tool non esegue ordini. Non produrre una decisione finale fuori da submit_trade_plan.
        """.trimIndent()
    }
}
