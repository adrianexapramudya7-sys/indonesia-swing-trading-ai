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

  const [ihsg, setIHSG] =
    useState({
      price: 0,
      change: 0,
    });

  const [topGainers, setTopGainers] =
    useState<StockData[]>([]);

  const [topLosers, setTopLosers] =
    useState<StockData[]>([]);

  const fetchData = async () => {

    try {

      /*
        FETCH STOCKS
      */

      const res =
        await fetch("/api/scanner");

      const data =
        await res.json();

      if (Array.isArray(data)) {

        setStocks(data.slice(0, 4));

        /*
          TOP GAINERS
        */

        const gainers =
          [...data]
            .sort(
              (a, b) =>
                b.change - a.change
            )
            .slice(0, 5);

        setTopGainers(gainers);

        /*
          TOP LOSERS
        */

        const losers =
          [...data]
            .sort(
              (a, b) =>
                a.change - b.change
            )
            .slice(0, 5);

        setTopLosers(losers);
      }

      /*
        FETCH REALTIME IHSG
      */

      const ihsgRes =
        await fetch("/api/ihsg");

      const ihsgData =
        await ihsgRes.json();

      setIHSG(ihsgData);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchData();

    const interval =
      setInterval(() => {

        fetchData();

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

      <div className="flex justify-between items-center flex-wrap gap-6">

        <div>

          <h1 className="text-8xl font-bold text-green-400">
            EXA AI
          </h1>

          <p className="text-3xl text-gray-400 mt-4">
            Smart AI platform for Indonesian stock market analysis
          </p>

        </div>

        {/* REALTIME IHSG */}

        <div className="bg-[#020d40] border border-gray-800 rounded-3xl p-8 min-w-[320px]">

          <p className="text-2xl text-gray-400">
            IHSG
          </p>

          <h2 className="text-6xl font-bold mt-4">
            {Number(ihsg.price).toFixed(2)}
          </h2>

          <p
            className={`text-3xl font-bold mt-4 ${
              ihsg.change >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {ihsg.change >= 0 ? "+" : ""}
            {Number(ihsg.change).toFixed(2)}%
          </p>

        </div>

      </div>

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

      {/* TOP GAINERS & LOSERS */}

      <div className="grid md:grid-cols-2 gap-8 mt-12">

        {/* TOP GAINERS */}

        <div className="bg-[#020d40] border border-gray-800 rounded-3xl p-8">

          <h2 className="text-5xl font-bold text-green-400">
            Top Gainers
          </h2>

          <div className="space-y-5 mt-8">

            {topGainers.map((stock, index) => (

              <div
                key={`${stock.symbol}-gainer-${index}`}
                className="flex justify-between items-center border-b border-gray-800 pb-4"
              >

                <div>

                  <p className="text-3xl font-bold">
                    {stock.symbol}
                  </p>

                  <p className="text-gray-400">
                    {stock.name}
                  </p>

                </div>

                <p className="text-3xl font-bold text-green-400">
                  +{stock.change.toFixed(2)}%
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* TOP LOSERS */}

        <div className="bg-[#020d40] border border-gray-800 rounded-3xl p-8">

          <h2 className="text-5xl font-bold text-red-400">
            Top Losers
          </h2>

          <div className="space-y-5 mt-8">

            {topLosers.map((stock, index) => (

              <div
                key={`${stock.symbol}-loser-${index}`}
                className="flex justify-between items-center border-b border-gray-800 pb-4"
              >

                <div>

                  <p className="text-3xl font-bold">
                    {stock.symbol}
                  </p>

                  <p className="text-gray-400">
                    {stock.name}
                  </p>

                </div>

                <p className="text-3xl font-bold text-red-400">
                  {stock.change.toFixed(2)}%
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* AI MARKET ANALYSIS */}

      <div className="bg-[#020d40] border border-gray-800 rounded-3xl p-10 mt-12">

        <h2 className="text-6xl font-bold text-green-400">
          AI Market Analysis
        </h2>

        <p className="text-3xl text-gray-300 mt-10 leading-loose">

          IHSG saat ini berada dalam fase market realtime Indonesia.
          AI Scanner EXA AI terus memantau momentum saham,
          volume transaksi, dan perubahan market secara otomatis.

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
          </div>
        </Link>

        <Link href="/scanner">
          <div className="bg-[#11111b] hover:bg-[#1a1a2f] transition rounded-3xl p-8 cursor-pointer">
            <h2 className="text-4xl font-bold text-green-400">
              AI Scanner
            </h2>
          </div>
        </Link>

        <Link href="/signals">
          <div className="bg-[#11111b] hover:bg-[#1a1a2f] transition rounded-3xl p-8 cursor-pointer">
            <h2 className="text-4xl font-bold text-pink-400">
              Trading Signals
            </h2>
          </div>
        </Link>

        <Link href="/news">
          <div className="bg-[#11111b] hover:bg-[#1a1a2f] transition rounded-3xl p-8 cursor-pointer">
            <h2 className="text-4xl font-bold text-yellow-400">
              Market News
            </h2>
          </div>
        </Link>

      </div>

    </main>
  );
}