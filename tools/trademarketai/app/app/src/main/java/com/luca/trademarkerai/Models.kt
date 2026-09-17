package com.luca.trademarkerai

import org.json.JSONArray
import org.json.JSONObject

data class Candle(
    val openTime: Long,
    val open: Double,
    val high: Double,
    val low: Double,
    val close: Double,
    val volume: Double,
    val closeTime: Long,
    val takerBuyVolume: Double
)

data class TradePlan(
    val decision: String,
    val symbol: String,
    val setupQuality: String,
    val currentPrice: Double?,
    val expectedHoldingPeriod: String,
    val entryMode: String,
    val entryZoneLow: Double?,
    val entryZoneHigh: Double?,
    val preferredEntry: Double?,
    val doNotChase: Double?,
    val stopLoss: Double?,
    val takeProfit1: Double?,
    val takeProfit2: Double?,
    val takeProfit3: Double?,
    val invalidation: String,
    val bullishEvidence: List<String>,
    val bearishEvidence: List<String>,
    val contradictions: List<String>,
    val mainRisks: List<String>,
    val actionNow: String,
    val reasoningSummary: String,
    val dataUsed: List<String>,
    val missingData: List<String>,
    val model: String = "gpt-5.6-sol",
    val toolCalls: Int = 0,
    val rounds: Int = 0
) {
    fun validationErrors(): List<String> {
        val errors = mutableListOf<String>()
        val d = decision.uppercase()
        if (d !in setOf("LONG", "SHORT", "WAIT")) errors += "decision deve essere LONG, SHORT o WAIT"
        if (d == "WAIT") return errors
        val e = preferredEntry
        val sl = stopLoss
        val t1 = takeProfit1
        if (symbol.isBlank()) errors += "symbol mancante"
        if (e == null || !e.isFinite() || e <= 0) errors += "preferredEntry non valida"
        if (sl == null || !sl.isFinite() || sl <= 0) errors += "stopLoss non valido"
        if (t1 == null || !t1.isFinite() || t1 <= 0) errors += "takeProfit1 non valido"
        if (e != null && sl != null && t1 != null) {
            if (d == "LONG" && !(sl < e && t1 > e)) errors += "Per LONG: SL deve essere sotto entry e TP1 sopra entry"
            if (d == "SHORT" && !(sl > e && t1 < e)) errors += "Per SHORT: SL deve essere sopra entry e TP1 sotto entry"
        }
        if (entryZoneLow != null && entryZoneHigh != null && entryZoneLow > entryZoneHigh) errors += "entryZoneLow > entryZoneHigh"
        return errors
    }

    fun riskReward(tp: Double?): Double? {
        val e = preferredEntry ?: return null
        val sl = stopLoss ?: return null
        val target = tp ?: return null
        val risk = kotlin.math.abs(e - sl)
        if (risk <= 0.0) return null
        return kotlin.math.abs(target - e) / risk
    }

    companion object {
        fun fromToolArgs(args: JSONObject, toolCalls: Int, rounds: Int): TradePlan {
            return TradePlan(
                decision = args.optString("decision", "WAIT").uppercase(),
                symbol = args.optString("symbol", ""),
                setupQuality = args.optString("setupQuality", "LOW"),
                currentPrice = args.optNullableDouble("currentPrice"),
                expectedHoldingPeriod = args.optString("expectedHoldingPeriod", ""),
                entryMode = args.optString("entryMode", "NONE"),
                entryZoneLow = args.optNullableDouble("entryZoneLow"),
                entryZoneHigh = args.optNullableDouble("entryZoneHigh"),
                preferredEntry = args.optNullableDouble("preferredEntry"),
                doNotChase = args.optNullableDouble("doNotChase"),
                stopLoss = args.optNullableDouble("stopLoss"),
                takeProfit1 = args.optNullableDouble("takeProfit1"),
                takeProfit2 = args.optNullableDouble("takeProfit2"),
                takeProfit3 = args.optNullableDouble("takeProfit3"),
                invalidation = args.optString("invalidation", ""),
                bullishEvidence = args.optStringList("bullishEvidence"),
                bearishEvidence = args.optStringList("bearishEvidence"),
                contradictions = args.optStringList("contradictions"),
                mainRisks = args.optStringList("mainRisks"),
                actionNow = args.optString("actionNow", ""),
                reasoningSummary = args.optString("reasoningSummary", ""),
                dataUsed = args.optStringList("dataUsed"),
                missingData = args.optStringList("missingData"),
                toolCalls = toolCalls,
                rounds = rounds
            )
        }
    }
}

fun JSONObject.optNullableDouble(name: String): Double? {
    if (!has(name) || isNull(name)) return null
    val v = optDouble(name, Double.NaN)
    return if (v.isFinite()) v else null
}

fun JSONObject.optStringList(name: String): List<String> {
    val a = optJSONArray(name) ?: return emptyList()
    return (0 until a.length()).mapNotNull { i -> a.optString(i, null) }
}

fun List<String>.toJsonArray(): JSONArray = JSONArray().also { a -> forEach { a.put(it) } }
