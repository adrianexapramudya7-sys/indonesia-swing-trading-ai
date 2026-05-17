"use client";

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

export default function ScannerPage() {

  const [stocks, setStocks] =
    useState<StockData[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("ALL");

  const fetchStocks = async () => {

    try {

      const res =
        await fetch("/api/scanner");

      const data =
        await res.json();

      if (Array.isArray(data)) {

        setStocks(data);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
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

  /*
    MARKET STATUS INDONESIA
  */

  const now = new Date();

  const indonesiaTime =
    new Date(
      now.toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      })
    );

  const hour =
    indonesiaTime.getHours();

  const day =
    indonesiaTime.getDay();

  const isWeekend =
    day === 0 || day === 6;

  const isMarketOpen =
    !isWeekend &&
    hour >= 9 &&
    hour < 16;

  const marketStatus =
    isMarketOpen
      ? "MARKET OPEN"
      : "MARKET CLOSED";

  const filteredStocks =
    stocks.filter((stock) => {

      const symbol =
        stock.symbol || "";

      const name =
        stock.name || "";

      const matchSearch =
        symbol
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchFilter =
        filter === "ALL" ||
        stock.signal === filter;

      return (
        matchSearch &&
        matchFilter
      );
    });

  return (

    <main className="min-h-screen bg-black text-white p-8">

      <div className="w-full overflow-hidden border-b border-gray-800 bg-[#050816] py-2 mb-6">
        <div className="animate-marquee whitespace-nowrap text-sm text-gray-400">
          ⚠️ Disclaimer: Informasi dan AI signal pada aplikasi ini bukan ajakan membeli atau menjual saham. Selalu lakukan analisa mandiri sebelum melakukan investasi atau trading.
        </div>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-4">

        <div>

          <h1 className="text-7xl font-bold text-green-400">
            AI Scanner
          </h1>

          <p className="text-2xl text-gray-400 mt-4">
            Realtime AI scanner Indonesia.
          </p>

        </div>

        <div className="flex gap-4 flex-wrap">

          <div className="bg-[#11111b] px-6 py-4 rounded-3xl">

            <p className="text-gray-400 text-lg">
              Auto Refresh
            </p>

            <p className="text-green-400 text-2xl font-bold">
              30 Seconds
            </p>

          </div>

          <div className="bg-[#11111b] px-6 py-4 rounded-3xl">

            <p className="text-gray-400 text-lg">
              Market Status
            </p>

            <p
              className={`text-2xl font-bold ${
                isMarketOpen
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {marketStatus}
            </p>

          </div>

        </div>

      </div>

      <input
        type="text"
        placeholder="Cari saham..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full mt-10 bg-[#020535] border border-gray-700 rounded-3xl px-6 py-6 text-3xl outline-none"
      />

      <div className="flex flex-wrap gap-4 mt-8">

        {[
          "ALL",
          "STRONG BUY",
          "BUY",
          "WAIT",
          "SELL",
        ].map((item) => (

          <button
            key={item}
            onClick={() =>
              setFilter(item)
            }
            className={`px-8 py-5 rounded-3xl text-2xl font-bold transition ${
              filter === item
                ? "bg-green-400 text-black"
                : "bg-[#090d2c]"
            }`}
          >
            {item}
          </button>

        ))}

      </div>

      {loading ? (

        <div className="mt-20 text-4xl text-center">
          Loading realtime scanner...
        </div>

      ) : (

        <div className="grid md:grid-cols-2 gap-8 mt-10">

          {filteredStocks.map((stock, index) => (

            <div
              key={`${stock.symbol}-${index}`}
              className="bg-[#020535] rounded-3xl p-8 border border-gray-800"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-5xl font-bold">
                    {stock.symbol}
                  </h2>

                  <p
                    className={`mt-5 text-3xl font-bold ${
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

                </div>

                <div className="text-right">

                  <h2 className="text-6xl font-bold">
                    {stock.score}%
                  </h2>

                  <p className="text-gray-400 text-2xl">
                    AI Score
                  </p>

                </div>

              </div>

              <p className="text-2xl mt-8 text-gray-300">
                {stock.name}
              </p>

              <div className="mt-8 space-y-3">

                <p className="text-2xl">
                  Price : Rp{" "}
                  {Number(stock.price).toLocaleString("id-ID")}
                </p>

                <p
                  className={`text-2xl ${
                    stock.change >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  Change :{" "}
                  {stock.change.toFixed(2)}%
                </p>

                <p className="text-cyan-400 text-xl">
                  RSI : {stock.rsi}
                </p>

                <p className="text-yellow-400 text-xl">
                  MACD : {stock.macd}
                </p>

                <p className="text-pink-400 text-xl">
                  Volume :{" "}
                  {Number(stock.volume).toLocaleString("id-ID")}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </main>
  );
}