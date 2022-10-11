import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Dashboard, PriceResponse } from "lib/types";
import { addPair, getDashboardById } from "lib/store";
import { BootstrapDataContext } from "components/BootstrapDataProvider";

const getPrices = async (dashboard: Dashboard, onResult: (prices: PriceResponse) => void) => {
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
  const { supportedTokens, supportedCurrencies, coinMap } = useContext(BootstrapDataContext)
  const [newSymbol, setNewSymbol] = useState<string>();
  const [prices, setPrices] = useState<PriceResponse>()

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
