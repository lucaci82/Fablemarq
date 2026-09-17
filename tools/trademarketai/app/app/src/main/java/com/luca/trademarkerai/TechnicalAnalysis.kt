package com.luca.trademarkerai

import org.json.JSONArray
import org.json.JSONObject
import kotlin.math.abs
import kotlin.math.ln
import kotlin.math.max
import kotlin.math.min
import kotlin.math.pow
import kotlin.math.sqrt

object TechnicalAnalysis {
    fun snapshot(candles: List<Candle>, interval: String): JSONObject {
        require(candles.size >= 30) { "Servono almeno 30 candele" }
        val closes = candles.map { it.close }
        val last = candles.last()
        val ema9 = ema(closes, 9)
        val ema20 = ema(closes, 20)
        val ema50 = ema(closes, 50)
        val ema100 = ema(closes, 100)
        val ema200 = ema(closes, 200)
        val sma50 = sma(closes, 50)
        val sma100 = sma(closes, 100)
        val sma200 = sma(closes, 200)
        val rsi14 = rsi(closes, 14)
        val atr14 = atr(candles, 14)
        val adx14 = adx(candles, 14)
        val macd = macd(closes)
        val boll = bollinger(closes, 20, 2.0)
        val roc12 = if (closes.size > 12) (closes.last() / closes[closes.lastIndex - 12] - 1.0) * 100.0 else Double.NaN
        val volAvg20 = candles.takeLast(min(20, candles.size)).map { it.volume }.average()
        val relativeVolume = if (volAvg20 > 0) last.volume / volAvg20 else Double.NaN
        val recent = candles.takeLast(min(20, candles.size))
        val takerRatio = recent.sumOf { it.takerBuyVolume } / max(1e-12, recent.sumOf { it.volume })
        val rv = realizedVolatility(closes, min(30, closes.size - 1))
        val highs = pivots(candles, true)
        val lows = pivots(candles, false)
        val support = lows.map { it.second }.filter { it < last.close }.maxOrNull() ?: candles.takeLast(min(60, candles.size)).minOf { it.low }
        val resistance = highs.map { it.second }.filter { it > last.close }.minOrNull() ?: candles.takeLast(min(60, candles.size)).maxOf { it.high }
        val structure = structure(highs, lows)
        val trend = trend(last.close, ema20, ema50, ema200, adx14)
        val tlSupport = projectedTrendline(lows, candles.lastIndex)
        val tlResistance = projectedTrendline(highs, candles.lastIndex)
        val lastCandles = JSONArray()
        candles.takeLast(12).forEach { c ->
            lastCandles.put(JSONArray().put(c.openTime).put(c.open).put(c.high).put(c.low).put(c.close).put(c.volume).put(c.takerBuyVolume))
        }
        val swingHighs = JSONArray(); highs.takeLast(5).forEach { swingHighs.put(JSONObject().put("index", it.first).put("price", it.second)) }
        val swingLows = JSONArray(); lows.takeLast(5).forEach { swingLows.put(JSONObject().put("index", it.first).put("price", it.second)) }

        return JSONObject()
            .put("interval", interval)
            .put("price", last.close)
            .put("ema", JSONObject().put("9", ema9.json()).put("20", ema20.json()).put("50", ema50.json()).put("100", ema100.json()).put("200", ema200.json()))
            .put("sma", JSONObject().put("50", sma50.json()).put("100", sma100.json()).put("200", sma200.json()))
            .put("rsi14", rsi14.json())
            .put("macd", JSONObject().put("line", macd.first.json()).put("signal", macd.second.json()).put("histogram", macd.third.json()))
            .put("atr14", atr14.json())
            .put("atrPct", if (last.close > 0) (atr14 / last.close * 100).json() else JSONObject.NULL)
            .put("adx14", adx14.json())
            .put("roc12Pct", roc12.json())
            .put("bollinger", JSONObject().put("lower", boll.first.json()).put("middle", boll.second.json()).put("upper", boll.third.json()).put("widthPct", boll.fourth.json()))
            .put("volume", JSONObject().put("current", last.volume).put("sma20", volAvg20).put("relative", relativeVolume.json()).put("takerBuyRatio", takerRatio.json()))
            .put("realizedVolatilityPct", rv.json())
            .put("trend", trend)
            .put("marketStructure", structure)
            .put("support", support)
            .put("resistance", resistance)
            .put("trendlineSupport", tlSupport.json())
            .put("trendlineResistance", tlResistance.json())
            .put("swingHighs", swingHighs)
            .put("swingLows", swingLows)
            .put("recentCandles", lastCandles)
    }

    fun correlation(a: List<Candle>, b: List<Candle>, limit: Int): Double {
        val n = min(min(a.size, b.size) - 1, limit)
        if (n < 5) return Double.NaN
        val ra = mutableListOf<Double>(); val rb = mutableListOf<Double>()
        for (i in 0 until n) {
            val ai = a[a.size - n - 1 + i].close; val aj = a[a.size - n + i].close
            val bi = b[b.size - n - 1 + i].close; val bj = b[b.size - n + i].close
            if (ai > 0 && bi > 0) { ra += ln(aj / ai); rb += ln(bj / bi) }
        }
        val ma = ra.average(); val mb = rb.average()
        var cov = 0.0; var va = 0.0; var vb = 0.0
        for (i in ra.indices) { val da = ra[i] - ma; val db = rb[i] - mb; cov += da * db; va += da * da; vb += db * db }
        return if (va > 0 && vb > 0) cov / sqrt(va * vb) else Double.NaN
    }

    private fun sma(v: List<Double>, n: Int): Double = if (v.size >= n) v.takeLast(n).average() else Double.NaN

    private fun ema(v: List<Double>, n: Int): Double {
        if (v.size < n) return Double.NaN
        val k = 2.0 / (n + 1.0)
        var e = v.take(n).average()
        for (i in n until v.size) e = v[i] * k + e * (1.0 - k)
        return e
    }

    private fun rsi(v: List<Double>, n: Int): Double {
        if (v.size <= n) return Double.NaN
        var gain = 0.0; var loss = 0.0
        for (i in 1..n) { val d = v[i] - v[i - 1]; if (d >= 0) gain += d else loss -= d }
        var ag = gain / n; var al = loss / n
        for (i in n + 1 until v.size) {
            val d = v[i] - v[i - 1]; val g = max(d, 0.0); val l = max(-d, 0.0)
            ag = (ag * (n - 1) + g) / n; al = (al * (n - 1) + l) / n
        }
        return if (al == 0.0) 100.0 else 100.0 - 100.0 / (1.0 + ag / al)
    }

    private fun atr(x: List<Candle>, n: Int): Double {
        if (x.size <= n) return Double.NaN
        val tr = mutableListOf<Double>()
        for (i in 1 until x.size) {
            val c = x[i]; val pc = x[i - 1].close
            tr += max(c.high - c.low, max(abs(c.high - pc), abs(c.low - pc)))
        }
        var a = tr.take(n).average()
        for (i in n until tr.size) a = (a * (n - 1) + tr[i]) / n
        return a
    }

    private fun adx(x: List<Candle>, n: Int): Double {
        if (x.size < n + 2) return Double.NaN
        val trs = mutableListOf<Double>(); val plus = mutableListOf<Double>(); val minus = mutableListOf<Double>()
        for (i in 1 until x.size) {
            val c = x[i]; val p = x[i - 1]
            trs += max(c.high - c.low, max(abs(c.high - p.close), abs(c.low - p.close)))
            val up = c.high - p.high; val down = p.low - c.low
            plus += if (up > down && up > 0) up else 0.0
            minus += if (down > up && down > 0) down else 0.0
        }
        if (trs.size < n) return Double.NaN
        val dx = mutableListOf<Double>()
        for (end in n..trs.size) {
            val tr = trs.subList(end - n, end).sum()
            val p = plus.subList(end - n, end).sum(); val m = minus.subList(end - n, end).sum()
            if (tr <= 0) continue
            val pdi = 100 * p / tr; val mdi = 100 * m / tr
            if (pdi + mdi > 0) dx += 100 * abs(pdi - mdi) / (pdi + mdi)
        }
        return if (dx.isEmpty()) Double.NaN else dx.takeLast(min(n, dx.size)).average()
    }

    private fun macd(v: List<Double>): Triple<Double, Double, Double> {
        if (v.size < 35) return Triple(Double.NaN, Double.NaN, Double.NaN)
        fun series(n: Int): List<Double> {
            val k = 2.0 / (n + 1.0); var e = v.first(); val out = mutableListOf<Double>()
            for (q in v) { e = q * k + e * (1 - k); out += e }
            return out
        }
        val e12 = series(12); val e26 = series(26); val line = e12.indices.map { e12[it] - e26[it] }
        val k = 2.0 / 10.0; var signal = line.first(); for (q in line) signal = q * k + signal * (1 - k)
        return Triple(line.last(), signal, line.last() - signal)
    }

    private data class Boll(val first: Double, val second: Double, val third: Double, val fourth: Double)
    private fun bollinger(v: List<Double>, n: Int, mult: Double): Boll {
        if (v.size < n) return Boll(Double.NaN, Double.NaN, Double.NaN, Double.NaN)
        val z = v.takeLast(n); val mid = z.average(); val sd = sqrt(z.sumOf { (it - mid).pow(2) } / n)
        val lo = mid - mult * sd; val hi = mid + mult * sd
        return Boll(lo, mid, hi, if (mid != 0.0) (hi - lo) / mid * 100 else Double.NaN)
    }

    private fun realizedVolatility(v: List<Double>, n: Int): Double {
        if (n < 2 || v.size <= n) return Double.NaN
        val r = mutableListOf<Double>()
        for (i in v.size - n until v.size) if (v[i - 1] > 0) r += ln(v[i] / v[i - 1])
        val m = r.average(); return sqrt(r.sumOf { (it - m).pow(2) } / max(1, r.size - 1)) * 100.0
    }

    private fun pivots(x: List<Candle>, high: Boolean): List<Pair<Int, Double>> {
        val out = mutableListOf<Pair<Int, Double>>()
        val wing = 3
        for (i in wing until x.size - wing) {
            val p = if (high) x[i].high else x[i].low
            var ok = true
            for (j in i - wing..i + wing) if (j != i) {
                if (high && x[j].high >= p) ok = false
                if (!high && x[j].low <= p) ok = false
            }
            if (ok) out += i to p
        }
        return out
    }

    private fun structure(highs: List<Pair<Int, Double>>, lows: List<Pair<Int, Double>>): String {
        if (highs.size < 2 || lows.size < 2) return "INSUFFICIENT"
        val h1 = highs[highs.lastIndex - 1].second; val h2 = highs.last().second
        val l1 = lows[lows.lastIndex - 1].second; val l2 = lows.last().second
        return when {
            h2 > h1 && l2 > l1 -> "HH_HL_BULLISH"
            h2 < h1 && l2 < l1 -> "LH_LL_BEARISH"
            else -> "MIXED_OR_RANGE"
        }
    }

    private fun trend(price: Double, e20: Double, e50: Double, e200: Double, adx: Double): String {
        val bull = price > e20 && e20 > e50 && (!e200.isFinite() || e50 > e200)
        val bear = price < e20 && e20 < e50 && (!e200.isFinite() || e50 < e200)
        return when {
            bull && adx.isFinite() && adx >= 25 -> "BULL_STRONG"
            bull -> "BULL"
            bear && adx.isFinite() && adx >= 25 -> "BEAR_STRONG"
            bear -> "BEAR"
            adx.isFinite() && adx < 18 -> "RANGE"
            else -> "NEUTRAL"
        }
    }

    private fun projectedTrendline(points: List<Pair<Int, Double>>, now: Int): Double {
        if (points.size < 2) return Double.NaN
        val a = points[points.lastIndex - 1]; val b = points.last()
        if (a.first == b.first) return Double.NaN
        return a.second + (b.second - a.second) / (b.first - a.first).toDouble() * (now - a.first)
    }

    private fun Double.json(): Any = if (isFinite()) this else JSONObject.NULL
}
