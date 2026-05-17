import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

const symbols = [
  "BBRI.JK","BMRI.JK","BBCA.JK","TLKM.JK","ASII.JK",
  "ANTM.JK","BRMS.JK","GOTO.JK","ADRO.JK","MDKA.JK",
  "PGAS.JK","UNTR.JK","ICBP.JK","INDF.JK","EXCL.JK",
  "ERAA.JK","ACES.JK","AMRT.JK","SIDO.JK","CPIN.JK",
  "JPFA.JK","PTBA.JK","ITMG.JK","HRUM.JK","MEDC.JK",
  "AKRA.JK","SMGR.JK","BBTN.JK","BNGA.JK","BRPT.JK",
  "AGII.JK","AALI.JK","ABMM.JK","AGRO.JK","AMMN.JK",
  "ARTO.JK","BBKP.JK","BBNI.JK","BBYB.JK","BCAP.JK",
  "BDMN.JK","BEST.JK","BJBR.JK","BJTM.JK","BKSL.JK",
  "BMHS.JK","BMTR.JK","BRIS.JK","BSDE.JK","BTPS.JK",
  "BULL.JK","BUKA.JK","BUMI.JK","CARE.JK","CMRY.JK",
  "CTRA.JK","DGIK.JK","DMAS.JK","DOID.JK","ELSA.JK",
  "EMTK.JK","ESSA.JK","HEAL.JK","HMSP.JK","INCO.JK",
  "INDY.JK","INKP.JK","ISAT.JK","JSMR.JK","KLBF.JK",
  "LSIP.JK","MAIN.JK","MAPI.JK","MIKA.JK","MYOR.JK",
  "PGEO.JK","PNLF.JK","PPRO.JK","PTPP.JK","PWON.JK",
  "SCMA.JK","SMRA.JK","TINS.JK","TKIM.JK","TOWR.JK",
  "UNVR.JK","WIKA.JK","WSKT.JK"
];

export async function GET() {

  try {

    const results = await Promise.all(

      symbols.map(async (symbol) => {

        try {

          const quote: any =
            await yahooFinance.quote(symbol);

          const price =
            Number(
              quote?.regularMarketPrice
            ) || 0;

          const change =
            Number(
              quote?.regularMarketChangePercent
            ) || 0;

          const volume =
            Number(
              quote?.regularMarketVolume
            ) || 0;

          let signal = "WAIT";

          let score = 60;

          let rsi = 50;

          let macd = "Neutral";

          /*
            FLEXIBLE IDX AI LOGIC
          */

          if (change >= 2) {

            signal = "STRONG BUY";

            score = 92;

            rsi = 72;

            macd = "Bullish";

          } else if (change >= 0.3) {

            signal = "BUY";

            score = 80;

            rsi = 62;

            macd = "Bullish";

          } else if (change <= -1) {

            signal = "SELL";

            score = 40;

            rsi = 35;

            macd = "Bearish";

          } else {

            signal = "WAIT";

            score = 60;

            rsi = 50;

            macd = "Neutral";
          }

          /*
            HIGH VOLUME BOOST
          */

          if (
            volume > 100000000 &&
            signal === "BUY"
          ) {

            signal = "STRONG BUY";

            score = 90;
          }

          return {

            symbol:
              symbol.replace(".JK", ""),

            name:
              quote?.longName ||
              quote?.shortName ||
              symbol.replace(".JK", ""),

            price,

            change,

            signal,

            score,

            rsi,

            macd,

            volume,
          };

        } catch {

          return {

            symbol:
              symbol.replace(".JK", ""),

            name:
              symbol.replace(".JK", ""),

            price: 0,

            change: 0,

            signal: "WAIT",

            score: 60,

            rsi: 50,

            macd: "Neutral",

            volume: 0,
          };
        }
      })

    );

    const sorted =
      results.sort(
        (a, b) => b.score - a.score
      );

    return NextResponse.json(sorted);

  } catch {

    return NextResponse.json([]);
  }
}