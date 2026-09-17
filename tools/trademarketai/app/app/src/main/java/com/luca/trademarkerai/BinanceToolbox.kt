package com.luca.trademarkerai

import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import kotlin.math.max
import kotlin.math.min

class BinanceToolbox(private val apiKey: String = "") {
    private val spotBase = "https://api.binance.com"
    private val futuresBase = "https://fapi.binance.com"
    private val symbolRe = Regex("^[A-Z0-9]{4,24}$")
    private val intervals = setOf("1m","3m","5m","15m","30m","1h","2h","4h","6h","8h","12h","1d","3d","1w","1M")

    fun execute(name: String, args: JSONObject): String = when (name) {
        "market_overview" -> marketOverview(args.optInt("limit", 40)).toString()
        "technical_snapshot" -> technicalSnapshot(args.reqSymbol(), args.reqInterval(), args.optInt("candles", 250)).toString()
        "multi_timeframe_snapshot" -> multiTimeframe(args.reqSymbol()).toString()
        "klines" -> rawKlines(args.reqSymbol(), args.reqInterval(), args.optInt("limit", 120)).toString()
        "order_book" -> orderBook(args.reqSymbol(), args.optInt("limit", 50)).toString()
        "recent_trades" -> recentTrades(args.reqSymbol(), args.optInt("limit", 60)).toString()
        "futures_snapshot" -> futuresSnapshot(args.reqSymbol(), args.optString("period", "4h")).toString()
        "correlation" -> correlation(args.reqSymbol("symbolA"), args.reqSymbol("symbolB"), args.reqInterval(), args.optInt("limit", 120)).toString()
        else -> JSONObject().put("error", "Tool sconosciuto: $name").toString()
    }

    fun ping(): Boolean = try { get(spotBase, "/api/v3/ping"); true } catch (_: Exception) { false }

    private fun marketOverview(requested: Int): JSONObject {
        val limit = requested.coerceIn(10, 80)
        val exchange = JSONObject(get(spotBase, "/api/v3/exchangeInfo"))
        val allowed = hashSetOf<String>()
        val symbols = exchange.getJSONArray("symbols")
        for (i in 0 until symbols.length()) {
            val s = symbols.getJSONObject(i)
            if (s.optString("status") == "TRADING" && s.optString("quoteAsset") == "USDT" && spotAllowed(s)) allowed += s.getString("symbol")
        }
        val bookMap = HashMap<String, Pair<Double, Double>>()
        val books = JSONArray(get(spotBase, "/api/v3/ticker/bookTicker"))
        for (i in 0 until books.length()) {
            val o = books.getJSONObject(i)
            bookMap[o.getString("symbol")] = (o.optString("bidPrice").toDoubleOrNull() ?: 0.0) to (o.optString("askPrice").toDoubleOrNull() ?: 0.0)
        }
        val stableBases = setOf("USDC","FDUSD","TUSD","USDP","DAI","AEUR","EURI","BUSD","USTC")
        val arr = JSONArray(get(spotBase, "/api/v3/ticker/24hr"))
        val list = mutableListOf<JSONObject>()
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i); val symbol = o.optString("symbol")
            if (symbol !in allowed || !symbol.endsWith("USDT") || symbol.removeSuffix("USDT") in stableBases) continue
            val price = o.optString("lastPrice").toDoubleOrNull() ?: continue
            val qv = o.optString("quoteVolume").toDoubleOrNull() ?: 0.0
            val b = bookMap[symbol] ?: (0.0 to 0.0)
            val spread = if (b.first > 0 && b.second > 0) (b.second - b.first) / ((b.first + b.second) / 2.0) * 100.0 else 999.0
            if (price <= 0 || qv <= 0 || spread > 1.0) continue
            list += JSONObject()
                .put("symbol", symbol).put("price", price)
                .put("change24hPct", o.optString("priceChangePercent").toDoubleOrNull())
                .put("quoteVolume24h", qv).put("trades24h", o.optLong("count", 0))
                .put("high24h", o.optString("highPrice").toDoubleOrNull())
                .put("low24h", o.optString("lowPrice").toDoubleOrNull())
                .put("bid", b.first).put("ask", b.second).put("spreadPct", spread)
        }
        list.sortByDescending { it.optDouble("quoteVolume24h", 0.0) }
        val out = JSONArray(); list.take(limit).forEach { out.put(it) }
        return JSONObject().put("source", "Binance Spot public market data").put("quoteAsset", "USDT").put("returned", out.length())
            .put("note", "Ordinato per quote volume 24h; stablecoin/stablecoin escluse. GPT deve decidere cosa approfondire.").put("markets", out)
    }

    private fun technicalSnapshot(symbol: String, interval: String, requested: Int): JSONObject {
        val candles = candles(symbol, interval, requested.coerceIn(60, 500), false)
        return JSONObject().put("symbol", symbol).put("source", "Binance Spot klines + calcoli deterministici locali")
            .put("candlesUsed", candles.size).put("analysis", TechnicalAnalysis.snapshot(candles, interval))
    }

    private fun multiTimeframe(symbol: String): JSONObject {
        val result = JSONObject().put("symbol", symbol).put("source", "Binance Spot")
        linkedMapOf("1w" to 140, "1d" to 300, "4h" to 300, "1h" to 300, "15m" to 240).forEach { (tf, n) ->
            try { result.put(tf, TechnicalAnalysis.snapshot(candles(symbol, tf, n, false), tf)) }
            catch (e: Exception) { result.put(tf, JSONObject().put("error", e.message ?: "errore")) }
        }
        return result
    }

    private fun rawKlines(symbol: String, interval: String, requested: Int): JSONObject {
        val cs = candles(symbol, interval, requested.coerceIn(20, 300), false)
        val a = JSONArray()
        cs.forEach { c -> a.put(JSONArray().put(c.openTime).put(c.open).put(c.high).put(c.low).put(c.close).put(c.volume).put(c.closeTime).put(c.takerBuyVolume)) }
        return JSONObject().put("symbol", symbol).put("interval", interval).put("returned", a.length())
            .put("columns", JSONArray(listOf("openTime","open","high","low","close","volume","closeTime","takerBuyBaseVolume"))).put("candles", a)
    }

    private fun orderBook(symbol: String, requested: Int): JSONObject {
        val limit = when { requested <= 5 -> 5; requested <= 10 -> 10; requested <= 20 -> 20; requested <= 50 -> 50; else -> 100 }
        val root = JSONObject(get(spotBase, "/api/v3/depth?symbol=${enc(symbol)}&limit=$limit"))
        val bids = root.getJSONArray("bids"); val asks = root.getJSONArray("asks")
        var bidNotional = 0.0; var askNotional = 0.0
        for (i in 0 until bids.length()) { val z = bids.getJSONArray(i); bidNotional += z.getString(0).toDouble() * z.getString(1).toDouble() }
        for (i in 0 until asks.length()) { val z = asks.getJSONArray(i); askNotional += z.getString(0).toDouble() * z.getString(1).toDouble() }
        val bestBid = if (bids.length() > 0) bids.getJSONArray(0).getString(0).toDouble() else 0.0
        val bestAsk = if (asks.length() > 0) asks.getJSONArray(0).getString(0).toDouble() else 0.0
        val imbalance = if (bidNotional + askNotional > 0) (bidNotional - askNotional) / (bidNotional + askNotional) else 0.0
        return JSONObject().put("symbol", symbol).put("levels", limit).put("bestBid", bestBid).put("bestAsk", bestAsk)
            .put("spreadPct", if (bestBid > 0 && bestAsk > 0) (bestAsk - bestBid) / ((bestAsk + bestBid) / 2) * 100 else JSONObject.NULL)
            .put("bidNotional", bidNotional).put("askNotional", askNotional).put("imbalance", imbalance)
            .put("bids", trimBook(bids, min(limit, 30))).put("asks", trimBook(asks, min(limit, 30)))
            .put("warning", "Order book è uno snapshot e può cambiare rapidamente; non trattare wall come certezza.")
    }

    private fun recentTrades(symbol: String, requested: Int): JSONObject {
        val limit = requested.coerceIn(10, 200)
        val arr = JSONArray(get(spotBase, "/api/v3/trades?symbol=${enc(symbol)}&limit=$limit"))
        var takerSellNotional = 0.0; var takerBuyNotional = 0.0
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i); val n = o.getString("price").toDouble() * o.getString("qty").toDouble()
            if (o.optBoolean("isBuyerMaker")) takerSellNotional += n else takerBuyNotional += n
        }
        val ratio = takerBuyNotional / max(1e-12, takerBuyNotional + takerSellNotional)
        return JSONObject().put("symbol", symbol).put("trades", arr.length()).put("takerBuyNotional", takerBuyNotional)
            .put("takerSellNotional", takerSellNotional).put("takerBuyRatio", ratio)
            .put("sample", JSONArray().also { out -> for (i in max(0, arr.length() - 30) until arr.length()) out.put(arr.getJSONObject(i)) })
    }

    private fun futuresSnapshot(symbol: String, periodRaw: String): JSONObject {
        val period = if (periodRaw in setOf("5m","15m","30m","1h","2h","4h","6h","12h","1d")) periodRaw else "4h"
        val out = JSONObject().put("symbol", symbol).put("period", period).put("source", "Binance USD-M Futures public data")
        try {
            val premium = JSONObject(get(futuresBase, "/fapi/v1/premiumIndex?symbol=${enc(symbol)}"))
            out.put("markPrice", premium.optString("markPrice").toDoubleOrNull()).put("indexPrice", premium.optString("indexPrice").toDoubleOrNull())
                .put("lastFundingRate", premium.optString("lastFundingRate").toDoubleOrNull()).put("nextFundingTime", premium.optLong("nextFundingTime"))
        } catch (e: Exception) { out.put("premiumIndexError", e.message) }
        try { out.put("openInterest", JSONObject(get(futuresBase, "/fapi/v1/openInterest?symbol=${enc(symbol)}")).optString("openInterest").toDoubleOrNull()) }
        catch (e: Exception) { out.put("openInterestError", e.message) }
        try { out.put("globalLongShortRatio", JSONArray(get(futuresBase, "/futures/data/globalLongShortAccountRatio?symbol=${enc(symbol)}&period=$period&limit=12"))) }
        catch (e: Exception) { out.put("longShortError", e.message) }
        try { out.put("takerLongShortRatio", JSONArray(get(futuresBase, "/futures/data/takerlongshortRatio?symbol=${enc(symbol)}&period=$period&limit=12"))) }
        catch (e: Exception) { out.put("takerRatioError", e.message) }
        try { out.put("openInterestHistory", JSONArray(get(futuresBase, "/futures/data/openInterestHist?symbol=${enc(symbol)}&period=$period&limit=12"))) }
        catch (e: Exception) { out.put("oiHistoryError", e.message) }
        return out
    }

    private fun correlation(a: String, b: String, interval: String, requested: Int): JSONObject {
        val n = requested.coerceIn(30, 300)
        val ca = candles(a, interval, n + 1, false); val cb = candles(b, interval, n + 1, false)
        return JSONObject().put("symbolA", a).put("symbolB", b).put("interval", interval).put("samples", min(ca.size, cb.size) - 1)
            .put("pearsonLogReturnCorrelation", TechnicalAnalysis.correlation(ca, cb, n))
    }

    private fun candles(symbol: String, interval: String, requested: Int, futures: Boolean): List<Candle> {
        validateSymbol(symbol); require(interval in intervals) { "Intervallo non supportato: $interval" }
        val n = requested.coerceIn(20, 500)
        val base = if (futures) futuresBase else spotBase; val path = if (futures) "/fapi/v1/klines" else "/api/v3/klines"
        val a = JSONArray(get(base, "$path?symbol=${enc(symbol)}&interval=${enc(interval)}&limit=$n"))
        return (0 until a.length()).map { i ->
            val q = a.getJSONArray(i)
            Candle(q.getLong(0), q.getString(1).toDouble(), q.getString(2).toDouble(), q.getString(3).toDouble(), q.getString(4).toDouble(), q.getString(5).toDouble(), q.getLong(6), q.getString(9).toDouble())
        }
    }

    private fun trimBook(a: JSONArray, n: Int): JSONArray = JSONArray().also { out -> for (i in 0 until min(n, a.length())) out.put(a.getJSONArray(i)) }
    private fun spotAllowed(s: JSONObject): Boolean {
        val permissions = s.optJSONArray("permissions") ?: return true
        for (i in 0 until permissions.length()) if (permissions.optString(i) == "SPOT") return true
        return permissions.length() == 0
    }
    private fun JSONObject.reqSymbol(name: String = "symbol"): String = optString(name).uppercase().also { validateSymbol(it) }
    private fun JSONObject.reqInterval(): String = optString("interval").also { require(it in intervals) { "Intervallo non supportato: $it" } }
    private fun validateSymbol(s: String) { require(symbolRe.matches(s)) { "Symbol non valido" } }
    private fun enc(v: String): String = URLEncoder.encode(v, "UTF-8")

    private fun get(base: String, path: String): String {
        val c = URL(base + path).openConnection() as HttpURLConnection
        c.requestMethod = "GET"; c.connectTimeout = 12_000; c.readTimeout = 25_000
        c.setRequestProperty("Accept", "application/json")
        if (apiKey.isNotBlank()) c.setRequestProperty("X-MBX-APIKEY", apiKey)
        val code = c.responseCode
        val stream = if (code in 200..299) c.inputStream else c.errorStream
        val txt = BufferedReader(InputStreamReader(stream)).use { it.readText() }
        c.disconnect()
        if (code !in 200..299) throw IllegalStateException("Binance HTTP $code: ${txt.take(220)}")
        return txt
    }
}
