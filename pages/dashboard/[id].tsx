import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { CoinDict, CoinPair, Dashboard, PriceResponse } from "lib/types";
import { addPair, getDashboardById } from "lib/store";
import { BootstrapDataContext } from "components/BootstrapDataProvider";

// Define Server Side Props
// export async function getServerSideProps(context: any) {
//   // fetch the todo, the param was received via context.query.id
//   const res = await fetch(process.env.API_URL + "/" + context.query.id)
//   const todo = await res.json()

//   //return the serverSideProps the todo and the url from out env variables for frontend api calls
//   return { props: { todo, url: process.env.API_URL } }
// }

const getPrices = async (
  dashboard: Dashboard,
  coins: CoinDict,
  onResult: (prices: PriceResponse) => void
) => {
  const ids = dashboard?.pairs
    .map((pair) => {
      const { symbol } = pair;
      const coin = coins[symbol];
      return coin?.id;
    })
    .filter((id) => id)
    .join(",");

  const vsCurrencies = dashboard?.pairs.map((p) => p.vsCurrency).join(",");

  const response = await fetch(
    `/api/prices?ids=${ids}&vs_currencies=${vsCurrencies}`
  );

  if (response.ok) {
    const prices = await response.json();
    onResult(prices);
  }
};

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [dashboard, setDashboard] = useState<Dashboard>();
  const { supportedCurrencies, coins } = useContext(BootstrapDataContext);
  const [options, setOptions] = useState<CoinPair[]>([]);
  const [prices, setPrices] = useState<PriceResponse>({});
  const hasCoins = !!Object.values(coins).length;

  const getDashboard = () => {
    if (typeof id === "string") {
      const dashboard = getDashboardById(id);

      if (dashboard) {
        setDashboard(dashboard);
      }
    }
  };

  const addNewPair = (newSymbol: string, newVsCurrency: string) => {
    if (!dashboard || !newSymbol || !newVsCurrency) {
      return;
    }

    addPair(dashboard.id, newSymbol, newVsCurrency);
    getDashboard();
  };

  useEffect(() => {
    const coinValues = Object.values(coins);
    if (coinValues.length) {
      const options: CoinPair[] = supportedCurrencies
        .map((vsCurrency) => {
          return coinValues
            .filter((coin) => coin.symbol && coin.symbol !== vsCurrency)
            .map((coin) => ({
              symbol: coin.symbol || "",
              vsCurrency,
            }));
        })
        .flat()
      setOptions(options);
    }
  }, [supportedCurrencies, coins]);

  useEffect(() => {
    if (dashboard && Object.values(coins).length) {
      getPrices(dashboard, coins, setPrices);
    }
  }, [coins, dashboard]);

  useEffect(() => {
    if (!dashboard) {
      getDashboard();
    }
  }, [id]);

  if (!dashboard) {
    return null;
  }

  return (
    <div>
      <Head>
        <title>Dashboard: {dashboard.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Link href="/">Back</Link>
        <h1>{dashboard.title}</h1>

        <label>Choose pair:</label>
        <select
          key={"vscurrency-" + dashboard?.pairs.length}
          onChange={(e) => {
            const option = e.target.value.split("/");
            addNewPair(option[1], option[0]);
          }}
        >
          <option>Choose symbol ({options.length})</option>
          {options.map((options) => {
            const value = options.vsCurrency + "/" + options.symbol;
            const disabled = !!dashboard.pairs.find(
              (pair) =>
                pair.symbol === options.symbol &&
                pair.vsCurrency === options.vsCurrency
            );
            return (
              <option key={value} disabled={disabled}>
                {value}
              </option>
            );
          })}
        </select>

        {dashboard &&
          hasCoins &&
          dashboard.pairs.sort().map((pair) => {
            const coin = coins[pair.symbol];
            const vsCoin = coins[pair.vsCurrency];

            const coinId = coin.id || "";
            const vsCurrencySumbol = vsCoin.symbol || "";
            let price =
              coinId && prices[coinId] && prices[coinId][vsCurrencySumbol];

            if (price) {
              price = 1 / price;
            }

            return (
              <div key={`${pair.symbol}-${pair.vsCurrency}`}>
                <img src={vsCoin.image} alt="" width={20} height={20} />{" "}
                {vsCoin?.name} /
                <img src={coin.image} alt="" width={20} height={20} />{" "}
                {coin?.name}- {price}
              </div>
            );
          })}
      </main>
    </div>
  );
};

export default Dashboard;
