"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type StockData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  signal: string;
  score: number;
  rsi: number;
  macd: string;
  volume: number;
};

export default function Home() {

  const [stocks, setStocks] =
    useState<StockData[]>([]);

  const fetchStocks = async () => {

    try {

      const res =
        await fetch("/api/scanner");

      const data =
        await res.json();

      if (Array.isArray(data)) {

        setStocks(data.slice(0, 4));
      }

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchStocks();

    const interval =
      setInterval(() => {

        fetchStocks();

      }, 30000);

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <main className="min-h-screen bg-black text-white p-10">

      {/* DISCLAIMER */}

      <div className="w-full overflow-hidden border-b border-gray-800 bg-[#050816] py-2 mb-8 rounded-xl">
        <div className="animate-marquee whitespace-nowrap text-sm text-gray-400">
          ⚠️ Disclaimer: Informasi dan AI signal pada aplikasi ini bukan ajakan membeli atau menjual saham. Selalu lakukan analisa mandiri sebelum melakukan investasi atau trading.
        </div>
      </div>

      {/* HEADER */}

      <h1 className="text-8xl font-bold">
        Indonesia Swing Trading AI
      </h1>

      <p className="text-3xl text-gray-400 mt-4">
        AI-powered technical analysis for Indonesian stock market
      </p>

      {/* TOP SIGNAL */}

      <div className="grid md:grid-cols-4 gap-8 mt-12">

        {stocks.map((stock, index) => (

          <div
            key={`${stock.symbol}-${index}`}
            className="bg-[#020d40] border border-gray-800 rounded-3xl p-10"
          >

            <h2 className="text-6xl font-bold">
              {stock.symbol}
            </h2>

            <p
              className={`text-4xl font-bold mt-6 ${
                stock.signal === "STRONG BUY"
                  ? "text-green-400"
                  : stock.signal === "BUY"
                  ? "text-cyan-400"
                  : stock.signal === "SELL"
                  ? "text-red-400"
                  : "text-yellow-400"
              }`}
            >
              {stock.signal}
            </p>

            <p className="text-2xl text-gray-400 mt-6">
              Probability {stock.score}%
            </p>

          </div>

        ))}

      </div>

      {/* AI MARKET ANALYSIS */}

      <div className="bg-[#020d40] border border-gray-800 rounded-3xl p-10 mt-12">

        <h2 className="text-6xl font-bold text-green-400">
          AI Market Analysis
        </h2>

        <p className="text-3xl text-gray-300 mt-10 leading-loose">

          IHSG saat ini berada dalam fase sideways menuju bullish reversal.
          Sektor energi dan komoditas menunjukkan momentum penguatan,
          terutama pada saham dengan volume breakout tinggi.

        </p>

      </div>

      {/* TRADINGVIEW CHART */}

      <div className="bg-[#020d40] border border-gray-800 rounded-3xl p-10 mt-12">

        <h2 className="text-6xl font-bold text-green-400">
          Live Trading Chart
        </h2>

        <div className="mt-10 rounded-3xl overflow-hidden">

          <iframe
            src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=IDX%3ABBRI&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=0&toolbarbg=000000&studies=[]&theme=dark&style=1&timezone=Asia%2FJakarta"
            width="100%"
            height="600"
            frameBorder="0"
            allowTransparency={true}
            scrolling="no"
          />

        </div>

      </div>

      {/* MENU */}

      <div className="grid md:grid-cols-4 gap-6 mt-12">

        <Link href="/watchlist">

          <div className="bg-[#11111b] hover:bg-[#1a1a2f] transition rounded-3xl p-8 cursor-pointer">

            <h2 className="text-4xl font-bold text-cyan-400">
              Watchlist
            </h2>

            <p className="text-xl text-gray-400 mt-4">
              Realtime AI stock watchlist Indonesia.
            </p>

          </div>

        </Link>

        <Link href="/scanner">

          <div className="bg-[#11111b] hover:bg-[#1a1a2f] transition rounded-3xl p-8 cursor-pointer">

            <h2 className="text-4xl font-bold text-green-400">
              AI Scanner
            </h2>

            <p className="text-xl text-gray-400 mt-4">
              Realtime AI scanner dengan RSI & MACD.
            </p>

          </div>

        </Link>

        <Link href="/signals">

          <div className="bg-[#11111b] hover:bg-[#1a1a2f] transition rounded-3xl p-8 cursor-pointer">

            <h2 className="text-4xl font-bold text-pink-400">
              Trading Signals
            </h2>

            <p className="text-xl text-gray-400 mt-4">
              AI generated entry dan momentum analysis.
            </p>

          </div>

        </Link>

        <Link href="/news">

          <div className="bg-[#11111b] hover:bg-[#1a1a2f] transition rounded-3xl p-8 cursor-pointer">

            <h2 className="text-4xl font-bold text-yellow-400">
              Market News
            </h2>

            <p className="text-xl text-gray-400 mt-4">
              Realtime berita saham Indonesia.
            </p>

          </div>

        </Link>

      </div>

    </main>
  );
}