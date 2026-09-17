package com.luca.trademarkerai

import android.app.Activity
import android.app.AlertDialog
import android.graphics.Color
import android.graphics.Typeface
import android.os.Bundle
import android.text.InputType
import android.view.Gravity
import android.widget.*
import java.util.concurrent.Executors
import kotlin.math.abs

class MainActivity : Activity() {
    private val executor = Executors.newSingleThreadExecutor()
    private val bg = Color.rgb(8, 14, 25)
    private val card = Color.rgb(18, 27, 43)
    private val green = Color.rgb(34, 197, 94)
    private val fg = Color.rgb(235, 238, 244)
    private val muted = Color.rgb(155, 165, 180)

    private lateinit var secure: SecureStore
    private lateinit var progress: ProgressBar
    private lateinit var status: TextView
    private lateinit var output: TextView
    private lateinit var analyze: Button
    private lateinit var capital: EditText
    private lateinit var risk: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        secure = SecureStore(this)
        window.statusBarColor = bg
        buildUi()
    }

    override fun onDestroy() {
        executor.shutdownNow()
        super.onDestroy()
    }

    private fun buildUi() {
        val scroll = ScrollView(this).apply { setBackgroundColor(bg) }
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18), dp(20), dp(18), dp(30))
        }
        scroll.addView(root)

        root.addView(TextView(this).apply {
            text = "TRADEMARKERAI"
            textSize = 28f
            setTextColor(Color.WHITE)
            setTypeface(typeface, Typeface.BOLD)
        })
        root.addView(TextView(this).apply {
            text = "GPT-5.6 Sol Trader Agent • Binance • Swing 2–7 giorni"
            textSize = 13f
            setTextColor(green)
            setPadding(0, 0, 0, dp(14))
        })

        val inputs = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(dp(10), dp(10), dp(10), dp(10))
            setBackgroundColor(card)
        }
        capital = numberInput("Capitale USDT", "10000")
        risk = numberInput("Rischio %", "1")
        inputs.addView(capital, LinearLayout.LayoutParams(0, dp(52), 1f).apply { marginEnd = dp(8) })
        inputs.addView(risk, LinearLayout.LayoutParams(0, dp(52), 1f))
        root.addView(inputs)

        analyze = Button(this).apply {
            text = "ANALIZZA MERCATO CON GPT"
            setTextColor(Color.BLACK)
            setBackgroundColor(green)
            setTypeface(typeface, Typeface.BOLD)
            setOnClickListener { startAgent() }
        }
        root.addView(analyze, LinearLayout.LayoutParams(-1, dp(60)).apply { topMargin = dp(10) })

        root.addView(Button(this).apply {
            text = "IMPOSTAZIONI API"
            setTextColor(fg)
            setBackgroundColor(Color.rgb(35, 45, 62))
            setOnClickListener { apiDialog() }
        }, LinearLayout.LayoutParams(-1, dp(50)).apply { topMargin = dp(8) })

        progress = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal).apply { max = 100 }
        root.addView(progress, LinearLayout.LayoutParams(-1, dp(10)).apply { topMargin = dp(16) })

        status = TextView(this).apply {
            text = apiStatusText()
            setTextColor(muted)
            textSize = 13f
            setPadding(0, dp(7), 0, dp(10))
        }
        root.addView(status)

        output = TextView(this).apply {
            text = "ChatGPT decide autonomamente quali dati chiedere a Binance, quali coppie approfondire e se concludere LONG, SHORT o WAIT.\n\nNessun ordine viene inviato a Binance."
            setTextColor(fg)
            textSize = 14f
            setLineSpacing(0f, 1.14f)
            setTextIsSelectable(true)
        }
        root.addView(output)
        setContentView(scroll)
    }

    private fun startAgent() {
        val openAiKey = secure.get("openai")
        if (openAiKey.isBlank()) {
            Toast.makeText(this, "Inserisci prima la OpenAI API Key", Toast.LENGTH_LONG).show()
            apiDialog()
            return
        }
        val cap = capital.text.toString().toDoubleOrNull()?.coerceAtLeast(0.0) ?: 0.0
        val riskPct = risk.text.toString().toDoubleOrNull()?.coerceIn(0.0, 10.0) ?: 0.0
        analyze.isEnabled = false
        progress.progress = 2
        output.text = "GPT sta analizzando il mercato…\n\nLe richieste dati verranno decise autonomamente dal modello."
        status.text = "Connessione Binance e OpenAI"

        executor.execute {
            try {
                val toolbox = BinanceToolbox(secure.get("binance_api"))
                val agent = OpenAiTraderAgent(openAiKey, toolbox)
                val plan = agent.run(cap, riskPct) { p ->
                    runOnUiThread {
                        progress.progress = (8 + p.round * 7 + p.toolCalls).coerceAtMost(94)
                        status.text = p.message
                    }
                }
                runOnUiThread {
                    render(plan, cap, riskPct)
                    progress.progress = 100
                    status.text = "Completato • GPT-5.6 Sol • ${plan.toolCalls} richieste tool"
                    analyze.isEnabled = true
                }
            } catch (e: Exception) {
                runOnUiThread {
                    progress.progress = 0
                    status.text = "Analisi interrotta"
                    output.text = "ERRORE\n\n${e.message ?: e.javaClass.simpleName}\n\nControlla connessione e API key, poi riprova."
                    analyze.isEnabled = true
                }
            }
        }
    }

    private fun render(p: TradePlan, cap: Double, riskPct: Double) {
        val b = StringBuilder()
        b.append("ANALISI GPT COMPLETATA\n\n")
        b.append("${p.symbol}   ${p.decision}\n")
        b.append("Qualità setup: ${p.setupQuality}\n")
        b.append("Orizzonte: ${p.expectedHoldingPeriod.ifBlank { "2–7 giorni" }}\n")
        b.append("Modello: ${p.model}\n")
        b.append("Round: ${p.rounds} • Tool Binance/calcolo: ${p.toolCalls}\n\n")

        if (p.currentPrice != null) b.append("Prezzo osservato: ${fmt(p.currentPrice)}\n")
        b.append("Modalità: ${p.entryMode}\n")

        if (p.decision != "WAIT") {
            if (p.entryZoneLow != null || p.entryZoneHigh != null) b.append("ENTRY ZONE: ${fmt(p.entryZoneLow)} – ${fmt(p.entryZoneHigh)}\n")
            b.append("ENTRY IDEALE: ${fmt(p.preferredEntry)}\n")
            if (p.doNotChase != null) b.append("NON INSEGUIRE OLTRE: ${fmt(p.doNotChase)}\n")
            b.append("STOP LOSS: ${fmt(p.stopLoss)}\n")
            b.append("TP1: ${fmt(p.takeProfit1)}${rrText(p.riskReward(p.takeProfit1))}\n")
            b.append("TP2: ${fmt(p.takeProfit2)}${rrText(p.riskReward(p.takeProfit2))}\n")
            b.append("TP3: ${fmt(p.takeProfit3)}${rrText(p.riskReward(p.takeProfit3))}\n")

            val e = p.preferredEntry; val sl = p.stopLoss
            if (e != null && sl != null && cap > 0 && riskPct > 0 && abs(e - sl) > 0) {
                val maxLoss = cap * riskPct / 100.0
                val qty = maxLoss / abs(e - sl)
                b.append("\nPOSITION SIZE TEORICA\n")
                b.append("Perdita massima: ${fmt(maxLoss)} USDT\n")
                b.append("Quantità: ${fmt(qty)} ${p.symbol.removeSuffix("USDT")}\n")
                b.append("Calcolo basato esclusivamente su entry/SL scelti da GPT.\n")
            }
        }

        section(b, "COSA FARE ADESSO", listOf(p.actionNow))
        section(b, "TESI / SINTESI", listOf(p.reasoningSummary))
        section(b, "INVALIDAZIONE", listOf(p.invalidation))
        section(b, "EVIDENZE BULLISH", p.bullishEvidence)
        section(b, "EVIDENZE BEARISH", p.bearishEvidence)
        section(b, "CONTRADDIZIONI", p.contradictions)
        section(b, "RISCHI", p.mainRisks)
        section(b, "DATI CONSULTATI DA GPT", p.dataUsed)
        section(b, "DATI MANCANTI", p.missingData)

        b.append("\nNessun ordine è stato aperto. L'analisi usa dati di mercato e non garantisce risultati futuri.")
        output.text = b.toString()
    }

    private fun section(b: StringBuilder, title: String, items: List<String>) {
        val clean = items.filter { it.isNotBlank() }
        if (clean.isEmpty()) return
        b.append("\n$title\n")
        clean.forEach { b.append("• $it\n") }
    }

    private fun apiDialog() {
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(20), dp(6), dp(20), 0)
        }
        layout.addView(TextView(this).apply {
            text = "OpenAI è obbligatoria: GPT-5.6 Sol è il motore decisionale. Binance Spot/Futures usa dati pubblici; la Binance API Key è opzionale. La Secret viene conservata cifrata ma questa versione non la usa e non invia ordini."
            textSize = 12f
            setTextColor(Color.DKGRAY)
            setPadding(0, 0, 0, dp(8))
        })
        val openAi = secretInput(if (secure.get("openai").isBlank()) "OpenAI API Key" else "OpenAI API Key • salvata")
        val binance = secretInput(if (secure.get("binance_api").isBlank()) "Binance API Key • opzionale" else "Binance API Key • salvata")
        val secret = secretInput(if (secure.get("binance_secret").isBlank()) "Binance Secret • non usata" else "Binance Secret • salvata, non usata")
        layout.addView(openAi); layout.addView(binance); layout.addView(secret)

        val dialog = AlertDialog.Builder(this)
            .setTitle("Impostazioni API")
            .setView(layout)
            .setPositiveButton("Salva", null)
            .setNeutralButton("Cancella chiavi", null)
            .setNegativeButton("Chiudi", null)
            .create()

        dialog.setOnShowListener {
            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
                if (openAi.text.isNotBlank()) secure.put("openai", openAi.text.toString().trim())
                if (binance.text.isNotBlank()) secure.put("binance_api", binance.text.toString().trim())
                if (secret.text.isNotBlank()) secure.put("binance_secret", secret.text.toString().trim())
                status.text = apiStatusText()
                Toast.makeText(this, "API salvate in Android Keystore", Toast.LENGTH_SHORT).show()
                dialog.dismiss()
            }
            dialog.getButton(AlertDialog.BUTTON_NEUTRAL).setOnClickListener {
                secure.put("openai", ""); secure.put("binance_api", ""); secure.put("binance_secret", "")
                status.text = apiStatusText(); dialog.dismiss()
            }
        }
        dialog.show()
    }

    private fun apiStatusText(): String = if (secure.get("openai").isBlank()) "OpenAI API: da configurare" else "OpenAI API: configurata • Binance market data: pronta"

    private fun numberInput(hintText: String, value: String) = EditText(this).apply {
        hint = hintText; setText(value); setTextColor(fg); setHintTextColor(muted); setBackgroundColor(Color.rgb(35,45,62)); setPadding(dp(9), 0, dp(9), 0)
        inputType = InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_DECIMAL
        gravity = Gravity.CENTER_VERTICAL
    }

    private fun secretInput(hintText: String) = EditText(this).apply {
        hint = hintText
        inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
    }

    private fun rrText(v: Double?): String = if (v == null || !v.isFinite()) "" else "   ${"%.2f".format(v)}R"
    private fun fmt(v: Double?): String = when {
        v == null || !v.isFinite() -> "n/d"
        abs(v) >= 1000 -> "%,.2f".format(v)
        abs(v) >= 1 -> "%.4f".format(v)
        else -> "%.8f".format(v)
    }
    private fun dp(v: Int) = (v * resources.displayMetrics.density).toInt()
}
