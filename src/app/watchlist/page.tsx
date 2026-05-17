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

export default function WatchlistPage() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/scanner")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {

          const sortedStocks = data.sort(
            (a, b) => b.score - a.score
          );

          setStocks(sortedStocks);
        } else {
          setStocks([]);
        }

        setLoading(false);
      })
      .catch(() => {
        setStocks([]);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-7xl font-bold text-green-400">
        AI Watchlist
      </h1>

      <p className="text-2xl text-gray-300 mt-6">
        Daftar saham terbaik realtime hari ini.
      </p>

      {loading ? (
        <div className="mt-20 text-4xl">
          Loading realtime watchlist...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {stocks.map((stock, index) => (
            <div
              key={`${stock.symbol}-${index}`}
              className="bg-[#11111b] rounded-3xl p-8 border border-gray-800"
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="text-5xl font-bold">
                    {stock.symbol}
                  </h2>

                  <p
                    className={`mt-4 text-3xl font-bold ${
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

                  <p className="text-gray-400 text-xl">
                    AI Score
                  </p>
                </div>
              </div>

              <p className="text-2xl text-gray-300 mt-8">
                {stock.name}
              </p>

              <div className="mt-8 space-y-3">
                <p className="text-2xl">
                  Price : Rp{" "}
                  {Number(stock.price).toLocaleString(
                    "id-ID"
                  )}
                </p>

                <p
                  className={`text-2xl ${
                    stock.change >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  Change : {stock.change.toFixed(2)}%
                </p>

                <p className="text-cyan-400 text-xl">
                  RSI : {stock.rsi}
                </p>

                <p className="text-yellow-400 text-xl">
                  MACD : {stock.macd}
                </p>

                <p className="text-pink-400 text-xl">
                  Volume :{" "}
                  {Number(stock.volume).toLocaleString(
                    "id-ID"
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}