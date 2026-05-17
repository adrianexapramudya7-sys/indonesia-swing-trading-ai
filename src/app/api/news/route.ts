import Parser from "rss-parser";
import { NextResponse } from "next/server";

const parser = new Parser();

export async function GET() {
  try {
    const feed = await parser.parseURL(
      "https://www.cnbcindonesia.com/market/rss"
    );

    const news = feed.items.slice(0, 15).map((item) => ({
      title: item.title,
      link: item.link,
      source: "CNBC Indonesia",
      date: item.pubDate,
    }));

    return NextResponse.json(news);
  } catch (error) {
    console.log(error);

    return NextResponse.json([
      {
        title: "Gagal mengambil berita realtime",
        link: "#",
        source: "System",
        date: "Now",
      },
    ]);
  }
}