import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Coin, CoinDict, Dashboard, PriceResponse } from "lib/types";
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
    .map((p) => {
      const symbol = p[0];
      const coin = coins[symbol];
      return coin?.id;
    })
    .filter((id) => id)
    .join(",");

  const vsCurrencies = dashboard?.pairs.map((p) => p[1]).join(",");

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
  const [newSymbol, setNewSymbol] = useState<string>();
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

  const addNewPair = (newVsCurrency: string) => {
    if (!dashboard || !newSymbol || !newVsCurrency) {
      return;
    }

    addPair(dashboard.id, newSymbol, newVsCurrency);
    setNewSymbol(undefined);
    getDashboard();
  };

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

        <label>Add token:</label>
        <select
          key={newSymbol}
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
        >
          <option>Choose symbol</option>
          {Object.values(coins).map((coin) => (
            <option key={coin.id}>{coin.symbol}</option>
          ))}
        </select>

        {newSymbol && (
          <>
            <label>Compare with:</label>
            <select
              onChange={(e) => {
                addNewPair(e.target.value);
              }}
            >
              <option>Choose symbol</option>
              {supportedCurrencies
                .filter((symbol) => symbol !== newSymbol)
                .map((symbol) => (
                  <option key={symbol}>{symbol}</option>
                ))}
            </select>
          </>
        )}

        {dashboard &&
          hasCoins &&
          dashboard.pairs.sort().map((pair) => {
            const coin = coins[pair[0]];
            const vsCurrency = coins[pair[1]];

            const coinId = coin.id || "";
            const vsCurrencySumbol = vsCurrency.symbol || "";
            let price =
              (coinId && prices[coinId] && prices[coinId][vsCurrencySumbol]) ||
              "";

            return (
              <div key={`${pair[0]}-${pair[1]}`}>
                <img src={coin.image} alt="" width={20} height={20} />{" "}
                {coin?.name} /{" "}
                <img src={vsCurrency.image} alt="" width={20} height={20} />{" "}
                {vsCurrency?.name} - {price}
              </div>
            );
          })}
      </main>
    </div>
  );
};

export default Dashboard;
