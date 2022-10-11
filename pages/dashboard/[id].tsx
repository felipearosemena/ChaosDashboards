import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Dashboard } from "lib/models";
import { addPair, getDashboardById } from "lib/store";
import { useBootstrapData } from "lib/hooks";
import { SimplePriceResponse } from "coingecko-api-v3";
// import { createDashboard, getDashboards } from "../store";

const getPrices = async (dashboard: Dashboard, onResult: (prices: SimplePriceResponse) => void) => {
  const ids = dashboard?.pairs.map(p => p.id).join(",")
  const vsCurrencies = dashboard?.pairs.map(p => p.vsCurrency).join(",")
  
  const response = await fetch(`/api/prices?ids=${ids}&vs_currencies=${vsCurrencies}`)
  const prices = await response.json()
  onResult(prices)
}

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [dashboard, setDashboard] = useState<Dashboard>();
  // TODO: Hoist getting this data higher up
  const { supportedTokens, supportedCurrencies, coinMap } = useBootstrapData();
  const [newSymbol, setNewSymbol] = useState<string>();
  const [prices, setPrices] = useState()

  const addNewPair = (newVsCurrency: string) => {
    if (!dashboard || !newSymbol || !newVsCurrency) {
      return;
    }

    const coinId = coinMap.get(newSymbol)?.id;
    if (coinId) {
      addPair(dashboard.id, coinId, newVsCurrency);
      setNewSymbol(undefined);
      getDashboard();
    }
  };

  const getDashboard = () => {
    if (typeof id === "string") {
      const dashboard = getDashboardById(id);

      if (dashboard) {
        setDashboard(dashboard);
        getPrices(dashboard, setPrices)
      }
    }
  };

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
        <h1>
          {dashboard.title} - {dashboard.id}
        </h1>

        {/* <button onClick={getPrices}>get prices</button> */}

        <label>Add token:</label>
        <select
          key={newSymbol}
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
        >
          <option>Choose symbol</option>
          {supportedTokens.map((symbol) => (
            <option key={symbol}>{symbol}</option>
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
          dashboard.pairs.map((pair) => (
            <div key={`${pair.id}-${pair.vsCurrency}`}>
              {pair.id} / {pair.vsCurrency}
              {prices && prices[pair.id] && prices[pair.id][pair.vsCurrency]}
            </div>
          ))}
      </main>
    </div>
  );
};

export default Dashboard;
