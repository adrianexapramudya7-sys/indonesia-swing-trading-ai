import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET() {

  try {

    const quote: any =
      await yahooFinance.quote("^JKSE");

    return NextResponse.json({

      price:
        Number(
          quote?.regularMarketPrice
        ) || 0,

      change:
        Number(
          quote?.regularMarketChangePercent
        ) || 0,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({

      price: 0,

      change: 0,
    });
  }
}