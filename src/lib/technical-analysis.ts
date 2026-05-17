import { RSI, EMA } from "technicalindicators";

export interface AnalysisResult {
  signal: string;
  color: string;
  score: number;
  reason: string;
  rsi: number;
  emaTrend: string;
  price: number;
}

export function analyzePrices(
  prices: number[]
): AnalysisResult {

  const rsiValues = RSI.calculate({
    values: prices,
    period: 14,
  });

  const latestRSI =
    rsiValues[rsiValues.length - 1] || 50;

  const ema20 = EMA.calculate({
    values: prices,
    period: 20,
  });

  const ema50 = EMA.calculate({
    values: prices,
    period: 50,
  });

  const latestEMA20 =
    ema20[ema20.length - 1] || 0;

  const latestEMA50 =
    ema50[ema50.length - 1] || 0;

  const latestPrice =
    prices[prices.length - 1];

  let signal = "WAIT";
  let color = "text-yellow-400";
  let score = 50;
  let reason = "Market consolidation";
  let emaTrend = "Sideways";

  if (latestEMA20 > latestEMA50) {
    emaTrend = "Bullish";
  } else {
    emaTrend = "Bearish";
  }

  if (
    latestRSI >= 70 &&
    latestEMA20 > latestEMA50
  ) {
    signal = "STRONG BUY";
    color = "text-green-400";
    score = 92;
    reason =
      "Strong bullish breakout with high momentum";
  }

  else if (
    latestRSI >= 60 &&
    latestEMA20 > latestEMA50
  ) {
    signal = "BUY";
    color = "text-green-300";
    score = 80;
    reason =
      "Bullish continuation trend detected";
  }

  else if (
    latestRSI < 40 &&
    latestEMA20 < latestEMA50
  ) {
    signal = "SELL";
    color = "text-red-400";
    score = 35;
    reason =
      "Bearish momentum and downtrend";
  }

  return {
    signal,
    color,
    score,
    reason,
    rsi: Math.round(latestRSI),
    emaTrend,
    price: latestPrice,
  };
}