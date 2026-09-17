package com.luca.trademarkerai

import android.app.Activity
import android.app.AlertDialog
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.text.Editable
import android.text.InputType
import android.text.TextWatcher
import android.view.Gravity
import android.widget.*
import java.util.concurrent.Executors
import kotlin.math.abs

class MainActivity : Activity() {
    private val executor = Executors.newSingleThreadExecutor()

    private val bg = Color.rgb(6, 12, 22)
    private val surface = Color.rgb(15, 25, 40)
    private val surface2 = Color.rgb(23, 36, 55)
    private val border = Color.rgb(43, 58, 79)
    private val green = Color.rgb(46, 213, 115)
    private val fg = Color.rgb(240, 244, 250)
    private val muted = Color.rgb(150, 163, 181)
    private val softGreen = Color.rgb(151, 242, 190)

    private lateinit var secure: SecureStore
    private lateinit var progress: ProgressBar
    private lateinit var status: TextView
    private lateinit var output: TextView
    private lateinit var analyze: Button
    private lateinit var capital: EditText
    private lateinit var risk: EditText
    private lateinit var riskExplain: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        secure = SecureStore(this)
        window.statusBarColor = bg
        window.navigationBarColor = bg
        buildUi()
    }

    override fun onDestroy() {
        executor.shutdownNow()
        super.onDestroy()
    }

    private fun buildUi() {
        val scroll = ScrollView(this).apply {
            setBackgroundColor(bg)
            isFillViewport = true
        }
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18), dp(20), dp(18), dp(34))
        }
        scroll.addView(root)

        root.addView(TextView(this).apply {
            text = "GPT TRADER AGENT"
            textSize = 11f
            setTextColor(softGreen)
            setTypeface(typeface, Typeface.BOLD)
            gravity = Gravity.CENTER
            background = rounded(surface2, 50, green)
            setPadding(dp(12), dp(6), dp(12), dp(6))
        }, LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT))

        root.addView(TextView(this).apply {
            text = "TRADEMARKERAI"
            textSize = 30f
            setTextColor(Color.WHITE)
            setTypeface(typeface, Typeface.BOLD)
            setPadding(0, dp(10), 0, 0)
        })
        root.addView(TextView(this).apply {
            text = "Analisi autonoma GPT-5.6 Sol • Binance • Swing 2–7 giorni"
            textSize = 13f
            setTextColor(muted)
            setPadding(0, dp(3), 0, dp(18))
        })

        val params = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(16), dp(15), dp(16), dp(16))
            background = rounded(surface, 18, border)
        }
        params.addView(sectionLabel("PARAMETRI DEL TRADE"))

        params.addView(fieldLabel("Capitale disponibile"), lpTop(10))
        capital = numberInput("es. 10000", "10000")
        params.addView(capital, LinearLayout.LayoutParams(-1, dp(54)).apply { topMargin = dp(5) })
        params.addView(TextView(this).apply {
            text = "USDT usati solo per calcolare la size teorica della posizione."
            textSize = 11.5f
            setTextColor(muted)
            setPadding(0, dp(6), 0, 0)
        })

        val riskHeader = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }
        riskHeader.addView(fieldLabel("Rischio massimo per trade"), LinearLayout.LayoutParams(0, -2, 1f))
        riskHeader.addView(TextView(this).apply {
            text = "?"
            textSize = 14f
            setTextColor(softGreen)
            setTypeface(typeface, Typeface.BOLD)
            gravity = Gravity.CENTER
            background = rounded(surface2, 50, green)
            setOnClickListener { showRiskHelp() }
        }, LinearLayout.LayoutParams(dp(30), dp(30)))
        params.addView(riskHeader, lpTop(14))

        risk = numberInput("es. 1", "1")
        params.addView(risk, LinearLayout.LayoutParams(-1, dp(54)).apply { topMargin = dp(5) })
        riskExplain = TextView(this).apply {
            textSize = 12f
            setTextColor(softGreen)
            setPadding(0, dp(7), 0, 0)
        }
        params.addView(riskExplain)
        root.addView(params)

        val watcher = object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) = Unit
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) = updateRiskExplanation()
            override fun afterTextChanged(s: Editable?) = Unit
        }
        capital.addTextChangedListener(watcher)
        risk.addTextChangedListener(watcher)
        updateRiskExplanation()

        analyze = Button(this).apply {
            text = "ANALIZZA MERCATO CON GPT"
            isAllCaps = false
            textSize = 15f
            setTextColor(Color.rgb(4, 20, 12))
            setTypeface(typeface, Typeface.BOLD)
            background = rounded(green, 15)
            stateListAnimator = null
            setOnClickListener { startAgent() }
        }
        root.addView(analyze, LinearLayout.LayoutParams(-1, dp(60)).apply { topMargin = dp(14) })

        root.addView(Button(this).apply {
            text = "Impostazioni API"
            isAllCaps = false
            textSize = 14f
            setTextColor(fg)
            setTypeface(typeface, Typeface.BOLD)
            background = rounded(surface2, 14, border)
            stateListAnimator = null
            setOnClickListener { apiDialog() }
        }, LinearLayout.LayoutParams(-1, dp(52)).apply { topMargin = dp(8) })

        progress = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal).apply {
            max = 100
            progressTintList = ColorStateList.valueOf(green)
            progressBackgroundTintList = ColorStateList.valueOf(surface2)
        }
        root.addView(progress, LinearLayout.LayoutParams(-1, dp(7)).apply { topMargin = dp(18) })

        status = TextView(this).apply {
            text = apiStatusText()
            textSize = 12.5f
            setTextColor(muted)
            background = rounded(surface, 13, border)
            setPadding(dp(13), dp(10), dp(13), dp(10))
        }
        root.addView(status, lpTop(8))

        root.addView(sectionLabel("ANALISI / TRADE PLAN"), lpTop(20))
        output = TextView(this).apply {
            text = "GPT sceglierà autonomamente quali dati chiedere a Binance, quali coppie approfondire e se concludere LONG, SHORT o WAIT.\n\nNessun ordine viene inviato a Binance."
            setTextColor(fg)
            textSize = 14f
            setLineSpacing(dp(2).toFloat(), 1.12f)
            setTextIsSelectable(true)
            background = rounded(surface, 18, border)
            setPadding(dp(16), dp(16), dp(16), dp(18))
        }
        root.addView(output, lpTop(8))

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
        analyze.alpha = 0.55f
        progress.progress = 2
        output.text = "ANALISI IN CORSO\n\nGPT sta interrogando Binance e decide autonomamente quali dati approfondire."
        status.text = "● Connessione Binance e OpenAI"

        executor.execute {
            try {
                val toolbox = BinanceToolbox(secure.get("binance_api"))
                val agent = OpenAiTraderAgent(openAiKey, toolbox)
                val plan = agent.run(cap, riskPct) { p ->
                    runOnUiThread {
                        progress.progress = (8 + p.round * 7 + p.toolCalls).coerceAtMost(94)
                        status.text = "● ${p.message}"
                    }
                }
                runOnUiThread {
                    render(plan, cap, riskPct)
                    progress.progress = 100
                    status.text = "● Completato • ${plan.toolCalls} richieste dati • ${plan.rounds} round GPT"
                    analyze.isEnabled = true
                    analyze.alpha = 1f
                }
            } catch (e: Exception) {
                runOnUiThread {
                    progress.progress = 0
                    status.text = "● Analisi interrotta"
                    output.text = "ERRORE\n\n${e.message ?: e.javaClass.simpleName}\n\nControlla connessione e API key, poi riprova."
                    analyze.isEnabled = true
                    analyze.alpha = 1f
                }
            }
        }
    }

    private fun render(p: TradePlan, cap: Double, riskPct: Double) {
        val b = StringBuilder()
        val decisionMark = when (p.decision.uppercase()) {
            "LONG" -> "▲ LONG"
            "SHORT" -> "▼ SHORT"
            else -> "● WAIT"
        }

        b.append("GPT TRADE PLAN\n")
        b.append("────────────────────\n")
        b.append("${p.symbol.ifBlank { "MERCATO" }}   $decisionMark\n")
        b.append("Setup: ${p.setupQuality}  •  Orizzonte: ${p.expectedHoldingPeriod.ifBlank { "2–7 giorni" }}\n")
        b.append("Dati richiesti: ${p.toolCalls}  •  Round GPT: ${p.rounds}\n\n")

        if (p.currentPrice != null) b.append("PREZZO OSSERVATO     ${fmt(p.currentPrice)}\n")
        b.append("MODALITÀ             ${p.entryMode}\n")

        if (p.decision != "WAIT") {
            if (p.entryZoneLow != null || p.entryZoneHigh != null) {
                b.append("ENTRY ZONE           ${fmt(p.entryZoneLow)} – ${fmt(p.entryZoneHigh)}\n")
            }
            b.append("ENTRY IDEALE         ${fmt(p.preferredEntry)}\n")
            if (p.doNotChase != null) b.append("NON INSEGUIRE        ${fmt(p.doNotChase)}\n")
            b.append("STOP LOSS            ${fmt(p.stopLoss)}\n")
            b.append("TP1                  ${fmt(p.takeProfit1)}${rrText(p.riskReward(p.takeProfit1))}\n")
            b.append("TP2                  ${fmt(p.takeProfit2)}${rrText(p.riskReward(p.takeProfit2))}\n")
            b.append("TP3                  ${fmt(p.takeProfit3)}${rrText(p.riskReward(p.takeProfit3))}\n")

            val e = p.preferredEntry
            val sl = p.stopLoss
            if (e != null && sl != null && cap > 0 && riskPct > 0 && abs(e - sl) > 0) {
                val maxLoss = cap * riskPct / 100.0
                val qty = maxLoss / abs(e - sl)
                val positionValue = qty * e
                b.append("\nGESTIONE RISCHIO\n")
                b.append("────────────────────\n")
                b.append("Capitale dichiarato      ${fmt(cap)} USDT\n")
                b.append("Rischio max               ${fmt(riskPct)}% = ${fmt(maxLoss)} USDT\n")
                b.append("Quantità teorica          ${fmt(qty)} ${p.symbol.removeSuffix("USDT")}\n")
                b.append("Valore posizione stimato  ${fmt(positionValue)} USDT\n")
                b.append("Stima basata su entry/SL; fee, slippage e leva non sono inclusi.\n")
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

        b.append("\n────────────────────\nAnalysis-only: nessun ordine è stato aperto.")
        output.text = b.toString()
    }

    private fun section(b: StringBuilder, title: String, items: List<String>) {
        val clean = items.filter { it.isNotBlank() }
        if (clean.isEmpty()) return
        b.append("\n$title\n")
        b.append("────────────────────\n")
        clean.forEach { b.append("• $it\n") }
    }

    private fun updateRiskExplanation() {
        if (!::riskExplain.isInitialized) return
        val cap = capital.text.toString().toDoubleOrNull()
        val pct = risk.text.toString().toDoubleOrNull()
        riskExplain.text = if (cap != null && pct != null && cap >= 0 && pct >= 0) {
            val loss = cap * pct / 100.0
            "$pct% significa: se lo Stop Loss viene colpito, perdita teorica max ≈ ${fmt(loss)} USDT."
        } else {
            "Indica quanto del capitale sei disposto a perdere se viene colpito lo Stop Loss."
        }
    }

    private fun showRiskHelp() {
        AlertDialog.Builder(this)
            .setTitle("Che significa rischio %?")
            .setMessage(
                "È la perdita massima teorica che accetti su un singolo trade se viene colpito lo Stop Loss.\n\n" +
                    "Esempio: capitale 10.000 USDT e rischio 1% = massimo 100 USDT a rischio.\n\n" +
                    "Non significa investire solo l'1% del capitale. La dimensione della posizione dipende dalla distanza tra entry e Stop Loss.\n\n" +
                    "TradeMarkerAI usa questo valore per calcolare la size teorica. Fee, slippage ed eventuale leva possono modificare il rischio reale."
            )
            .setPositiveButton("Chiaro", null)
            .show()
    }

    private fun apiDialog() {
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(20), dp(8), dp(20), 0)
        }
        layout.addView(TextView(this).apply {
            text = "OpenAI è obbligatoria: GPT è il motore decisionale. I dati Binance usati dall'analisi sono pubblici; la Binance API Key è opzionale. Nessun ordine viene inviato."
            textSize = 12f
            setTextColor(Color.DKGRAY)
            setPadding(0, 0, 0, dp(10))
        })
        val openAi = secretInput(if (secure.get("openai").isBlank()) "OpenAI API Key" else "OpenAI API Key • salvata")
        val binance = secretInput(if (secure.get("binance_api").isBlank()) "Binance API Key • opzionale" else "Binance API Key • salvata")
        val secret = secretInput(if (secure.get("binance_secret").isBlank()) "Binance Secret • non usata" else "Binance Secret • salvata, non usata")
        layout.addView(openAi)
        layout.addView(binance)
        layout.addView(secret)

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
                secure.put("openai", "")
                secure.put("binance_api", "")
                secure.put("binance_secret", "")
                status.text = apiStatusText()
                dialog.dismiss()
            }
        }
        dialog.show()
    }

    private fun apiStatusText(): String = if (secure.get("openai").isBlank()) {
        "● OpenAI API da configurare • Binance market data pronta"
    } else {
        "● OpenAI configurata • Binance market data pronta"
    }

    private fun sectionLabel(textValue: String) = TextView(this).apply {
        text = textValue
        textSize = 11f
        letterSpacing = 0.08f
        setTextColor(muted)
        setTypeface(typeface, Typeface.BOLD)
    }

    private fun fieldLabel(textValue: String) = TextView(this).apply {
        text = textValue
        textSize = 13f
        setTextColor(fg)
        setTypeface(typeface, Typeface.BOLD)
    }

    private fun numberInput(hintText: String, value: String) = EditText(this).apply {
        hint = hintText
        setText(value)
        textSize = 16f
        setTextColor(fg)
        setHintTextColor(muted)
        background = rounded(surface2, 12, border)
        setPadding(dp(13), 0, dp(13), 0)
        inputType = InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_DECIMAL
        gravity = Gravity.CENTER_VERTICAL
    }

    private fun secretInput(hintText: String) = EditText(this).apply {
        hint = hintText
        inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
        setPadding(dp(8), dp(7), dp(8), dp(7))
    }

    private fun rounded(color: Int, radiusDp: Int, strokeColor: Int? = null): GradientDrawable = GradientDrawable().apply {
        shape = GradientDrawable.RECTANGLE
        setColor(color)
        cornerRadius = dp(radiusDp).toFloat()
        if (strokeColor != null) setStroke(dp(1), strokeColor)
    }

    private fun lpTop(top: Int) = LinearLayout.LayoutParams(-1, -2).apply { topMargin = dp(top) }

    private fun rrText(v: Double?): String = if (v == null || !v.isFinite()) "" else "   ${"%.2f".format(v)}R"

    private fun fmt(v: Double?): String = when {
        v == null || !v.isFinite() -> "n/d"
        abs(v) >= 1000 -> "%,.2f".format(v)
        abs(v) >= 1 -> "%.4f".format(v)
        else -> "%.8f".format(v)
    }

    private fun dp(v: Int) = (v * resources.displayMetrics.density).toInt()
}
