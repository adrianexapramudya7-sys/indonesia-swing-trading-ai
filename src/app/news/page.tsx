"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface NewsItem {
  title: string;
  link: string;
  source: string;
  date: string;
}

export default function NewsPage() {

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get("/api/news");
      setNews(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">

      <h1 className="text-6xl font-bold text-green-400">
        Market News
      </h1>

      <p className="text-gray-400 text-2xl mt-4">
        Berita realtime pasar saham Indonesia.
      </p>

      {loading ? (

        <div className="mt-10 text-2xl text-gray-400">
          Loading realtime news...
        </div>

      ) : (

        <div className="grid gap-6 mt-10">

          {news.map((item, index) => (

            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#111118] rounded-3xl p-8 border border-gray-800 hover:border-green-400 transition block"
            >

              <h2 className="text-3xl font-bold hover:text-green-400 transition">
                {item.title}
              </h2>

              <div className="flex justify-between mt-6 text-gray-400 text-xl">

                <p>
                  {item.source}
                </p>

                <p>
                  {item.date}
                </p>

              </div>

            </a>

          ))}

        </div>

      )}

    </main>
  );
}