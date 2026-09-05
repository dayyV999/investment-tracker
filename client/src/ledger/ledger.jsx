import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid,
  PolarAngleAxis, Radar,
} from "recharts";
import {
  LayoutGrid, CandlestickChart as MarketsIcon, Newspaper, WalletMinimal, Handshake,
  Search, Bell, Settings2, ArrowUpRight, ArrowDownRight, ChevronRight,
  Plus, X, ShieldCheck, Radio, ChevronDown, Link2, ArrowRightLeft,
  Landmark, CircleDollarSign, TrendingUp, Filter, PlayCircle, Lock,
  RotateCcw, Check, Clock, AlertCircle, Wifi, RefreshCw, AlertTriangle,
  KeyRound, ExternalLink, WifiOff, PauseCircle, Star,
} from "lucide-react";

/* ---------------------------------------------------------------
   TOKENS
----------------------------------------------------------------*/
const C = {
  bg: "#0A0D13",
  bgSoft: "#0D111A",
  surface: "#12161F",
  surface2: "#181D29",
  border: "#232939",
  borderSoft: "#1A2030",
  text: "#EAEDF3",
  textDim: "#8B93A9",
  textFaint: "#5B6478",
  gold: "#C9A45C",
  goldSoft: "#E8D4A0",
  mint: "#39D6A0",
  mintSoft: "rgba(57,214,160,0.12)",
  rose: "#E8637A",
  roseSoft: "rgba(232,99,122,0.12)",
  signal: "#5B8DEF",
  signalSoft: "rgba(91,141,239,0.12)",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
`;

/* ---------------------------------------------------------------
   MOCK DATA
----------------------------------------------------------------*/
const SEED = {
  futures: [
    { sym: "NQ", name: "E-mini Nasdaq-100", price: 21584.25, vol: 0.28, mktCap: "$20/tick", volume: "312K" },
    { sym: "MNQ", name: "Micro E-mini Nasdaq-100", price: 21584.25, vol: 0.28, mktCap: "$2/tick", volume: "1.1M" },
    { sym: "ES", name: "E-mini S&P 500", price: 6428.50, vol: 0.18, mktCap: "$50/tick", volume: "1.4M" },
    { sym: "MES", name: "Micro E-mini S&P 500", price: 6428.50, vol: 0.18, mktCap: "$5/tick", volume: "2.6M" },
    { sym: "YM", name: "E-mini Dow", price: 44512, vol: 0.16, mktCap: "$5/tick", volume: "98K" },
    { sym: "MYM", name: "Micro E-mini Dow", price: 44512, vol: 0.16, mktCap: "$0.50/tick", volume: "410K" },
    { sym: "RTY", name: "E-mini Russell 2000", price: 2318.4, vol: 0.24, mktCap: "$50/tick", volume: "156K" },
    { sym: "M2K", name: "Micro E-mini Russell 2000", price: 2318.4, vol: 0.24, mktCap: "$5/tick", volume: "340K" },
    { sym: "CL", name: "Crude Oil", price: 68.42, vol: 0.32, mktCap: "$10/tick", volume: "520K" },
    { sym: "GC", name: "Gold", price: 3412.7, vol: 0.19, mktCap: "$10/tick", volume: "245K" },
  ],
  stocks: [
    { sym: "AAPL", name: "Apple Inc.", price: 231.42, vol: 0.15, mktCap: "3.5T", volume: "48.2M" },
    { sym: "MSFT", name: "Microsoft Corp.", price: 468.10, vol: 0.14, mktCap: "3.4T", volume: "19.6M" },
    { sym: "NVDA", name: "NVIDIA Corp.", price: 172.88, vol: 0.35, mktCap: "4.2T", volume: "162M" },
    { sym: "AMZN", name: "Amazon.com", price: 228.55, vol: 0.22, mktCap: "2.4T", volume: "31.4M" },
    { sym: "GOOGL", name: "Alphabet Cl. A", price: 194.20, vol: 0.18, mktCap: "2.3T", volume: "22.8M" },
    { sym: "META", name: "Meta Platforms", price: 712.30, vol: 0.24, mktCap: "1.8T", volume: "12.1M" },
    { sym: "TSLA", name: "Tesla Inc.", price: 318.77, vol: 0.48, mktCap: "1.0T", volume: "88.7M" },
    { sym: "JPM", name: "JPMorgan Chase", price: 268.05, vol: 0.11, mktCap: "760B", volume: "7.9M" },
  ],
  crypto: [
    { sym: "BTC", name: "Bitcoin", price: 112480, vol: 0.55, mktCap: "2.2T", volume: "$38.1B" },
    { sym: "ETH", name: "Ethereum", price: 4210.6, vol: 0.62, mktCap: "508B", volume: "$19.4B" },
    { sym: "SOL", name: "Solana", price: 198.4, vol: 0.9, mktCap: "104B", volume: "$6.2B" },
    { sym: "XRP", name: "XRP", price: 2.84, vol: 0.7, mktCap: "164B", volume: "$4.8B" },
    { sym: "ADA", name: "Cardano", price: 0.92, vol: 0.65, mktCap: "33B", volume: "$980M" },
  ],
  forex: [
    { sym: "EUR/USD", name: "Euro / US Dollar", price: 1.0862, vol: 0.03, mktCap: "—", volume: "—" },
    { sym: "GBP/USD", name: "Pound / US Dollar", price: 1.2711, vol: 0.035, mktCap: "—", volume: "—" },
    { sym: "USD/JPY", name: "Dollar / Yen", price: 156.42, vol: 0.05, mktCap: "—", volume: "—" },
    { sym: "USD/CAD", name: "Dollar / Cad. Dollar", price: 1.3688, vol: 0.03, mktCap: "—", volume: "—" },
  ],
  etfs: [
    { sym: "VOO", name: "Vanguard S&P 500", price: 588.14, vol: 0.09, mktCap: "612B AUM", volume: "4.1M" },
    { sym: "QQQ", name: "Invesco QQQ Trust", price: 521.63, vol: 0.13, mktCap: "344B AUM", volume: "38.9M" },
    { sym: "SPY", name: "SPDR S&P 500", price: 604.22, vol: 0.09, mktCap: "628B AUM", volume: "62.3M" },
    { sym: "ARKK", name: "ARK Innovation", price: 61.38, vol: 0.4, mktCap: "5.8B AUM", volume: "5.7M" },
  ],
};

const HOLDINGS = [
  { sym: "AAPL", cat: "stocks", qty: 18, costBasis: 187.20 },
  { sym: "NVDA", cat: "stocks", qty: 40, costBasis: 96.40 },
  { sym: "VOO", cat: "etfs", qty: 22, costBasis: 512.85 },
  { sym: "BTC", cat: "crypto", qty: 0.42, costBasis: 84210 },
  { sym: "ETH", cat: "crypto", qty: 3.1, costBasis: 3180 },
];
const CASH_BALANCE = 8420.55;

const TRIAL_DAYS = 30;
const DEMO_STARTING_CASH = 100000;

const PLANS = [
  { name: "Trader", price: "$19", period: "/mo", features: ["Live simulated feeds, all asset classes", "Unlimited demo trades", "Standard news feed", "1 linked account"] },
  { name: "Pro", price: "$49", period: "/mo", featured: true, features: ["Everything in Trader", "Advanced analytics & risk panel", "Order book + Level II depth", "Unlimited linked accounts", "Priority data refresh"] },
  { name: "Desk", price: "$149", period: "/mo", features: ["Everything in Pro", "Team seats (5 included)", "API access for your own bots", "Dedicated onboarding"] },
];

const NEWS = [
  { tag: "Fed", sentiment: "neutral", src: "Market Wire", t: "38m ago", head: "Fed officials signal patience before next rate move, minutes show" },
  { tag: "Earnings", sentiment: "positive", src: "Desk Notes", t: "1h ago", head: "Chipmakers rally after data-center demand outlook raised again" },
  { tag: "Crypto", sentiment: "positive", src: "Chain Report", t: "2h ago", head: "Bitcoin holds above key level as ETF inflows extend to a fifth week" },
  { tag: "Markets", sentiment: "negative", src: "Trading Floor", t: "3h ago", head: "Small caps lag as breadth narrows across major indices" },
  { tag: "Earnings", sentiment: "neutral", src: "Market Wire", t: "5h ago", head: "Retail sector earnings this week seen as read on consumer spend" },
  { tag: "Forex", sentiment: "negative", src: "Currency Desk", t: "6h ago", head: "Dollar softens against majors as yield spreads compress" },
  { tag: "Crypto", sentiment: "neutral", src: "Chain Report", t: "9h ago", head: "Ethereum network activity climbs ahead of scheduled upgrade" },
  { tag: "Markets", sentiment: "positive", src: "Desk Notes", t: "11h ago", head: "Volatility index slips to a three-month low on calmer sentiment" },
];

const PARTNERS = [
  { name: "Plaid", role: "Account linking", blurb: "Securely connects checking, savings, and brokerage accounts." },
  { name: "Alpaca Markets", role: "Trade execution", blurb: "Commission-free routing for equities and ETFs." },
  { name: "Polygon.io", role: "Market data", blurb: "Millisecond-latency quotes across stocks and options." },
  { name: "CoinGecko", role: "Crypto data", blurb: "Reference pricing across 200+ digital assets." },
  { name: "Yodlee", role: "Data aggregation", blurb: "Verified balances from 12,000+ institutions." },
  { name: "Stripe Treasury", role: "Cash management", blurb: "FDIC-eligible cash sweep for idle balances." },
];

function genHistory(base, vol, n = 30) {
  let v = base * (1 - vol * 0.12);
  const out = [];
  for (let i = 0; i < n; i++) {
    v = v * (1 + (Math.random() - 0.48) * vol * 0.045);
    out.push(v);
  }
  out[out.length - 1] = base;
  return out;
}

function buildBook(seed) {
  const book = {};
  Object.entries(seed).forEach(([cat, list]) => {
    book[cat] = list.map((a) => {
      const spread = a.vol * (0.35 + Math.random() * 0.25);
      const w52Low = a.price * (1 - spread);
      const w52High = a.price * (1 + spread * (0.6 + Math.random() * 0.6));
      return {
        ...a,
        prevClose: a.price / (1 + (Math.random() - 0.5) * a.vol * 0.06),
        history: genHistory(a.price, a.vol),
        w52Low, w52High,
      };
    });
  });
  return book;
}

/* ---------------------------------------------------------------
   HELPERS
----------------------------------------------------------------*/
const fmtUSD = (n, d = 2) =>
  n < 0
    ? "-$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })
    : "$" + n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

const fmtNum = (n, d = 4) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

const pctChange = (price, prev) => ((price - prev) / prev) * 100;

function findAsset(book, sym) {
  for (const cat of Object.keys(book)) {
    if (cat === "_movers") continue;
    const found = book[cat].find((a) => a.sym === sym);
    if (found) return { ...found, cat };
  }
  return null;
}

function allSymbols(book) {
  const out = [];
  Object.entries(book).forEach(([cat, list]) => {
    if (cat === "_movers") return;
    list.forEach((a) => out.push({ sym: a.sym, name: a.name, cat }));
  });
  return out;
}

/* ---------------------------------------------------------------
   REAL LIVE DATA FETCHERS
   Each hits a real external endpoint from the browser. Crypto and
   forex use free, keyless, CORS-open sources. Stocks/ETFs need a
   personal Finnhub API key (free tier) since that data isn’t
   redistributable without one. Futures have no equivalent free
   source — CME data requires a paid, licensed broker/vendor feed.
----------------------------------------------------------------*/
const CRYPTO_ID_MAP = { bitcoin: "BTC", ethereum: "ETH", solana: "SOL", ripple: "XRP", cardano: "ADA" };

async function fetchCryptoLive() {
  const ids = Object.keys(CRYPTO_ID_MAP).join(",");
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
  if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
  const json = await res.json();
  const out = {};
  Object.entries(CRYPTO_ID_MAP).forEach(([id, sym]) => {
    if (json[id] && typeof json[id].usd === "number") {
      out[sym] = { price: json[id].usd, chgPct: json[id].usd_24h_change };
    }
  });
  if (Object.keys(out).length === 0) throw new Error("CoinGecko returned no usable prices");
  return out;
}

async function fetchForexLive() {
  const res = await fetch("https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY,CAD");
  if (!res.ok) throw new Error(`Frankfurter HTTP ${res.status}`);
  const json = await res.json();
  const r = json.rates || {};
  const out = {};
  if (r.EUR) out["EUR/USD"] = { price: 1 / r.EUR };
  if (r.GBP) out["GBP/USD"] = { price: 1 / r.GBP };
  if (r.JPY) out["USD/JPY"] = { price: r.JPY };
  if (r.CAD) out["USD/CAD"] = { price: r.CAD };
  if (Object.keys(out).length === 0) throw new Error("Frankfurter returned no usable rates");
  return out;
}

async function fetchStocksLive(symbols, key) {
  if (!key) throw new Error("No Finnhub API key configured");
  const results = await Promise.all(symbols.map(async (sym) => {
    try {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${encodeURIComponent(key)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json && typeof json.c === "number" && json.c > 0) {
        return [sym, { price: json.c, chgPct: json.dp }];
      }
      return null;
    } catch (e) {
      return null;
    }
  }));
  const out = {};
  results.forEach((r) => { if (r) out[r[0]] = r[1]; });
  if (Object.keys(out).length === 0) throw new Error("Finnhub returned no usable quotes — check your API key");
  return out;
}

/* ---------------------------------------------------------------
   SPARKLINE (lightweight inline SVG, no recharts overhead per row)
----------------------------------------------------------------*/
function Sparkline({ data, positive, width = 88, height = 30 }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const color = positive ? C.mint : C.rose;
  const areaPts = `0,${height} ${pts} ${width},${height}`;
  return (
    <svg width={width} height={height} style={{ display: "block", overflow: "visible" }}>
      <polyline points={areaPts} fill={color} opacity={0.08} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function RangeBar({ low, high, price, width = 76 }) {
  const pct = Math.min(100, Math.max(0, ((price - low) / (high - low || 1)) * 100));
  return (
    <div style={{ width }}>
      <div style={{ position: "relative", height: 3, borderRadius: 3, background: C.border }}>
        <div style={{ position: "absolute", left: `calc(${pct}% - 3px)`, top: -2.5, width: 8, height: 8, borderRadius: 8, background: C.gold, border: `2px solid ${C.surface}` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: C.textFaint }}>{low >= 1000 ? (low / 1000).toFixed(1) + "k" : low.toFixed(2)}</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: C.textFaint }}>{high >= 1000 ? (high / 1000).toFixed(1) + "k" : high.toFixed(2)}</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   TICKER TAPE (signature element)
----------------------------------------------------------------*/
function TickerTape({ book, onPick }) {
  const flat = useMemo(() => {
    const all = [];
    Object.entries(book).forEach(([cat, list]) => list.forEach((a) => all.push(a)));
    return [...all, ...all];
  }, [book]);

  return (
    <div
      style={{
        background: C.bgSoft,
        borderBottom: `1px solid ${C.borderSoft}`,
        borderTop: `1px solid ${C.borderSoft}`,
        overflow: "hidden",
        position: "relative",
        height: 34,
      }}
    >
      <div className="tape-track" style={{ display: "flex", alignItems: "center", height: "100%", width: "max-content" }}>
        {flat.map((a, i) => {
          const chg = pctChange(a.price, a.prevClose);
          const up = chg >= 0;
          return (
            <button
              key={i}
              onClick={() => onPick && onPick(a.sym)}
              title={`Open ${a.sym} in Demo Trading`}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "0 20px", whiteSpace: "nowrap", background: "transparent", border: "none", cursor: onPick ? "pointer" : "default", height: "100%" }}
            >
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, letterSpacing: 0.4, color: C.textDim }}>{a.sym}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: C.text }}>
                {a.sym.includes("/") ? fmtNum(a.price, 4) : a.price >= 1000 ? a.price.toLocaleString("en-US", { maximumFractionDigits: 0 }) : fmtNum(a.price, 2)}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: up ? C.mint : C.rose }}>
                {up ? "▲" : "▼"} {Math.abs(chg).toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   CANDLESTICK ENGINE
----------------------------------------------------------------*/
const TIMEFRAMES = [
  { id: "1m", bars: 90, volMult: 0.5, labelFmt: (t) => new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) },
  { id: "5m", bars: 90, volMult: 0.8, labelFmt: (t) => new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) },
  { id: "1H", bars: 72, volMult: 1.3, labelFmt: (t) => new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) },
  { id: "4H", bars: 60, volMult: 1.9, labelFmt: (t) => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
  { id: "1D", bars: 60, volMult: 2.8, labelFmt: (t) => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
];

function genCandleHistory(base, vol, n, volMult, stepMs) {
  const effVol = Math.max(vol, 0.03) * volMult;
  let price = base * (1 - effVol * 0.16);
  const now = Date.now();
  const out = [];
  for (let i = 0; i < n; i++) {
    const open = price;
    const drift = (Math.random() - 0.47) * effVol * 0.028;
    let close = Math.max(open * (1 + drift), 0.0001);
    const bodySpread = Math.abs(open - close);
    const wick = bodySpread * (0.5 + Math.random() * 1.4) + open * effVol * 0.0018;
    const high = Math.max(open, close) + wick * Math.random();
    const low = Math.max(Math.min(open, close) - wick * Math.random(), 0.0001);
    out.push({
      t: now - (n - i) * stepMs,
      o: open, h: high, l: low, c: close,
      v: Math.round(80 + Math.random() * 800 * volMult),
    });
    price = close;
  }
  out[out.length - 1] = { ...out[out.length - 1], c: base, h: Math.max(out[out.length - 1].h, base), l: Math.min(out[out.length - 1].l, base) };
  return out;
}

function useLiveCandles(price, vol, sym, timeframeId) {
  const tf = TIMEFRAMES.find((t) => t.id === timeframeId) || TIMEFRAMES[0];
  const stepMs = { "1m": 60000, "5m": 300000, "1H": 3600000, "4H": 14400000, "1D": 86400000 }[tf.id];
  const [candles, setCandles] = useState(() => (price ? genCandleHistory(price, vol || 0.15, tf.bars, tf.volMult, stepMs) : []));
  const seedKeyRef = useRef(`${sym}:${timeframeId}`);
  const tickRef = useRef(0);

  useEffect(() => {
    const key = `${sym}:${timeframeId}`;
    if (seedKeyRef.current !== key && price) {
      seedKeyRef.current = key;
      tickRef.current = 0;
      setCandles(genCandleHistory(price, vol || 0.15, tf.bars, tf.volMult, stepMs));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sym, timeframeId]);

  useEffect(() => {
    if (!price) return;
    setCandles((prev) => {
      if (prev.length === 0) return prev;
      tickRef.current += 1;
      const next = prev.slice();
      const last = { ...next[next.length - 1] };
      if (tickRef.current % 6 === 0) {
        next.push({ t: Date.now(), o: last.c, h: Math.max(last.c, price), l: Math.min(last.c, price), c: price, v: Math.round(80 + Math.random() * 500) });
        if (next.length > tf.bars) next.shift();
      } else {
        last.h = Math.max(last.h, price);
        last.l = Math.min(last.l, price);
        last.c = price;
        last.v += Math.round(Math.random() * 25);
        next[next.length - 1] = last;
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);

  return candles;
}

function computeSMA(candles, period) {
  const closes = candles.map((c) => c.c);
  return closes.map((_, i) => {
    if (i < period - 1) return null;
    let sum = 0;
    for (let k = i - period + 1; k <= i; k++) sum += closes[k];
    return sum / period;
  });
}

function computeEMA(candles, period) {
  const closes = candles.map((c) => c.c);
  const k = 2 / (period + 1);
  const out = new Array(closes.length).fill(null);
  let emaPrev = null;
  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) continue;
    if (emaPrev === null) {
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) sum += closes[j];
      emaPrev = sum / period;
    } else {
      emaPrev = closes[i] * k + emaPrev * (1 - k);
    }
    out[i] = emaPrev;
  }
  return out;
}

function computeBollinger(candles, period = 20, mult = 2) {
  const sma = computeSMA(candles, period);
  const closes = candles.map((c) => c.c);
  const upper = [], lower = [];
  for (let i = 0; i < closes.length; i++) {
    if (sma[i] == null) { upper.push(null); lower.push(null); continue; }
    let sumSq = 0;
    for (let k = i - period + 1; k <= i; k++) sumSq += Math.pow(closes[k] - sma[i], 2);
    const sd = Math.sqrt(sumSq / period);
    upper.push(sma[i] + mult * sd);
    lower.push(sma[i] - mult * sd);
  }
  return { upper, lower, mid: sma };
}

function computeRSI(candles, period = 14) {
  const closes = candles.map((c) => c.c);
  const out = new Array(closes.length).fill(null);
  if (closes.length < period + 1) return out;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  let avgGain = gains / period, avgLoss = losses / period;
  out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return out;
}

function seriesToPoints(series, xAt, yAt) {
  const pts = [];
  series.forEach((v, i) => { if (v != null && isFinite(v)) pts.push(`${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`); });
  return pts.join(" ");
}

const CHART_TYPES = [
  { id: "candles", label: "Candles" },
  { id: "line", label: "Line" },
  { id: "area", label: "Area" },
];

function CandlestickChart({ candles, timeframe, setTimeframe, sym, decimals = 2 }) {
  const [hover, setHover] = useState(null);
  const [chartType, setChartType] = useState("candles");
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(false);
  const [showBB, setShowBB] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  useEffect(() => { setHover(null); }, [sym, timeframe]);
  const RSI_H = 56, RSI_GAP = 14;
  const W = 780, H = 300, VH = 64, padTop = 10, padBottom = 6, axisW = 58;
  const plotW = W - axisW;

  if (!candles || candles.length === 0) {
    return <div style={{ height: H + VH + (showRSI ? RSI_H + RSI_GAP : 0), display: "flex", alignItems: "center", justifyContent: "center" }}><div className="ll-skel" style={{ width: "100%", height: "100%" }} /></div>;
  }

  const highs = candles.map((c) => c.h), lows = candles.map((c) => c.l), vols = candles.map((c) => c.v);
  const maxP = Math.max(...highs), minP = Math.min(...lows);
  const padP = (maxP - minP) * 0.08 || maxP * 0.01;
  const yMax = maxP + padP, yMin = minP - padP;
  const maxV = Math.max(...vols, 1);

  const n = candles.length;
  const slot = plotW / n;
  const bodyW = Math.max(slot * 0.58, 1.5);

  const xAt = (i) => i * slot + slot / 2;
  const yAt = (p) => padTop + (1 - (p - yMin) / (yMax - yMin || 1)) * (H - padTop - padBottom);
  const yVolAt = (v) => VH - (v / maxV) * (VH - 4);

  const gridLines = 4;
  const priceLabels = Array.from({ length: gridLines + 1 }).map((_, i) => yMin + ((yMax - yMin) * i) / gridLines);

  const smaData = showSMA ? computeSMA(candles, 20) : null;
  const emaData = showEMA ? computeEMA(candles, 50) : null;
  const bbData = showBB ? computeBollinger(candles, 20, 2) : null;
  const rsiData = showRSI ? computeRSI(candles, 14) : null;
  const smaLast = smaData ? [...smaData].reverse().find((v) => v != null) : null;
  const emaLast = emaData ? [...emaData].reverse().find((v) => v != null) : null;
  const rsiLast = rsiData ? [...rsiData].reverse().find((v) => v != null) : null;
  const closePts = seriesToPoints(candles.map((c) => c.c), xAt, yAt);
  const areaClosePts = closePts ? `${xAt(0).toFixed(1)},${(H - padBottom).toFixed(1)} ${closePts} ${xAt(n - 1).toFixed(1)},${(H - padBottom).toFixed(1)}` : "";
  const totalH = H + VH + (showRSI ? RSI_H + RSI_GAP : 0);
  const yRsiAt = (v) => H + VH + RSI_GAP + (1 - v / 100) * RSI_H;

  const fmtP = (p) => (sym && sym.includes("/") ? fmtNum(p, 4) : p >= 1000 ? p.toLocaleString("en-US", { maximumFractionDigits: 0 }) : fmtNum(p, decimals));

  const last = candles[candles.length - 1];
  const lastUp = last.c >= last.o;
  const hoverC = hover != null && hover < candles.length ? candles[hover] : null;

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.max(0, Math.min(n - 1, Math.floor(x / slot)));
    setHover(idx);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {CHART_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setChartType(t.id)}
              style={{
                padding: "4px 10px", borderRadius: 6, cursor: "pointer", border: "none",
                background: chartType === t.id ? C.surface2 : "transparent",
                fontFamily: "'Inter',sans-serif", fontSize: 10.5, fontWeight: 600,
                color: chartType === t.id ? C.text : C.textFaint,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {[
            { key: "sma", label: "SMA 20", on: showSMA, set: setShowSMA, color: C.gold },
            { key: "ema", label: "EMA 50", on: showEMA, set: setShowEMA, color: C.signal },
            { key: "bb", label: "Bollinger", on: showBB, set: setShowBB, color: C.textDim },
            { key: "rsi", label: "RSI 14", on: showRSI, set: setShowRSI, color: C.rose },
          ].map((ind) => (
            <button
              key={ind.key}
              onClick={() => ind.set((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 5, padding: "4px 9px", borderRadius: 6, cursor: "pointer",
                border: `1px solid ${ind.on ? "rgba(255,255,255,0.16)" : "transparent"}`,
                background: ind.on ? C.surface2 : "transparent",
                fontFamily: "'Inter',sans-serif", fontSize: 10.5, fontWeight: 600,
                color: ind.on ? C.text : C.textFaint,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: 6, background: ind.on ? ind.color : C.textFaint }} />
              {ind.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {TIMEFRAMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id)}
              style={{
                padding: "4px 11px", borderRadius: 6, cursor: "pointer", border: "none",
                background: timeframe === t.id ? C.surface2 : "transparent",
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
                color: timeframe === t.id ? C.gold : C.textFaint,
              }}
            >
              {t.id}
            </button>
          ))}
        </div>
        {hoverC ? (
          <div style={{ display: "flex", gap: 10, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, flexWrap: "wrap" }}>
            <span style={{ color: C.textFaint }}>O <span style={{ color: C.textDim }}>{fmtP(hoverC.o)}</span></span>
            <span style={{ color: C.textFaint }}>H <span style={{ color: C.textDim }}>{fmtP(hoverC.h)}</span></span>
            <span style={{ color: C.textFaint }}>L <span style={{ color: C.textDim }}>{fmtP(hoverC.l)}</span></span>
            <span style={{ color: C.textFaint }}>C <span style={{ color: hoverC.c >= hoverC.o ? C.mint : C.rose, fontWeight: 600 }}>{fmtP(hoverC.c)}</span></span>
            <span style={{ color: C.textFaint }}>Vol <span style={{ color: C.textDim }}>{hoverC.v}</span></span>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, alignItems: "center" }}>
            {showSMA && smaLast != null && <span style={{ color: C.gold }}>SMA20 {fmtP(smaLast)}</span>}
            {showEMA && emaLast != null && <span style={{ color: C.signal }}>EMA50 {fmtP(emaLast)}</span>}
            {showRSI && rsiLast != null && <span style={{ color: C.rose }}>RSI {rsiLast.toFixed(1)}</span>}
            <Pill tone="signal">Simulated live feed</Pill>
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${W} ${totalH}`}
        width="100%"
        style={{ display: "block", cursor: "crosshair" }}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {priceLabels.map((p, i) => (
          <g key={i}>
            <line x1={0} x2={plotW} y1={yAt(p)} y2={yAt(p)} stroke={C.borderSoft} strokeWidth={1} />
            <text x={plotW + 8} y={yAt(p) + 3} fontSize="9.5" fontFamily="'IBM Plex Mono', monospace" fill={C.textFaint}>{fmtP(p)}</text>
          </g>
        ))}

        <line x1={0} x2={plotW} y1={yAt(last.c)} y2={yAt(last.c)} stroke={lastUp ? C.mint : C.rose} strokeWidth={1} strokeDasharray="3,3" opacity={0.6} />
        <rect x={plotW + 2} y={yAt(last.c) - 8} width={axisW - 4} height={16} fill={lastUp ? C.mint : C.rose} opacity={0.9} rx={3} />
        <text x={plotW + 8} y={yAt(last.c) + 3} fontSize="9.5" fontWeight="700" fontFamily="'IBM Plex Mono', monospace" fill="#0A0D13">{fmtP(last.c)}</text>

        {showBB && bbData && (
          <>
            <polyline points={seriesToPoints(bbData.upper, xAt, yAt)} fill="none" stroke={C.textFaint} strokeWidth={1} strokeDasharray="2,2" opacity={0.6} />
            <polyline points={seriesToPoints(bbData.lower, xAt, yAt)} fill="none" stroke={C.textFaint} strokeWidth={1} strokeDasharray="2,2" opacity={0.6} />
          </>
        )}

        {chartType === "candles" && candles.map((c, i) => {
          const up = c.c >= c.o;
          const color = up ? C.mint : C.rose;
          const x = xAt(i);
          const yO = yAt(c.o), yC = yAt(c.c), yH = yAt(c.h), yL = yAt(c.l);
          return (
            <g key={i} opacity={hover === null || hover === i ? 1 : 0.55}>
              <line x1={x} x2={x} y1={yH} y2={yL} stroke={color} strokeWidth={1} />
              <rect x={x - bodyW / 2} y={Math.min(yO, yC)} width={bodyW} height={Math.max(Math.abs(yO - yC), 1)} fill={color} />
            </g>
          );
        })}

        {chartType === "area" && (
          <>
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lastUp ? C.mint : C.rose} stopOpacity={0.28} />
                <stop offset="100%" stopColor={lastUp ? C.mint : C.rose} stopOpacity={0} />
              </linearGradient>
            </defs>
            <polygon points={areaClosePts} fill="url(#areaFill)" stroke="none" />
            <polyline points={closePts} fill="none" stroke={lastUp ? C.mint : C.rose} strokeWidth={1.6} />
          </>
        )}

        {chartType === "line" && (
          <polyline points={closePts} fill="none" stroke={lastUp ? C.mint : C.rose} strokeWidth={1.6} />
        )}

        {showSMA && smaData && <polyline points={seriesToPoints(smaData, xAt, yAt)} fill="none" stroke={C.gold} strokeWidth={1.4} />}
        {showEMA && emaData && <polyline points={seriesToPoints(emaData, xAt, yAt)} fill="none" stroke={C.signal} strokeWidth={1.4} />}

        {hover !== null && (
          <line x1={xAt(hover)} x2={xAt(hover)} y1={0} y2={H} stroke={C.textFaint} strokeWidth={1} strokeDasharray="2,3" />
        )}

        <g transform={`translate(0, ${H + 6})`}>
          {candles.map((c, i) => {
            const up = c.c >= c.o;
            const x = xAt(i);
            const h = (c.v / maxV) * (VH - 4);
            return <rect key={i} x={x - bodyW / 2} y={VH - h} width={bodyW} height={h} fill={up ? C.mint : C.rose} opacity={0.35} />;
          })}
        </g>

        {showRSI && rsiData && (
          <g>
            <line x1={0} x2={plotW} y1={yRsiAt(70)} y2={yRsiAt(70)} stroke={C.borderSoft} strokeWidth={1} strokeDasharray="2,2" />
            <line x1={0} x2={plotW} y1={yRsiAt(30)} y2={yRsiAt(30)} stroke={C.borderSoft} strokeWidth={1} strokeDasharray="2,2" />
            <text x={plotW + 8} y={yRsiAt(70) + 3} fontSize="8.5" fontFamily="'IBM Plex Mono', monospace" fill={C.textFaint}>70</text>
            <text x={plotW + 8} y={yRsiAt(30) + 3} fontSize="8.5" fontFamily="'IBM Plex Mono', monospace" fill={C.textFaint}>30</text>
            <polyline
              points={rsiData.map((v, i) => (v != null ? `${xAt(i).toFixed(1)},${yRsiAt(v).toFixed(1)}` : null)).filter(Boolean).join(" ")}
              fill="none" stroke={C.rose} strokeWidth={1.3}
            />
          </g>
        )}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: C.textFaint }}>{TIMEFRAMES.find((t) => t.id === timeframe)?.labelFmt(candles[0].t)}</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: C.textFaint }}>{TIMEFRAMES.find((t) => t.id === timeframe)?.labelFmt(candles[candles.length - 1].t)}</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SMALL UI ATOMS
----------------------------------------------------------------*/
function Pill({ children, tone = "dim" }) {
  const map = {
    dim: { bg: C.surface2, fg: C.textDim, bd: C.border },
    gold: { bg: "rgba(201,164,92,0.12)", fg: C.gold, bd: "rgba(201,164,92,0.35)" },
    mint: { bg: C.mintSoft, fg: C.mint, bd: "rgba(57,214,160,0.35)" },
    signal: { bg: C.signalSoft, fg: C.signal, bd: "rgba(91,141,239,0.35)" },
  };
  const s = map[tone];
  return (
    <span
      style={{
        background: s.bg, color: s.fg, border: `1px solid ${s.bd}`,
        fontSize: 11, fontFamily: "'Inter',sans-serif", fontWeight: 600,
        padding: "3px 9px", borderRadius: 20, letterSpacing: 0.3,
      }}
    >
      {children}
    </span>
  );
}

function Card({ children, style, className = "", ...rest }) {
  return (
    <div
      className={`ll-card ${className}`}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        boxShadow: "0 1px 2px rgba(0,0,0,0.24), 0 12px 28px -18px rgba(0,0,0,0.55)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, fontWeight: 700, letterSpacing: 1.1, color: C.textDim, textTransform: "uppercase" }}>
        {children}
      </div>
      {right}
    </div>
  );
}

/* ---------------------------------------------------------------
   TRIAL BANNER
----------------------------------------------------------------*/
function TrialBanner({ daysLeft, expired, onUpgrade }) {
  const pct = Math.max(0, Math.min(100, (daysLeft / TRIAL_DAYS) * 100));
  return (
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "9px 26px", background: expired ? C.roseSoft : C.bgSoft,
        borderBottom: `1px solid ${C.borderSoft}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {expired ? <AlertCircle size={14} color={C.rose} /> : <Clock size={14} color={C.gold} />}
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: expired ? C.rose : C.textDim }}>
          {expired
            ? "Your demo trial has ended — trading is paused until you upgrade."
            : `Demo trial · ${daysLeft} of ${TRIAL_DAYS} days left. All trades are simulated with virtual funds.`}
        </span>
        {!expired && (
          <div style={{ width: 90, height: 4, borderRadius: 4, background: C.border, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: C.gold }} />
          </div>
        )}
      </div>
      <button
        onClick={onUpgrade}
        style={{
          padding: "5px 12px", borderRadius: 7, cursor: "pointer",
          border: `1px solid ${expired ? "rgba(232,99,122,0.5)" : C.border}`,
          background: expired ? C.rose : "transparent",
          fontFamily: "'Inter',sans-serif", fontSize: 11.5, fontWeight: 700,
          color: expired ? "#0A0D13" : C.textDim,
        }}
      >
        {expired ? "Upgrade now" : "View plans"}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------
   PRICING MODAL
----------------------------------------------------------------*/
function PricingModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(6,8,12,0.72)", backdropFilter: "blur(2px)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 24,
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 860, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22, color: C.text }}>Choose your plan</div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: C.textFaint, marginTop: 3 }}>
              Cancel anytime. Prices shown are illustrative — no payment is collected in this preview.
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: C.surface2, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} color={C.textDim} />
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {PLANS.map((p) => (
            <Card
              key={p.name}
              style={{
                padding: "22px 20px",
                border: `1px solid ${p.featured ? "rgba(201,164,92,0.5)" : C.border}`,
                background: p.featured ? "linear-gradient(160deg, rgba(201,164,92,0.08), transparent)" : C.surface,
                position: "relative",
              }}
            >
              {p.featured && (
                <div style={{ position: "absolute", top: -10, left: 20 }}>
                  <Pill tone="gold"><TrendingUp size={10} style={{ marginRight: 3, display: "inline", verticalAlign: -1 }} />Most popular</Pill>
                </div>
              )}
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13.5, fontWeight: 700, color: C.text, marginTop: 6 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, margin: "8px 0 14px" }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 30, color: C.text }}>{p.price}</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.textFaint }}>{p.period}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 18 }}>
                {p.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                    <Check size={13} color={p.featured ? C.gold : C.mint} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.textDim, lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                style={{
                  width: "100%", padding: "9px 0", borderRadius: 9, cursor: "pointer",
                  border: p.featured ? "none" : `1px solid ${C.border}`,
                  background: p.featured ? C.gold : "transparent",
                  color: p.featured ? "#0A0D13" : C.text,
                  fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 12.5,
                }}
              >
                Choose {p.name}
              </button>
            </Card>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textFaint }}>
          Wiring this up to real billing needs a live backend with Stripe — this preview shows the intended flow only.
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   NAV
----------------------------------------------------------------*/
const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "trading", label: "Demo Trading", icon: PlayCircle },
  { id: "markets", label: "Markets", icon: MarketsIcon },
  { id: "news", label: "News", icon: Newspaper },
  { id: "wallet", label: "Wallet", icon: WalletMinimal },
  { id: "partners", label: "Partners", icon: Handshake },
  { id: "livetest", label: "Live Data", icon: Wifi },
];

/* ---------------------------------------------------------------
   COMMAND PALETTE — ⌘K quick jump to any page or symbol
----------------------------------------------------------------*/
function CommandPalette({ open, onClose, book, onGoTab, onGoSymbol }) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) { setQuery(""); setActiveIdx(0); setTimeout(() => inputRef.current && inputRef.current.focus(), 30); }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pages = NAV_ITEMS
      .filter((n) => !q || n.label.toLowerCase().includes(q))
      .map((n) => ({ kind: "page", id: n.id, label: n.label, icon: n.icon }));
    const syms = allSymbols(book)
      .filter((s) => !q || s.sym.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map((s) => ({ kind: "symbol", sym: s.sym, name: s.name, cat: s.cat }));
    return [...pages, ...syms];
  }, [query, book]);

  useEffect(() => { setActiveIdx(0); }, [query]);

  const choose = (item) => {
    if (!item) return;
    if (item.kind === "page") onGoTab(item.id);
    else onGoSymbol(item.sym);
    onClose();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); choose(results[activeIdx]); }
    else if (e.key === "Escape") { onClose(); }
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(6,8,12,0.72)", backdropFilter: "blur(2px)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 60, padding: "12vh 24px 24px" }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 520 }}>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${C.borderSoft}` }}>
            <Search size={16} color={C.textFaint} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Jump to a page or symbol…"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontFamily: "'Inter',sans-serif", fontSize: 14 }}
            />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.textFaint, border: `1px solid ${C.border}`, borderRadius: 4, padding: "1px 5px" }}>Esc</span>
          </div>
          <div style={{ maxHeight: 340, overflowY: "auto", padding: 6 }}>
            {results.length === 0 && (
              <div style={{ padding: "20px 12px", textAlign: "center", fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: C.textFaint }}>No matches.</div>
            )}
            {results.map((r, i) => {
              const active = i === activeIdx;
              const Icon = r.kind === "page" ? r.icon : null;
              return (
                <div
                  key={r.kind === "page" ? `p-${r.id}` : `s-${r.sym}`}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => choose(r)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, cursor: "pointer",
                    background: active ? C.surface2 : "transparent",
                  }}
                >
                  {r.kind === "page" ? (
                    <Icon size={15} color={active ? C.gold : C.textFaint} />
                  ) : (
                    <div style={{ width: 15, textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: active ? C.gold : C.textFaint }}>#</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: r.kind === "symbol" ? "'IBM Plex Mono', monospace" : "'Inter',sans-serif", fontSize: 13, fontWeight: 600, color: active ? C.text : C.textDim }}>
                      {r.kind === "page" ? r.label : r.sym}
                    </div>
                    {r.kind === "symbol" && <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10.5, color: C.textFaint }}>{r.name}</div>}
                  </div>
                  {r.kind === "page" && <Pill tone="dim">Page</Pill>}
                  {r.kind === "symbol" && <ChevronRight size={13} color={C.textFaint} />}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   TOAST NOTIFICATIONS
----------------------------------------------------------------*/
function ToastStack({ toasts }) {
  const toneMeta = {
    success: { bg: C.mintSoft, bd: "rgba(57,214,160,0.4)", fg: C.mint, icon: Check },
    error: { bg: C.roseSoft, bd: "rgba(232,99,122,0.4)", fg: C.rose, icon: AlertCircle },
    info: { bg: C.signalSoft, bd: "rgba(91,141,239,0.4)", fg: C.signal, icon: Wifi },
    default: { bg: C.surface2, bd: C.border, fg: C.text, icon: Check },
  };
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 70, display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}>
      {toasts.map((t) => {
        const meta = toneMeta[t.tone] || toneMeta.default;
        const Icon = meta.icon;
        return (
          <div
            key={t.id}
            className="ll-toast"
            style={{
              display: "flex", alignItems: "flex-start", gap: 9, padding: "11px 14px", borderRadius: 10,
              background: C.surface, border: `1px solid ${meta.bd}`, boxShadow: "0 8px 24px -8px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 6, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={12} color={meta.fg} />
            </div>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: C.text, lineHeight: 1.4 }}>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}

function Sidebar({ tab, setTab }) {
  return (
    <div
      style={{
        width: 216, flexShrink: 0, background: C.bgSoft, borderRight: `1px solid ${C.borderSoft}`,
        display: "flex", flexDirection: "column", padding: "22px 14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 8px", marginBottom: 34 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(140deg, ${C.gold}, #8A6C33)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 15, color: "#0A0D13" }}>L</span>
        </div>
        <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 18.5, color: C.text, letterSpacing: 0.2 }}>Ledgerline</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 11, padding: "9px 12px", borderRadius: 9,
                border: "none", cursor: "pointer", textAlign: "left",
                background: active ? C.surface2 : "transparent",
                borderLeft: active ? `2px solid ${C.gold}` : "2px solid transparent",
              }}
            >
              <Icon size={16.5} color={active ? C.gold : C.textFaint} strokeWidth={2} />
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13.5, fontWeight: active ? 600 : 500, color: active ? C.text : C.textDim }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "auto", paddingTop: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 10px", borderRadius: 9, background: C.surface2, border: `1px solid ${C.border}` }}>
          <Radio size={13} color={C.mint} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.textDim }}>Market data streaming</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   TOPBAR
----------------------------------------------------------------*/
function TopBar({ advanced, setAdvanced, net, dayChangePct, onOpenSearch }) {
  const [clock, setClock] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const up = dayChangePct >= 0;
  const hr = clock.getHours();
  const greeting = hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 26px" }}>
      <div>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.textFaint, marginBottom: 3 }}>{greeting}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 26, color: C.text }}>{fmtUSD(net, 2)}</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: up ? C.mint : C.rose, display: "flex", alignItems: "center", gap: 2 }}>
            {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {Math.abs(dayChangePct).toFixed(2)}% today
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onOpenSearch}
          style={{
            display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 9, padding: "8px 10px 8px 12px", width: 220, cursor: "pointer", textAlign: "left",
          }}
        >
          <Search size={14} color={C.textFaint} />
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: C.textFaint, flex: 1 }}>Search symbols, pages…</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.textFaint, border: `1px solid ${C.border}`, borderRadius: 4, padding: "1px 5px" }}>⌘K</span>
        </button>

        <button
          onClick={() => setAdvanced((v) => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 9, cursor: "pointer",
            background: advanced ? "rgba(201,164,92,0.12)" : C.surface,
            border: `1px solid ${advanced ? "rgba(201,164,92,0.4)" : C.border}`,
          }}
        >
          <Settings2 size={14} color={advanced ? C.gold : C.textDim} />
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, fontWeight: 600, color: advanced ? C.gold : C.textDim }}>Advanced</span>
        </button>

        <div style={{ width: 34, height: 34, borderRadius: 9, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <Bell size={15} color={C.textDim} />
          <div style={{ position: "absolute", top: 7, right: 7, width: 6, height: 6, borderRadius: 6, background: C.rose }} />
        </div>

        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.textFaint, minWidth: 64, textAlign: "right" }}>
          {clock.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   OVERVIEW TAB
----------------------------------------------------------------*/
const RANGES = [
  { id: "1D", n: 24, label: (i) => `${i}:00` },
  { id: "1W", n: 7, label: (i) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7] },
  { id: "1M", n: 30, label: (i) => `${i + 1}` },
  { id: "3M", n: 13, label: (i) => `W${i + 1}` },
  { id: "1Y", n: 12, label: (i) => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i] },
  { id: "ALL", n: 20, label: (i) => `'${20 + i}` },
];

function useRangeHistory(net, rangeId) {
  return useMemo(() => {
    const cfg = RANGES.find((r) => r.id === rangeId);
    const spreadByRange = { "1D": 0.006, "1W": 0.018, "1M": 0.045, "3M": 0.09, "1Y": 0.22, ALL: 0.55 };
    const spread = spreadByRange[rangeId];
    let seedVal = net * (1 - spread * (0.55 + Math.random() * 0.3));
    const out = [];
    for (let i = 0; i < cfg.n; i++) {
      const progress = i / (cfg.n - 1);
      const trendTarget = net * (1 - spread) + net * spread * progress;
      const noise = trendTarget * (Math.sin(i * 2.1 + rangeId.length) * spread * 0.09 + (Math.random() - 0.5) * spread * 0.05);
      seedVal = trendTarget + noise;
      out.push({ d: cfg.label(i), v: i === cfg.n - 1 ? net : seedVal });
    }
    return out;
  }, [net, rangeId]);
}

function OverviewTab({ book, advanced, net, allocation, holdingsRows, onSelectSymbol }) {
  const [range, setRange] = useState("1M");
  const [holdSortKey, setHoldSortKey] = useState(null);
  const [holdSortDir, setHoldSortDir] = useState("asc");
  const rangeHistory = useRangeHistory(net, range);
  const first = rangeHistory[0].v;
  const rangeChangePct = ((net - first) / first) * 100;
  const rangeUp = rangeChangePct >= 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.62fr 1fr", gap: 18 }}>
      {/* Net worth chart */}
      <Card style={{ padding: "20px 22px", gridColumn: "1 / 2" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, fontWeight: 700, letterSpacing: 1.1, color: C.textDim, textTransform: "uppercase" }}>Net worth</div>
          <Pill tone={rangeUp ? "mint" : "gold"}>{rangeUp ? "+" : ""}{rangeChangePct.toFixed(2)}% · {range}</Pill>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              style={{
                padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                border: "none", background: range === r.id ? C.surface2 : "transparent",
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
                color: range === r.id ? C.gold : C.textFaint,
              }}
            >
              {r.id}
            </button>
          ))}
        </div>
        <div style={{ height: 190 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rangeHistory} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={rangeUp ? C.gold : C.rose} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={rangeUp ? C.gold : C.rose} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={C.borderSoft} />
              <XAxis dataKey="d" tick={{ fill: C.textFaint, fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={{ stroke: C.borderSoft }} tickLine={false} interval="preserveStartEnd" minTickGap={28} />
              <YAxis hide domain={["dataMin - 2000", "dataMax + 2000"]} />
              <Tooltip
                contentStyle={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}
                labelStyle={{ color: C.textFaint, marginBottom: 4 }}
                formatter={(v) => [fmtUSD(v, 0), "Net worth"]}
              />
              <Area type="monotone" dataKey="v" stroke={rangeUp ? C.gold : C.rose} strokeWidth={2} fill="url(#netGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Allocation donut */}
      <Card style={{ padding: "20px 22px" }}>
        <SectionLabel>Allocation</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 118, height: 118, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={38} outerRadius={56} paddingAngle={2} stroke="none">
                  {allocation.map((a, i) => (
                    <Cell key={i} fill={a.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {allocation.map((a) => (
              <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 7, height: 7, borderRadius: 7, background: a.color }} />
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.textDim, width: 58 }}>{a.name}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.text }}>{a.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Holdings table */}
      <Card style={{ padding: "20px 22px", gridColumn: "1 / 2" }}>
        <SectionLabel right={<span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11.5, color: C.textFaint }}>{holdingsRows.length} positions</span>}>Holdings</SectionLabel>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
              {[
                { key: "sym", label: "Asset" }, { key: "qty", label: "Qty" }, { key: "price", label: "Price" },
                { key: "value", label: "Value" }, { key: "chg", label: "Today" }, { key: "gain", label: "Unrealized" },
              ].map((h, i) => (
                <th
                  key={h.key}
                  data-sortable="true"
                  onClick={() => { if (holdSortKey === h.key) setHoldSortDir((d) => (d === "asc" ? "desc" : "asc")); else { setHoldSortKey(h.key); setHoldSortDir("desc"); } }}
                  style={{ textAlign: i === 0 ? "left" : "right", padding: "0 0 9px", fontFamily: "'Inter',sans-serif", fontSize: 10.5, fontWeight: 600, letterSpacing: 0.6, color: holdSortKey === h.key ? C.text : C.textFaint, textTransform: "uppercase", whiteSpace: "nowrap" }}
                >
                  {h.label}{holdSortKey === h.key ? (holdSortDir === "asc" ? " ▲" : " ▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...holdingsRows].sort((a, b) => {
              if (!holdSortKey) return 0;
              const dir = holdSortDir === "asc" ? 1 : -1;
              if (holdSortKey === "sym") return dir * a.sym.localeCompare(b.sym);
              return dir * (a[holdSortKey] - b[holdSortKey]);
            }).map((h) => {
              const up = h.chg >= 0;
              const gainUp = h.gain >= 0;
              return (
                <tr
                  key={h.sym}
                  className="ll-row"
                  onClick={() => onSelectSymbol && onSelectSymbol(h.sym)}
                  style={{ borderBottom: `1px solid ${C.borderSoft}`, cursor: onSelectSymbol ? "pointer" : "default" }}
                >
                  <td style={{ padding: "11px 8px 11px 0" }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.text, fontWeight: 600 }}>{h.sym}</div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textFaint }}>{h.name}</div>
                  </td>
                  <td style={{ textAlign: "right", padding: "0 8px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: C.textDim }}>{h.qty}</td>
                  <td style={{ textAlign: "right", padding: "0 8px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: C.textDim }}>{fmtUSD(h.price)}</td>
                  <td style={{ textAlign: "right", padding: "0 8px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: C.text, fontWeight: 600 }}>{fmtUSD(h.value, 0)}</td>
                  <td style={{ textAlign: "right", padding: "0 8px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: up ? C.mint : C.rose }}>
                    {up ? "+" : ""}{h.chg.toFixed(2)}%
                  </td>
                  <td style={{ textAlign: "right", padding: "0 0 0 8px" }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: gainUp ? C.mint : C.rose, fontWeight: 600 }}>
                      {gainUp ? "+" : ""}{fmtUSD(h.gain, 0)}
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: gainUp ? C.mint : C.rose, opacity: 0.75 }}>
                      {gainUp ? "+" : ""}{h.gainPct.toFixed(1)}%
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Movers */}
      <Card style={{ padding: "20px 22px" }}>
        <SectionLabel>Top movers</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {book._movers.map((m) => {
            const up = m.chg >= 0;
            return (
              <div key={m.sym} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: C.text, fontWeight: 600 }}>{m.sym}</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10.5, color: C.textFaint }}>{m.name}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Sparkline data={m.history} positive={up} width={54} height={22} />
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: up ? C.mint : C.rose, minWidth: 52, textAlign: "right" }}>
                    {up ? "+" : ""}{m.chg.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {advanced && (
        <>
          <Card style={{ padding: "20px 22px" }}>
            <SectionLabel right={<Pill tone="signal">Advanced</Pill>}>Risk profile</SectionLabel>
            <div style={{ height: 170 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={[
                  { m: "Volatility", v: 62 }, { m: "Concentration", v: 71 }, { m: "Liquidity", v: 88 },
                  { m: "Correlation", v: 54 }, { m: "Drawdown", v: 47 },
                ]}>
                  <PolarGrid stroke={C.border} />
                  <PolarAngleAxis dataKey="m" tick={{ fill: C.textFaint, fontSize: 10, fontFamily: "Inter" }} />
                  <Radar dataKey="v" stroke={C.signal} fill={C.signal} fillOpacity={0.22} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card style={{ padding: "20px 22px", gridColumn: "2 / 3" }}>
            <SectionLabel right={<Pill tone="signal">Advanced</Pill>}>Performance vs. S&P 500</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
              {[
                { l: "Sharpe ratio", v: "1.42" }, { l: "Beta", v: "1.08" },
                { l: "Max drawdown", v: "-12.4%" }, { l: "Alpha (annualized)", v: "+3.1%" },
              ].map((r) => (
                <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.textDim }}>{r.l}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: C.text }}>{r.v}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   MARKETS TAB
----------------------------------------------------------------*/
const CATS = [
  { id: "favorites", label: "★ Favorites" },
  { id: "futures", label: "Futures" }, { id: "stocks", label: "Stocks" }, { id: "crypto", label: "Crypto" },
  { id: "forex", label: "Forex" }, { id: "etfs", label: "ETFs" },
];

function MarketsTab({ book, advanced, account, placeOrder, tradingLocked, liveMode, liveStatus, favorites, toggleFavorite }) {
  const [cat, setCat] = useState("futures");
  const [selected, setSelected] = useState(null);
  const [timeframe, setTimeframe] = useState("1H");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const rows = useMemo(() => {
    if (cat === "favorites") return favorites.map((sym) => findAsset(book, sym)).filter(Boolean);
    return book[cat];
  }, [cat, book, favorites]);
  const active = selected ? rows.find((r) => r.sym === selected) || rows[0] : rows[0];
  const candles = useLiveCandles(active ? active.price : null, active ? active.vol : null, active ? active.sym : null, timeframe);
  const catStatusKey = cat === "crypto" ? "crypto" : cat === "forex" ? "forex" : (cat === "stocks" || cat === "etfs") ? "stocks" : null;
  const isCatLive = liveMode && catStatusKey && liveStatus && liveStatus[catStatusKey] === "live";

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    const withChg = rows.map((r) => ({ ...r, _chg: pctChange(r.price, r.prevClose) }));
    const dir = sortDir === "asc" ? 1 : -1;
    return withChg.sort((a, b) => {
      let av, bv;
      if (sortKey === "symbol") { av = a.sym; bv = b.sym; return dir * av.localeCompare(bv); }
      if (sortKey === "price") { av = a.price; bv = b.price; }
      else if (sortKey === "chg") { av = a._chg; bv = b._chg; }
      else if (sortKey === "volume") { av = parseFloat(String(a.volume).replace(/[^0-9.-]/g, "")) || 0; bv = parseFloat(String(b.volume).replace(/[^0-9.-]/g, "")) || 0; }
      return dir * (av - bv);
    });
  }, [rows, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sortArrow = (key) => (sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "");

  return (
    <div style={{ display: "grid", gridTemplateColumns: advanced ? "1.5fr 1fr" : "1fr", gap: 18 }}>
      <Card style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {CATS.map((c) => (
              <button
                key={c.id}
                onClick={() => { setCat(c.id); setSelected(null); }}
                style={{
                  padding: "7px 14px", borderRadius: 8, cursor: "pointer",
                  border: `1px solid ${cat === c.id ? "rgba(201,164,92,0.4)" : C.border}`,
                  background: cat === c.id ? "rgba(201,164,92,0.12)" : "transparent",
                  fontFamily: "'Inter',sans-serif", fontSize: 12.5, fontWeight: 600,
                  color: cat === c.id ? C.gold : C.textDim,
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {cat !== "favorites" && <Pill tone={isCatLive ? "mint" : "dim"}>{isCatLive ? "Live" : "Simulated"}</Pill>}
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.textFaint }}>
              <Filter size={13} />
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11.5 }}>{rows.length} symbols</span>
            </div>
          </div>
        </div>

        {cat === "favorites" && rows.length === 0 ? (
          <div style={{ padding: "36px 0", textAlign: "center" }}>
            <Star size={22} color={C.textFaint} style={{ marginBottom: 8 }} />
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: C.textFaint }}>
              No favorites yet — click the star next to any symbol to pin it here.
            </div>
          </div>
        ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
              {[
                { key: null, label: "" },
                { key: "symbol", label: "Symbol" },
                { key: "price", label: "Price" },
                { key: "chg", label: "Chg" },
                { key: "volume", label: "Volume" },
                { key: null, label: "52-week range" },
                { key: null, label: "Chart" },
                { key: null, label: "" },
              ].map((h, i) => (
                <th
                  key={h.label || i}
                  data-sortable={h.key ? true : undefined}
                  onClick={h.key ? () => toggleSort(h.key) : undefined}
                  style={{ textAlign: i === 0 ? "center" : i === 1 ? "left" : i === 6 ? "center" : "right", padding: "0 6px 9px", fontFamily: "'Inter',sans-serif", fontSize: 10.5, fontWeight: 600, letterSpacing: 0.6, color: sortKey === h.key && h.key ? C.text : C.textFaint, textTransform: "uppercase", whiteSpace: "nowrap" }}
                >
                  {h.label}{h.key ? sortArrow(h.key) : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((r) => {
              const chg = pctChange(r.price, r.prevClose);
              const up = chg >= 0;
              const isSel = active && active.sym === r.sym;
              const isFav = favorites.includes(r.sym);
              return (
                <tr
                  key={r.sym}
                  className="ll-row"
                  onClick={() => setSelected(r.sym)}
                  style={{ borderBottom: `1px solid ${C.borderSoft}`, cursor: advanced ? "pointer" : "default", background: isSel && advanced ? C.surface2 : "transparent" }}
                >
                  <td style={{ padding: "11px 4px", textAlign: "center" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(r.sym); }}
                      style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}
                      title={isFav ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star size={14} color={isFav ? C.gold : C.textFaint} fill={isFav ? C.gold : "none"} />
                    </button>
                  </td>
                  <td style={{ padding: "11px 6px" }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.text, fontWeight: 600 }}>{r.sym}</div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textFaint }}>{r.name}</div>
                  </td>
                  <td style={{ textAlign: "right", padding: "0 6px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: C.text }}>
                    {r.sym.includes("/") ? fmtNum(r.price, 4) : fmtUSD(r.price)}
                  </td>
                  <td style={{ textAlign: "right", padding: "0 6px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: up ? C.mint : C.rose }}>
                    {up ? "+" : ""}{chg.toFixed(2)}%
                  </td>
                  <td style={{ textAlign: "right", padding: "0 6px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: C.textDim }}>
                    {r.volume}
                  </td>
                  <td style={{ padding: "0 6px" }}>
                    {r.sym.includes("/") ? (
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.textFaint }}>—</span>
                    ) : (
                      <RangeBar low={r.w52Low} high={r.w52High} price={r.price} />
                    )}
                  </td>
                  <td style={{ textAlign: "center", padding: "0 6px" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Sparkline data={r.history} positive={up} />
                    </div>
                  </td>
                  <td style={{ textAlign: "right", padding: "0 6px" }}>
                    <button
                      style={{
                        fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, color: C.bg,
                        background: C.mint, border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer",
                      }}
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </Card>

      {advanced && active && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card style={{ padding: "18px 20px" }}>
            <SectionLabel right={<Pill tone="signal">{active.sym}</Pill>}>Chart</SectionLabel>
            <CandlestickChart candles={candles} timeframe={timeframe} setTimeframe={setTimeframe} sym={active.sym} />
          </Card>
          <Card style={{ padding: "18px 20px" }}>
            <SectionLabel right={<Pill tone="signal">Live</Pill>}>{active.sym} · order book</SectionLabel>
            <OrderBook mid={active.price} />
          </Card>
          <Card style={{ padding: "18px 20px" }}>
            <SectionLabel right={<Pill tone="mint">Demo funds</Pill>}>Trade ticket</SectionLabel>
            <TradeTicket sym={active.sym} cat={cat} name={active.name} price={active.price} account={account} placeOrder={placeOrder} locked={tradingLocked} />
          </Card>
        </div>
      )}
    </div>
  );
}

function OrderBook({ mid }) {
  const asks = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({
    p: mid * (1 + 0.0006 * (i + 1)), s: Math.round(20 + Math.random() * 400),
  })), [mid]);
  const bids = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({
    p: mid * (1 - 0.0006 * (i + 1)), s: Math.round(20 + Math.random() * 400),
  })), [mid]);
  const maxSize = Math.max(...asks.map((a) => a.s), ...bids.map((b) => b.s));
  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>
      {asks.slice().reverse().map((a, i) => (
        <div key={"a" + i} style={{ position: "relative", display: "flex", justifyContent: "space-between", padding: "3px 4px" }}>
          <div style={{ position: "absolute", inset: 0, background: C.roseSoft, width: `${(a.s / maxSize) * 100}%`, right: 0, left: "auto" }} />
          <span style={{ position: "relative", color: C.rose }}>{fmtNum(a.p, 2)}</span>
          <span style={{ position: "relative", color: C.textDim }}>{a.s}</span>
        </div>
      ))}
      <div style={{ padding: "6px 4px", borderTop: `1px solid ${C.borderSoft}`, borderBottom: `1px solid ${C.borderSoft}`, color: C.gold, fontWeight: 600 }}>
        {fmtNum(mid, 2)}
      </div>
      {bids.map((b, i) => (
        <div key={"b" + i} style={{ position: "relative", display: "flex", justifyContent: "space-between", padding: "3px 4px" }}>
          <div style={{ position: "absolute", inset: 0, background: C.mintSoft, width: `${(b.s / maxSize) * 100}%` }} />
          <span style={{ position: "relative", color: C.mint }}>{fmtNum(b.p, 2)}</span>
          <span style={{ position: "relative", color: C.textDim }}>{b.s}</span>
        </div>
      ))}
    </div>
  );
}

function TradeTicket({ sym, cat, name, price, account, placeOrder, locked }) {
  const [side, setSide] = useState("buy");
  const [qty, setQty] = useState(1);
  const [confirm, setConfirm] = useState(null);

  const held = account ? account.positions.find((p) => p.sym === sym) : null;
  const cost = qty * price;
  const insufficientFunds = side === "buy" && account && cost > account.cash;
  const insufficientShares = side === "sell" && (!held || qty > held.qty);
  const disabled = locked || !account || qty <= 0 || insufficientFunds || insufficientShares;

  const submit = () => {
    if (disabled) return;
    placeOrder({ sym, cat, name, side, qty, price });
    setConfirm(`Filled ${side} ${qty} ${sym} @ ${fmtUSD(price)}`);
    setTimeout(() => setConfirm(null), 2600);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["buy", "sell"].map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 8, cursor: "pointer", textTransform: "capitalize",
              border: `1px solid ${side === s ? (s === "buy" ? "rgba(57,214,160,0.5)" : "rgba(232,99,122,0.5)") : C.border}`,
              background: side === s ? (s === "buy" ? C.mintSoft : C.roseSoft) : "transparent",
              color: side === s ? (s === "buy" ? C.mint : C.rose) : C.textDim,
              fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 12.5,
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", marginBottom: 8 }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11.5, color: C.textFaint }}>Quantity</span>
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(Math.max(0, Number(e.target.value)))}
          style={{ width: 70, background: "transparent", border: "none", outline: "none", color: C.text, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, textAlign: "right" }}
        />
      </div>
      <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
        {[1, 5, 10, 25].map((n) => (
          <button
            key={n}
            onClick={() => setQty(n)}
            style={{
              flex: 1, padding: "5px 0", borderRadius: 6, cursor: "pointer",
              border: `1px solid ${qty === n ? "rgba(201,164,92,0.4)" : C.border}`,
              background: qty === n ? "rgba(201,164,92,0.12)" : "transparent",
              color: qty === n ? C.gold : C.textFaint,
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
            }}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => {
            if (!account) return;
            if (side === "buy") { const max = Math.floor(account.cash / price); setQty(Math.max(max, 0)); }
            else { setQty(held ? held.qty : 0); }
          }}
          style={{
            flex: 1, padding: "5px 0", borderRadius: 6, cursor: "pointer",
            border: `1px solid ${C.border}`, background: "transparent", color: C.textFaint,
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
          }}
        >
          Max
        </button>
      </div>
      {held && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textFaint }}>You hold</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: C.textDim }}>{held.qty} {sym}</span>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11.5, color: C.textFaint }}>Est. total</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.text }}>{fmtUSD(cost)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textFaint }}>Buying power</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: C.textDim }}>{account ? fmtUSD(account.cash) : "—"}</span>
      </div>
      <button
        onClick={submit}
        disabled={disabled}
        style={{
          width: "100%", padding: "10px 0", borderRadius: 9, border: "none", cursor: disabled ? "not-allowed" : "pointer",
          background: disabled ? C.surface2 : side === "buy" ? C.mint : C.rose, color: disabled ? C.textFaint : "#0A0D13",
          fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, textTransform: "capitalize",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}
      >
        {locked && <Lock size={13} />}
        {locked ? "Trial ended" : insufficientFunds ? "Insufficient buying power" : insufficientShares ? "Not enough shares held" : `Place ${side} order`}
      </button>
      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10.5, color: confirm ? C.mint : C.textFaint, marginTop: 8, textAlign: "center", minHeight: 14 }}>
        {confirm || "Simulated fill against your demo account — no real order is placed"}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   WATCHLIST — TradingView-style symbol sidebar
----------------------------------------------------------------*/
function Watchlist({ book, pickSym, onPick, liveMode, liveStatus, favorites, toggleFavorite }) {
  const [query, setQuery] = useState("");
  const cats = ["futures", "stocks", "crypto", "forex", "etfs"];
  const catLabel = { futures: "Futures", stocks: "Stocks", crypto: "Crypto", forex: "Forex", etfs: "ETFs" };
  const q = query.trim().toLowerCase();
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 9px", marginBottom: 10 }}>
        <Search size={12} color={C.textFaint} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter…"
          style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: C.text, fontFamily: "'Inter',sans-serif", fontSize: 11.5 }}
        />
        {query && (
          <button onClick={() => setQuery("")} style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
            <X size={12} color={C.textFaint} />
          </button>
        )}
      </div>
      <div style={{ maxHeight: 520, overflowY: "auto", paddingRight: 2 }}>
      {cats.map((cat) => {
        const allRows = book[cat] || [];
        const rows = q ? allRows.filter((r) => r.sym.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)) : allRows;
        if (rows.length === 0) return null;
        const statusKey = cat === "crypto" ? "crypto" : cat === "forex" ? "forex" : (cat === "stocks" || cat === "etfs") ? "stocks" : null;
        const catLive = liveMode && statusKey && liveStatus && liveStatus[statusKey] === "live";
        return (
          <div key={cat} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2px 6px" }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, color: C.textFaint, textTransform: "uppercase" }}>{catLabel[cat]}</span>
              <div style={{ width: 5, height: 5, borderRadius: 5, background: catLive ? C.mint : C.textFaint }} />
            </div>
            {rows.map((r) => {
              const chg = pctChange(r.price, r.prevClose);
              const up = chg >= 0;
              const active = r.sym === pickSym;
              return (
                <button
                  key={r.sym}
                  onClick={() => onPick(r.sym)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4,
                    padding: "7px 6px 7px 8px", borderRadius: 7, cursor: "pointer", border: "none", textAlign: "left",
                    background: active ? C.surface2 : "transparent",
                    borderLeft: active ? `2px solid ${C.gold}` : "2px solid transparent",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                    <span
                      role="button"
                      onClick={(e) => { e.stopPropagation(); toggleFavorite && toggleFavorite(r.sym); }}
                      style={{ display: "flex", flexShrink: 0 }}
                      title={favorites && favorites.includes(r.sym) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star size={11} color={favorites && favorites.includes(r.sym) ? C.gold : C.textFaint} fill={favorites && favorites.includes(r.sym) ? C.gold : "none"} />
                    </span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: active ? C.text : C.textDim, fontWeight: active ? 700 : 500 }}>{r.sym}</span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Sparkline data={r.history} positive={up} width={32} height={16} />
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: up ? C.mint : C.rose, minWidth: 40, textAlign: "right" }}>
                      {up ? "+" : ""}{chg.toFixed(2)}%
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   DEMO TRADING TAB
----------------------------------------------------------------*/
function DemoTab({ book, account, placeOrder, resetAccount, tradingLocked, daysLeft, expired, liveMode, liveStatus, pickSym, setPickSym, favorites, toggleFavorite }) {
  const symbols = useMemo(() => allSymbols(book), [book]);
  const [confirmReset, setConfirmReset] = useState(false);
  const [timeframe, setTimeframe] = useState("5m");
  const [posSortKey, setPosSortKey] = useState(null);
  const [posSortDir, setPosSortDir] = useState("asc");

  const grouped = useMemo(() => {
    const g = {};
    symbols.forEach((s) => { (g[s.cat] = g[s.cat] || []).push(s); });
    return g;
  }, [symbols]);

  const picked = findAsset(book, pickSym);
  const candles = useLiveCandles(picked ? picked.price : null, picked ? picked.vol : null, pickSym, timeframe);
  const pickedChg = picked ? pctChange(picked.price, picked.prevClose) : 0;
  const pickedStatusKey = picked ? (picked.cat === "crypto" ? "crypto" : picked.cat === "forex" ? "forex" : (picked.cat === "stocks" || picked.cat === "etfs") ? "stocks" : null) : null;
  const isPickedLive = liveMode && pickedStatusKey && liveStatus && liveStatus[pickedStatusKey] === "live";

  const positionsLive = useMemo(() => {
    if (!account) return [];
    return account.positions.map((p) => {
      const asset = findAsset(book, p.sym);
      const price = asset ? asset.price : p.avgPrice;
      const value = price * p.qty;
      const cost = p.avgPrice * p.qty;
      const pl = value - cost;
      const plPct = (pl / cost) * 100;
      return { ...p, price, value, cost, pl, plPct };
    });
  }, [account, book]);

  const positionsValue = positionsLive.reduce((s, p) => s + p.value, 0);
  const unrealizedPL = positionsLive.reduce((s, p) => s + p.pl, 0);
  const equity = (account ? account.cash : 0) + positionsValue;

  if (!account) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {[0, 1, 2, 3].map((i) => <div key={i} className="ll-skel" style={{ height: 84 }} />)}
      </div>
    );
  }

  const cards = [
    { label: "Total equity", value: fmtUSD(equity, 2), tone: C.text },
    { label: "Cash available", value: fmtUSD(account.cash, 2), tone: C.text },
    { label: "Positions value", value: fmtUSD(positionsValue, 2), tone: C.text },
    { label: "Unrealized P&L", value: `${unrealizedPL >= 0 ? "+" : ""}${fmtUSD(unrealizedPL, 2)}`, tone: unrealizedPL >= 0 ? C.mint : C.rose },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
        {cards.map((c) => (
          <Card key={c.label} style={{ padding: "16px 18px" }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10.5, fontWeight: 600, letterSpacing: 0.6, color: C.textFaint, textTransform: "uppercase", marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 19, fontWeight: 600, color: c.tone }}>{c.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 18, marginBottom: 18 }}>
        <Card style={{ padding: "16px 12px" }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6, color: C.textDim, textTransform: "uppercase", padding: "0 6px 10px" }}>Watchlist</div>
          <Watchlist book={book} pickSym={pickSym} onPick={setPickSym} liveMode={liveMode} liveStatus={liveStatus} favorites={favorites} toggleFavorite={toggleFavorite} />
        </Card>

        <Card style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <select
                value={pickSym}
                onChange={(e) => setPickSym(e.target.value)}
                style={{
                  background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: "8px 12px", color: C.text, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, fontWeight: 600,
                }}
              >
                {Object.entries(grouped).map(([c, list]) => (
                  <optgroup key={c} label={c.toUpperCase()}>
                    {list.map((s) => <option key={s.sym} value={s.sym}>{s.sym} — {s.name}</option>)}
                  </optgroup>
                ))}
              </select>
              {picked && (
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 21, color: C.text }}>
                    {picked.sym.includes("/") ? fmtNum(picked.price, 4) : fmtUSD(picked.price)}
                  </span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: pickedChg >= 0 ? C.mint : C.rose }}>
                    {pickedChg >= 0 ? "+" : ""}{pickedChg.toFixed(2)}%
                  </span>
                  <Pill tone={isPickedLive ? "mint" : "dim"}>{isPickedLive ? "Live" : "Simulated"}</Pill>
                </div>
              )}
            </div>
          </div>
          <CandlestickChart candles={candles} timeframe={timeframe} setTimeframe={setTimeframe} sym={pickSym} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card style={{ padding: "20px 22px" }}>
            <SectionLabel right={<span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11.5, color: C.textFaint }}>{positionsLive.length} open</span>}>Open positions</SectionLabel>
            {positionsLive.length === 0 ? (
              <div style={{ padding: "24px 0", textAlign: "center", fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: C.textFaint }}>
                No open positions yet — place your first demo trade to get started.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
                    {[
                      { key: "sym", label: "Asset" }, { key: "qty", label: "Qty" }, { key: "avgPrice", label: "Avg cost" },
                      { key: "price", label: "Price" }, { key: "value", label: "Value" }, { key: "pl", label: "P&L" },
                    ].map((h, i) => (
                      <th
                        key={h.key}
                        data-sortable="true"
                        onClick={() => { if (posSortKey === h.key) setPosSortDir((d) => (d === "asc" ? "desc" : "asc")); else { setPosSortKey(h.key); setPosSortDir("desc"); } }}
                        style={{ textAlign: i === 0 ? "left" : "right", padding: "0 6px 9px", fontFamily: "'Inter',sans-serif", fontSize: 10.5, fontWeight: 600, letterSpacing: 0.6, color: posSortKey === h.key ? C.text : C.textFaint, textTransform: "uppercase", whiteSpace: "nowrap" }}
                      >
                        {h.label}{posSortKey === h.key ? (posSortDir === "asc" ? " ▲" : " ▼") : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...positionsLive].sort((a, b) => {
                    if (!posSortKey) return 0;
                    const dir = posSortDir === "asc" ? 1 : -1;
                    if (posSortKey === "sym") return dir * a.sym.localeCompare(b.sym);
                    return dir * (a[posSortKey] - b[posSortKey]);
                  }).map((p) => {
                    const plUp = p.pl >= 0;
                    return (
                      <tr key={p.sym} className="ll-row" onClick={() => setPickSym(p.sym)} style={{ borderBottom: `1px solid ${C.borderSoft}`, cursor: "pointer" }}>
                        <td style={{ padding: "10px 6px 10px 0" }}>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.text, fontWeight: 600 }}>{p.sym}</div>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10.5, color: C.textFaint }}>{p.name}</div>
                        </td>
                        <td style={{ textAlign: "right", padding: "0 6px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.textDim }}>{p.qty}</td>
                        <td style={{ textAlign: "right", padding: "0 6px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.textDim }}>{fmtUSD(p.avgPrice)}</td>
                        <td style={{ textAlign: "right", padding: "0 6px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.text }}>{fmtUSD(p.price)}</td>
                        <td style={{ textAlign: "right", padding: "0 6px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.text, fontWeight: 600 }}>{fmtUSD(p.value, 0)}</td>
                        <td style={{ textAlign: "right", padding: "0 0 0 6px" }}>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: plUp ? C.mint : C.rose, fontWeight: 600 }}>{plUp ? "+" : ""}{fmtUSD(p.pl, 0)}</div>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: plUp ? C.mint : C.rose, opacity: 0.75 }}>{plUp ? "+" : ""}{p.plPct.toFixed(1)}%</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </Card>

          <Card style={{ padding: "20px 22px" }}>
            <SectionLabel right={
              <button
                onClick={() => setConfirmReset(true)}
                style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter',sans-serif", fontSize: 11.5, fontWeight: 600, color: C.textFaint, background: "transparent", border: "none", cursor: "pointer" }}
              >
                <RotateCcw size={12} /> Reset account
              </button>
            }>Trade history</SectionLabel>
            {account.history.length === 0 ? (
              <div style={{ padding: "18px 0", textAlign: "center", fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: C.textFaint }}>No trades yet.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {account.history.slice(0, 10).map((t) => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 2px", borderBottom: `1px solid ${C.borderSoft}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Pill tone={t.side === "buy" ? "mint" : "gold"}>{t.side}</Pill>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: C.text, fontWeight: 600 }}>{t.sym}</span>
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11.5, color: C.textFaint }}>{t.qty} @ {fmtUSD(t.price)}</span>
                    </div>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: C.textFaint }}>
                      {new Date(t.ts).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {new Date(t.ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {confirmReset && (
              <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 10, background: C.roseSoft, border: "1px solid rgba(232,99,122,0.35)" }}>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.text, marginBottom: 10 }}>
                  Reset your demo account to {fmtUSD(DEMO_STARTING_CASH, 0)} cash and clear all positions and history?
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { resetAccount(); setConfirmReset(false); }} style={{ padding: "6px 12px", borderRadius: 7, border: "none", background: C.rose, color: "#0A0D13", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Yes, reset</button>
                  <button onClick={() => setConfirmReset(false)} style={{ padding: "6px 12px", borderRadius: 7, border: `1px solid ${C.border}`, background: "transparent", color: C.textDim, fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card style={{ padding: "20px 22px" }}>
            <SectionLabel right={<Pill tone={expired ? "gold" : "mint"}>{expired ? "Locked" : `${daysLeft}d left`}</Pill>}>Place order · {pickSym}</SectionLabel>
            {picked && (
              <TradeTicket sym={picked.sym} cat={picked.cat} name={picked.name} price={picked.price} account={account} placeOrder={placeOrder} locked={tradingLocked} />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   NEWS TAB
----------------------------------------------------------------*/
function NewsTab() {
  const [filter, setFilter] = useState("All");
  const tags = ["All", "Markets", "Earnings", "Crypto", "Forex", "Fed"];
  const items = filter === "All" ? NEWS : NEWS.filter((n) => n.tag === filter);
  const dot = { positive: C.mint, negative: C.rose, neutral: C.textFaint };
  return (
    <Card style={{ padding: "20px 22px" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding: "6px 13px", borderRadius: 20, cursor: "pointer",
              border: `1px solid ${filter === t ? "rgba(201,164,92,0.4)" : C.border}`,
              background: filter === t ? "rgba(201,164,92,0.12)" : "transparent",
              fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600,
              color: filter === t ? C.gold : C.textDim,
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((n, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "14px 2px", borderBottom: i < items.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
            <div style={{ width: 6, height: 6, borderRadius: 6, background: dot[n.sentiment], marginTop: 7, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15.5, color: C.text, marginBottom: 5, lineHeight: 1.35 }}>{n.head}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textFaint }}>{n.src}</span>
                <span style={{ color: C.textFaint, fontSize: 10 }}>•</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: C.textFaint }}>{n.t}</span>
                <Pill tone="dim">{n.tag}</Pill>
              </div>
            </div>
            <ChevronRight size={15} color={C.textFaint} style={{ flexShrink: 0, marginTop: 4 }} />
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------------
   WALLET TAB
----------------------------------------------------------------*/
function WalletTab() {
  const accounts = [
    { name: "Cash balance", inst: "Ledgerline cash", bal: CASH_BALANCE, icon: CircleDollarSign, tone: "gold" },
    { name: "Chase Checking", inst: "Linked via Plaid", bal: 3140.22, icon: Landmark, tone: "dim" },
    { name: "Coinbase", inst: "Linked via API", bal: 1288.90, icon: CircleDollarSign, tone: "dim" },
    { name: "Fidelity Brokerage", inst: "Linked via Plaid", bal: 42110.75, icon: Landmark, tone: "dim" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
      <Card style={{ padding: "20px 22px" }}>
        <SectionLabel right={
          <button style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, color: C.gold, background: "transparent", border: "none", cursor: "pointer" }}>
            <Plus size={13} /> Link account
          </button>
        }>Linked accounts</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {accounts.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10, background: C.surface2, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: a.tone === "gold" ? "rgba(201,164,92,0.14)" : C.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} color={a.tone === "gold" ? C.gold : C.textDim} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, color: C.text }}>{a.name}</div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textFaint }}>{a.inst}</div>
                  </div>
                </div>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, color: C.text }}>{fmtUSD(a.bal, 2)}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card style={{ padding: "20px 22px" }}>
        <SectionLabel>Transfer</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 9, padding: "10px 12px" }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10.5, color: C.textFaint, marginBottom: 3 }}>From</div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.text }}>Chase Checking</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ArrowRightLeft size={14} color={C.textFaint} />
          </div>
          <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 9, padding: "10px 12px" }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10.5, color: C.textFaint, marginBottom: 3 }}>To</div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.text }}>Ledgerline cash</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 2px" }}>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11.5, color: C.textFaint }}>Amount</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, color: C.text }}>$500.00</span>
          </div>
          <button style={{ width: "100%", padding: "10px 0", borderRadius: 9, border: "none", cursor: "pointer", background: C.gold, color: "#0A0D13", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13 }}>
            Move funds
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 4 }}>
            <ShieldCheck size={12} color={C.textFaint} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10.5, color: C.textFaint }}>256-bit encrypted, simulated flow</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------
   PARTNERS TAB
----------------------------------------------------------------*/
function PartnersTab() {
  return (
    <div>
      <Card style={{ padding: "26px 28px", marginBottom: 18, background: `linear-gradient(120deg, ${C.surface}, ${C.surface2})`, position: "relative", overflow: "hidden" }}>
        <Pill tone="gold">Sponsored placement</Pill>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22, color: C.text, margin: "12px 0 6px" }}>
          Earn 4.5% APY on idle cash with our Treasury partner
        </div>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.textDim, maxWidth: 480, marginBottom: 14 }}>
          Featured integrations are clearly labeled and never affect the prices or data shown elsewhere in your tracker.
        </div>
        <button style={{ padding: "9px 16px", borderRadius: 9, border: "none", cursor: "pointer", background: C.gold, color: "#0A0D13", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 12.5 }}>
          Learn more
        </button>
      </Card>

      <SectionLabel right={<button style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, color: C.gold, background: "transparent", border: "none", cursor: "pointer" }}><Link2 size={13} /> Become a partner</button>}>
        Integration partners
      </SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {PARTNERS.map((p) => (
          <Card key={p.name} className="hoverable" style={{ padding: "18px 18px", cursor: "default" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 14, color: C.gold }}>
                {p.name[0]}
              </div>
              <Pill tone="dim">{p.role}</Pill>
            </div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 5 }}>{p.name}</div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>{p.blurb}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   LIVE DATA — real fetches to real external endpoints, run from
   your browser. Crypto (CoinGecko) and forex (Frankfurter) are
   free and keyless. Stocks/ETFs need your own free Finnhub key.
   Futures have no free equivalent — real CME data requires a paid,
   licensed broker/vendor feed (see the roadmap above).
----------------------------------------------------------------*/
const STATUS_META = {
  live: { label: "Live", tone: "mint", icon: Wifi },
  connecting: { label: "Connecting…", tone: "signal", icon: RefreshCw },
  error: { label: "Error", tone: "gold", icon: AlertTriangle },
  "needs-key": { label: "Needs API key", tone: "gold", icon: KeyRound },
  off: { label: "Off", tone: "dim", icon: PauseCircle },
  unavailable: { label: "Not available", tone: "dim", icon: WifiOff },
};

function StatusRow({ label, statusKey, errorMsg, lastUpdate, note }) {
  const meta = STATUS_META[statusKey] || STATUS_META.off;
  const Icon = meta.icon;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
      <div>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>{label}</div>
        {note && <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.textFaint, maxWidth: 420, lineHeight: 1.5 }}>{note}</div>}
        {errorMsg && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: C.rose, marginTop: 4 }}>{errorMsg}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {lastUpdate && statusKey === "live" && (
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.textFaint }}>
            {new Date(lastUpdate).toLocaleTimeString()}
          </span>
        )}
        <Pill tone={meta.tone}><Icon size={10} className={statusKey === "connecting" ? "ll-spin" : ""} style={{ marginRight: 3, display: "inline", verticalAlign: -1 }} />{meta.label}</Pill>
      </div>
    </div>
  );
}

function LiveFeedTestTab({ book, liveMode, setLiveMode, liveStatus, liveErrors, lastLiveUpdate, finnhubKey, setFinnhubKey }) {
  const [keyDraft, setKeyDraft] = useState(finnhubKey || "");
  const [keySaved, setKeySaved] = useState(false);
  useEffect(() => { setKeyDraft(finnhubKey || ""); }, [finnhubKey]);

  const saveKey = () => {
    setFinnhubKey(keyDraft.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  return (
    <div>
      <Card style={{ padding: "22px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: liveMode ? C.mintSoft : C.signalSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {liveMode ? <Wifi size={18} color={C.mint} /> : <WifiOff size={18} color={C.signal} />}
            </div>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 18, color: C.text, marginBottom: 6 }}>Live data</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: C.textDim, lineHeight: 1.6, maxWidth: 560 }}>
                Turning this on replaces simulated prices with real ones wherever a real source exists, fetched directly from your browser.
                Where it doesn’t exist yet, the simulator keeps running so nothing goes blank.
              </div>
            </div>
          </div>
          <button
            onClick={() => setLiveMode(!liveMode)}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, cursor: "pointer",
              border: `1px solid ${liveMode ? "rgba(57,214,160,0.5)" : C.border}`,
              background: liveMode ? C.mintSoft : C.surface2,
              color: liveMode ? C.mint : C.textDim,
              fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, flexShrink: 0,
            }}
          >
            {liveMode ? <Wifi size={15} /> : <WifiOff size={15} />}
            Live mode: {liveMode ? "On" : "Off"}
          </button>
        </div>
      </Card>

      <Card style={{ padding: "20px 22px", marginBottom: 18 }}>
        <SectionLabel>Connection status</SectionLabel>
        <StatusRow
          label="Crypto — CoinGecko"
          statusKey={liveMode ? liveStatus.crypto : "off"}
          errorMsg={liveMode ? liveErrors.crypto : null}
          lastUpdate={lastLiveUpdate.crypto}
          note="Free, keyless, public endpoint. BTC, ETH, SOL, XRP, ADA."
        />
        <StatusRow
          label="Forex — Frankfurter"
          statusKey={liveMode ? liveStatus.forex : "off"}
          errorMsg={liveMode ? liveErrors.forex : null}
          lastUpdate={lastLiveUpdate.forex}
          note="Free, keyless, public endpoint. ECB reference rates, updated daily on business days — not tick-by-tick."
        />
        <StatusRow
          label="Stocks & ETFs — Finnhub"
          statusKey={liveMode ? (finnhubKey ? liveStatus.stocks : "needs-key") : "off"}
          errorMsg={liveMode ? liveErrors.stocks : null}
          lastUpdate={lastLiveUpdate.stocks}
          note="Needs your own free Finnhub API key (below) — real quotes aren’t redistributable without one, even for personal use."
        />
        <div style={{ paddingTop: 12 }}>
          <StatusRow
            label="Futures — NQ, MNQ, ES, MES, etc."
            statusKey="unavailable"
            note="No free equivalent exists. Real CME futures data requires a paid market-data license, almost always bundled through a broker (Tradovate, Rithmic, dxFeed). This category stays simulated until that’s in place."
          />
        </div>
      </Card>

      <Card style={{ padding: "20px 22px", marginBottom: 18 }}>
        <SectionLabel>Finnhub API key (for stocks & ETFs)</SectionLabel>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.textDim, lineHeight: 1.6, marginBottom: 12 }}>
          Free tier, no credit card. Create a key at finnhub.io, paste it below — it’s stored only in your personal browser storage
          for this app and is never sent anywhere except directly to Finnhub from your browser.
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px" }}>
            <KeyRound size={14} color={C.textFaint} />
            <input
              type="password"
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              placeholder="Paste your Finnhub API key"
              style={{ flex: 1, background: "transparent", border: "none", color: C.text, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5 }}
            />
          </div>
          <button
            onClick={saveKey}
            style={{ padding: "0 16px", borderRadius: 8, border: "none", cursor: "pointer", background: C.gold, color: "#0A0D13", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 12.5 }}
          >
            {keySaved ? "Saved" : "Save key"}
          </button>
        </div>
        <a href="https://finnhub.io/register" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "'Inter',sans-serif", fontSize: 11.5, color: C.signal, textDecoration: "none" }}>
          Get a free Finnhub key <ExternalLink size={11} />
        </a>
      </Card>

      <Card style={{ padding: "18px 22px" }}>
        <SectionLabel>What "live" means here, precisely</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            "Crypto and forex prices, when connected, are real numbers from real providers — not simulated. They refresh roughly every 20 seconds, which is polling, not a streaming tick-by-tick feed.",
            "Stocks and ETFs are real too, once you add a key — same polling model, subject to Finnhub’s free-tier rate limit.",
            "Futures (NQ, MNQ, ES, and the rest) cannot go live this way at any price point that involves just pasting a key — that data is licensed differently and normally flows through a broker connection, not a public API.",
            "This is still a single-user, browser-only connection. It’s the right scope for your own use — it is not how you’d serve live data to other people, which needs a backend regardless of which providers you pick.",
          ].map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 4, height: 4, borderRadius: 4, background: C.textFaint, marginTop: 7, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.textDim, lineHeight: 1.55 }}>{line}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


/* ---------------------------------------------------------------
   ROOT APP
----------------------------------------------------------------*/
export default function App() {
  const [tab, setTab] = useState("overview");
  const [advanced, setAdvanced] = useState(false);
  const [book, setBook] = useState(() => buildBook(SEED));
  const [loaded, setLoaded] = useState(false);
  const [account, setAccount] = useState(null);
  const [trialStart, setTrialStart] = useState(null);
  const [showPricing, setShowPricing] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [liveMode, setLiveModeState] = useState(false);
  const [finnhubKey, setFinnhubKeyState] = useState("");
  const [liveStatus, setLiveStatus] = useState({ crypto: "off", forex: "off", stocks: "off" });
  const [liveErrors, setLiveErrors] = useState({ crypto: null, forex: null, stocks: null });
  const [lastLiveUpdate, setLastLiveUpdate] = useState({ crypto: null, forex: null, stocks: null });
  const [pickSym, setPickSym] = useState("NQ");
  const [favorites, setFavorites] = useState([]);
  const favoritesLoaded = useRef(false);
  const [toasts, setToasts] = useState([]);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const pushToast = useCallback((message, tone = "default") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  // global keyboard shortcuts: Cmd/Ctrl+K opens search, Esc closes overlays
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
        setShowPricing(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 620);
    return () => clearTimeout(t);
  }, []);

  // load persisted live-mode preference + Finnhub key
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("live:mode", false);
        if (res && res.value === "true") setLiveModeState(true);
      } catch (e) { /* no saved preference yet */ }
      try {
        const res = await window.storage.get("live:finnhub_key", false);
        if (res && res.value) setFinnhubKeyState(res.value);
      } catch (e) { /* no saved key yet */ }
    })();
  }, []);

  // load persisted favorites + last active tab
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("favorites", false);
        if (res && res.value) setFavorites(JSON.parse(res.value));
      } catch (e) { /* no saved favorites yet */ }
      favoritesLoaded.current = true;
      try {
        const res = await window.storage.get("ui:last_tab", false);
        if (res && res.value && NAV_ITEMS.some((n) => n.id === res.value)) setTab(res.value);
      } catch (e) { /* no saved tab yet */ }
    })();
  }, []);

  const toggleFavorite = useCallback((sym) => {
    setFavorites((prev) => {
      const next = prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym];
      (async () => { try { await window.storage.set("favorites", JSON.stringify(next), false); } catch (e) { /* best effort */ } })();
      return next;
    });
  }, []);

  const changeTab = useCallback((id) => {
    setTab(id);
    (async () => { try { await window.storage.set("ui:last_tab", id, false); } catch (e) { /* best effort */ } })();
  }, []);

  const setLiveMode = useCallback((val) => {
    setLiveModeState(val);
    (async () => { try { await window.storage.set("live:mode", String(val), false); } catch (e) { /* best effort */ } })();
    pushToast(val ? "Live mode on — connecting to real feeds…" : "Live mode off — back to simulated prices", val ? "info" : "default");
  }, [pushToast]);

  const setFinnhubKey = useCallback((key) => {
    setFinnhubKeyState(key);
    (async () => { try { await window.storage.set("live:finnhub_key", key, false); } catch (e) { /* best effort */ } })();
    if (key) pushToast("Finnhub key saved", "success");
  }, [pushToast]);

  // load persisted demo account + trial start (falls back gracefully if storage is unavailable)
  useEffect(() => {
    (async () => {
      let start = Date.now();
      try {
        const res = await window.storage.get("demo:trial_start", false);
        if (res && res.value) start = Number(res.value);
        else await window.storage.set("demo:trial_start", String(start), false);
      } catch (e) {
        try { await window.storage.set("demo:trial_start", String(start), false); } catch (e2) { setStorageError(true); }
      }
      setTrialStart(start);

      let acc = { cash: DEMO_STARTING_CASH, positions: [], history: [] };
      try {
        const res = await window.storage.get("demo:account", false);
        if (res && res.value) acc = JSON.parse(res.value);
        else await window.storage.set("demo:account", JSON.stringify(acc), false);
      } catch (e) {
        try { await window.storage.set("demo:account", JSON.stringify(acc), false); } catch (e2) { setStorageError(true); }
      }
      setAccount(acc);
    })();
  }, []);

  const saveAccount = useCallback(async (acc) => {
    try {
      const res = await window.storage.set("demo:account", JSON.stringify(acc), false);
      if (!res) setStorageError(true);
    } catch (e) {
      setStorageError(true);
    }
  }, []);

  const daysLeft = trialStart ? Math.max(0, TRIAL_DAYS - Math.floor((Date.now() - trialStart) / 86400000)) : TRIAL_DAYS;
  const expired = trialStart !== null && daysLeft <= 0;

  const placeOrder = useCallback(({ sym, cat, name, side, qty, price }) => {
    if (expired || qty <= 0) return;
    setAccount((prev) => {
      if (!prev) return prev;
      let positions = prev.positions.map((p) => ({ ...p }));
      let cash = prev.cash;
      const idx = positions.findIndex((p) => p.sym === sym);

      if (side === "buy") {
        const cost = qty * price;
        if (cost > cash) return prev;
        cash -= cost;
        if (idx >= 0) {
          const p = positions[idx];
          const newQty = p.qty + qty;
          positions[idx] = { ...p, qty: newQty, avgPrice: (p.avgPrice * p.qty + cost) / newQty };
        } else {
          positions.push({ sym, cat, name, qty, avgPrice: price });
        }
      } else {
        if (idx < 0) return prev;
        const p = positions[idx];
        const sellQty = Math.min(qty, p.qty);
        cash += sellQty * price;
        const remaining = p.qty - sellQty;
        if (remaining <= 0.00001) positions.splice(idx, 1);
        else positions[idx] = { ...p, qty: remaining };
      }

      const trade = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ts: Date.now(), sym, side, qty, price };
      const history = [trade, ...prev.history].slice(0, 60);
      const next = { cash, positions, history };
      saveAccount(next);
      return next;
    });
  }, [expired, saveAccount]);

  const resetAccount = useCallback(() => {
    const fresh = { cash: DEMO_STARTING_CASH, positions: [], history: [] };
    setAccount(fresh);
    saveAccount(fresh);
    pushToast(`Demo account reset to ${fmtUSD(DEMO_STARTING_CASH, 0)}`, "success");
  }, [saveAccount, pushToast]);

  // refs let the interval callbacks read current live state without recreating the interval
  const liveModeRef = useRef(liveMode);
  useEffect(() => { liveModeRef.current = liveMode; }, [liveMode]);
  const liveStatusRef = useRef(liveStatus);
  useEffect(() => { liveStatusRef.current = liveStatus; }, [liveStatus]);

  // live price simulation — pauses for any category currently receiving real live data
  useEffect(() => {
    const t = setInterval(() => {
      setBook((prev) => {
        const next = {};
        Object.entries(prev).forEach(([cat, list]) => {
          const live = liveModeRef.current;
          const st = liveStatusRef.current;
          const isLive =
            live && (
              (cat === "crypto" && st.crypto === "live") ||
              (cat === "forex" && st.forex === "live") ||
              ((cat === "stocks" || cat === "etfs") && st.stocks === "live")
            );
          if (isLive) { next[cat] = list; return; }
          next[cat] = list.map((a) => {
            const drift = (Math.random() - 0.5) * a.vol * 0.012;
            const newPrice = Math.max(a.price * (1 + drift), 0.0001);
            const hist = [...a.history.slice(1), newPrice];
            return { ...a, price: newPrice, history: hist };
          });
        });
        return next;
      });
    }, 2600);
    return () => clearInterval(t);
  }, []);

  const applyLivePrices = useCallback((targetCats, priceMap) => {
    setBook((prev) => {
      const next = { ...prev };
      targetCats.forEach((cat) => {
        if (!prev[cat]) return;
        next[cat] = prev[cat].map((a) => {
          const live = priceMap[a.sym];
          if (!live) return a;
          const newPrice = live.price;
          const prevClose = typeof live.chgPct === "number" ? newPrice / (1 + live.chgPct / 100) : a.prevClose;
          const hist = [...a.history.slice(1), newPrice];
          return { ...a, price: newPrice, prevClose, history: hist };
        });
      });
      return next;
    });
  }, []);

  // real live-data fetch cycle — only runs while live mode is on
  useEffect(() => {
    if (!liveMode) {
      setLiveStatus({ crypto: "off", forex: "off", stocks: "off" });
      return;
    }
    let cancelled = false;

    async function cycle() {
      setLiveStatus((s) => ({ ...s, crypto: "connecting" }));
      try {
        const c = await fetchCryptoLive();
        if (cancelled) return;
        applyLivePrices(["crypto"], c);
        setLiveStatus((s) => ({ ...s, crypto: "live" }));
        setLiveErrors((e) => ({ ...e, crypto: null }));
        setLastLiveUpdate((u) => ({ ...u, crypto: Date.now() }));
      } catch (e) {
        if (cancelled) return;
        setLiveStatus((s) => ({ ...s, crypto: "error" }));
        setLiveErrors((er) => ({ ...er, crypto: e && e.message ? e.message : String(e) }));
      }

      setLiveStatus((s) => ({ ...s, forex: "connecting" }));
      try {
        const f = await fetchForexLive();
        if (cancelled) return;
        applyLivePrices(["forex"], f);
        setLiveStatus((s) => ({ ...s, forex: "live" }));
        setLiveErrors((e) => ({ ...e, forex: null }));
        setLastLiveUpdate((u) => ({ ...u, forex: Date.now() }));
      } catch (e) {
        if (cancelled) return;
        setLiveStatus((s) => ({ ...s, forex: "error" }));
        setLiveErrors((er) => ({ ...er, forex: e && e.message ? e.message : String(e) }));
      }

      if (finnhubKey) {
        setLiveStatus((s) => ({ ...s, stocks: "connecting" }));
        try {
          const symbols = [...SEED.stocks.map((a) => a.sym), ...SEED.etfs.map((a) => a.sym)];
          const st = await fetchStocksLive(symbols, finnhubKey);
          if (cancelled) return;
          applyLivePrices(["stocks", "etfs"], st);
          setLiveStatus((s) => ({ ...s, stocks: "live" }));
          setLiveErrors((e) => ({ ...e, stocks: null }));
          setLastLiveUpdate((u) => ({ ...u, stocks: Date.now() }));
        } catch (e) {
          if (cancelled) return;
          setLiveStatus((s) => ({ ...s, stocks: "error" }));
          setLiveErrors((er) => ({ ...er, stocks: e && e.message ? e.message : String(e) }));
        }
      } else {
        setLiveStatus((s) => ({ ...s, stocks: "needs-key" }));
      }
    }

    cycle();
    const t = setInterval(cycle, 20000);
    return () => { cancelled = true; clearInterval(t); };
  }, [liveMode, finnhubKey, applyLivePrices]);

  const holdingsRows = useMemo(() => {
    return HOLDINGS.map((h) => {
      const asset = book[h.cat].find((a) => a.sym === h.sym);
      const chg = pctChange(asset.price, asset.prevClose);
      const value = asset.price * h.qty;
      const cost = h.costBasis * h.qty;
      const gain = value - cost;
      const gainPct = (gain / cost) * 100;
      return { sym: h.sym, name: asset.name, qty: h.qty, price: asset.price, value, chg, gain, gainPct };
    });
  }, [book]);

  const holdingsValue = holdingsRows.reduce((s, h) => s + h.value, 0);
  const net = holdingsValue + CASH_BALANCE;

  const dayChangePct = useMemo(() => {
    const weighted = holdingsRows.reduce((s, h) => s + h.chg * h.value, 0) / (holdingsValue || 1);
    return weighted;
  }, [holdingsRows, holdingsValue]);

  const allocation = useMemo(() => {
    const byCat = {};
    HOLDINGS.forEach((h) => {
      const asset = book[h.cat].find((a) => a.sym === h.sym);
      byCat[h.cat] = (byCat[h.cat] || 0) + asset.price * h.qty;
    });
    byCat.cash = CASH_BALANCE;
    const total = Object.values(byCat).reduce((a, b) => a + b, 0);
    const palette = { stocks: C.gold, etfs: C.signal, crypto: C.mint, forex: C.rose, cash: C.textFaint };
    const labels = { stocks: "Stocks", etfs: "ETFs", crypto: "Crypto", forex: "Forex", cash: "Cash" };
    return Object.entries(byCat).map(([k, v]) => ({ name: labels[k], value: v, pct: ((v / total) * 100).toFixed(1), color: palette[k] }));
  }, [book]);

  const moversFlat = useMemo(() => {
    const all = [];
    Object.values(book).forEach((list) => list.forEach((a) => all.push({ ...a, chg: pctChange(a.price, a.prevClose) })));
    return all.sort((a, b) => Math.abs(b.chg) - Math.abs(a.chg)).slice(0, 4);
  }, [book]);

  const bookWithMovers = { ...book, _movers: moversFlat };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 8px; }
        input:focus { outline: none; }
        @keyframes tapeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .tape-track { animation: tapeScroll 42s linear infinite; }
        .tape-track:hover { animation-play-state: paused; }
        .tape-track button:hover { background: ${C.surface2} !important; }
        @media (prefers-reduced-motion: reduce) { .tape-track { animation: none; } }
        button { transition: opacity 0.15s ease, border-color 0.15s ease, transform 0.15s ease; }
        button:hover { opacity: 0.85; }
        button:active { transform: scale(0.98); }
        button:focus-visible, input:focus-visible, .ll-row:focus-visible { outline: 2px solid ${C.signal}; outline-offset: 2px; }
        .ll-card { transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease; }
        .ll-card.hoverable:hover { box-shadow: 0 1px 2px rgba(0,0,0,0.3), 0 18px 34px -16px rgba(0,0,0,0.65); border-color: ${C.borderSoft}; transform: translateY(-1px); }
        .ll-row { transition: background 0.15s ease; }
        .ll-row:hover td { background: ${C.surface2}; }
        @keyframes shimmer { 0% { background-position: -300px 0; } 100% { background-position: 300px 0; } }
        .ll-skel { background: linear-gradient(90deg, ${C.surface2} 0%, ${C.border} 50%, ${C.surface2} 100%); background-size: 300px 100%; animation: shimmer 1.3s ease-in-out infinite; border-radius: 6px; }
        .ll-fade-in { animation: fadeIn 0.35s ease both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .ll-spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .ll-toast { animation: toastIn 0.25s cubic-bezier(0.2,0.8,0.2,1) both; }
        @keyframes toastIn { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        th[data-sortable] { cursor: pointer; user-select: none; }
        th[data-sortable]:hover { color: #EAEDF3 !important; }
        select { appearance: none; }
      `}</style>

      <Sidebar tab={tab} setTab={changeTab} />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <TopBar advanced={advanced} setAdvanced={setAdvanced} net={net} dayChangePct={dayChangePct} onOpenSearch={() => setPaletteOpen(true)} />
        <TrialBanner daysLeft={daysLeft} expired={expired} onUpgrade={() => setShowPricing(true)} />
        <TickerTape book={book} onPick={(sym) => { setPickSym(sym); changeTab("trading"); }} />

        <div style={{ padding: "22px 26px 40px", overflowY: "auto" }}>
          {!loaded ? (
            <div style={{ display: "grid", gridTemplateColumns: "1.62fr 1fr", gap: 18 }}>
              <div className="ll-skel" style={{ height: 262, gridColumn: "1 / 2" }} />
              <div className="ll-skel" style={{ height: 262 }} />
              <div className="ll-skel" style={{ height: 300, gridColumn: "1 / 2" }} />
              <div className="ll-skel" style={{ height: 300 }} />
            </div>
          ) : (
            <div className="ll-fade-in">
              {tab === "overview" && (
                <OverviewTab book={bookWithMovers} advanced={advanced} net={net} allocation={allocation} holdingsRows={holdingsRows} onSelectSymbol={(sym) => { setPickSym(sym); changeTab("trading"); }} />
              )}
              {tab === "trading" && (
                <DemoTab book={book} account={account} placeOrder={placeOrder} resetAccount={resetAccount} tradingLocked={expired} daysLeft={daysLeft} expired={expired} liveMode={liveMode} liveStatus={liveStatus} pickSym={pickSym} setPickSym={setPickSym} favorites={favorites} toggleFavorite={toggleFavorite} />
              )}
              {tab === "markets" && <MarketsTab book={book} advanced={advanced} account={account} placeOrder={placeOrder} tradingLocked={expired} liveMode={liveMode} liveStatus={liveStatus} favorites={favorites} toggleFavorite={toggleFavorite} />}
              {tab === "news" && <NewsTab />}
              {tab === "wallet" && <WalletTab />}
              {tab === "partners" && <PartnersTab />}
              {tab === "livetest" && (
                <LiveFeedTestTab
                  book={book}
                  liveMode={liveMode} setLiveMode={setLiveMode}
                  liveStatus={liveStatus} liveErrors={liveErrors} lastLiveUpdate={lastLiveUpdate}
                  finnhubKey={finnhubKey} setFinnhubKey={setFinnhubKey}
                />
              )}
            </div>
          )}
          {storageError && (
            <div style={{ marginTop: 18, padding: "10px 14px", borderRadius: 9, background: C.surface2, border: `1px solid ${C.border}`, fontFamily: "'Inter',sans-serif", fontSize: 11.5, color: C.textFaint }}>
              Your demo account couldn’t be saved just now — trades this session may not persist after a refresh.
            </div>
          )}
        </div>
      </div>

      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        book={book}
        onGoTab={(id) => changeTab(id)}
        onGoSymbol={(sym) => { setPickSym(sym); changeTab("trading"); }}
      />
      <ToastStack toasts={toasts} />
    </div>
  );
}
