import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { CoinDict, CoinPair, CoinPairOption, Dashboard, PriceResponse } from "lib/types";
import { addPair, getDashboardById } from "lib/store";
import { CoinDataContext } from "components/CoinDataProvider";
import { Card } from "components/Layout";
import { Box, Grid, TextField } from "@mui/material";
import { StatCardWidget } from "components/StatCardWidget";
import Autocomplete from "components/Autocomplete";

const getPrices = async (
  pairs: CoinPair[] = [],
  coins: CoinDict,
  onResult: (prices: PriceResponse) => void
) => {
  const ids = pairs
    .map((pair) => {
      const { symbol } = pair;
      const coin = coins[symbol];
      return coin?.id;
    })
    .filter((id) => id)
    .join(",");

  const vsCurrencies = pairs.map((p) => p.vsCurrency).join(",");

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
  const {
    data: { supportedCurrencies, coins },
    loading,
  } = useContext(CoinDataContext);
  const [options, setOptions] = useState<CoinPairOption[]>([]);
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
      const options = supportedCurrencies
        .map((vsCurrency) => {
          return coinValues
            .filter((coin) => coin.symbol && coin.symbol !== vsCurrency)
            .map(({ symbol = "" }) => {
              const value = vsCurrency + "/" + symbol;
              const disabled = dashboard
                ? !!dashboard.pairs.find(
                    (pair) =>
                      pair.symbol === symbol && pair.vsCurrency === vsCurrency
                  )
                : false;
              return {
                symbol,
                vsCurrency,
                value,
                disabled,
              };
            });
        })
        .flat();

      setOptions(options);
    }
  }, [dashboard, supportedCurrencies, coins]);

  useEffect(() => {
    if (dashboard?.pairs && Object.values(coins).length) {
      getPrices(dashboard.pairs, coins, setPrices);
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

  if (loading) {
    return <Card>Loading</Card>;
  }

  return (
    <div>
      <Head>
        <title>Dashboard: {dashboard.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box mb={3}>
          <Card>
            <h1>{dashboard.title}</h1>

            <Autocomplete
              key={"vscurrency-" + dashboard?.pairs.length}
              options={options}
              onChange={(option) =>
                addNewPair(option.symbol, option.vsCurrency)
              }
            />
          </Card>
        </Box>
        <Grid container spacing={3}>
          {dashboard &&
            hasCoins &&
            dashboard.pairs.sort().map((pair) => {
              const coin = coins[pair.symbol];
              const vsCoin = coins[pair.vsCurrency];

              const coinId = coin.id || "";
              const vsCurrencySumbol = vsCoin.symbol || "";
              let price;

              if (
                coinId &&
                prices[coinId] &&
                prices[coinId][vsCurrencySumbol]
              ) {
                price = 1 / prices[coinId][vsCurrencySumbol];
              }

              return (
                <Grid item xs={6} key={`${pair.symbol}-${pair.vsCurrency}`}>
                  <StatCardWidget coin={coin} vsCoin={vsCoin} price={price} />
                </Grid>
              );
            })}
        </Grid>
      </main>
    </div>
  );
};

export default Dashboard;
