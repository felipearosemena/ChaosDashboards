import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { CryptoPairOption, PriceResponse } from "lib/types";
import { CoinDataContext } from "components/CoinDataProvider";
import { Card } from "components/Layout";
import { Box, Grid } from "@mui/material";
import { StatCardWidget } from "components/StatCardWidget";
import Autocomplete from "components/Autocomplete";
import {
  useDashboardByIdQuery,
  useAddCryptoPairMutation,
  DashboardByIdDocument,
  Coin,
  CoinInfo,
  CryptoPair,
} from "lib/graphql/generated";
import { CoinInfoError } from "components/CoinInfoError";

type CoinDict = { [key: string]: Coin };

const useCoinDict = (coinInfo?: CoinInfo) => {
  const [coinDict, setCoinDict] = useState<CoinDict>({});

  useEffect(() => {
    if (coinInfo) {
      let newDict: CoinDict = {};
      coinInfo.coins.forEach((coin) => (newDict[coin.symbol] = coin));
      setCoinDict(newDict);
    }
  }, [coinInfo]);

  return coinDict;
};

const getPrices = async (
  pairs: CryptoPair[] = [],
  coinDict: CoinDict = {},
  onResult: (prices: PriceResponse) => void
) => {
  const ids = pairs
    .map((pair) => {
      const { symbol } = pair;
      const coin = coinDict[symbol];
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

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const { data: coinInfoData, loading: loadingCoinInfo, error: coinInfoError } = useContext(CoinDataContext);
  const { data, loading: loadingDashboard } = useDashboardByIdQuery({
    variables: { id },
    skip: !id.length,
  });
  const [addCryptoPair] = useAddCryptoPairMutation({
    refetchQueries: [{ query: DashboardByIdDocument, variables: { id } }],
  });
  const coinInfo = coinInfoData?.coinInfo
  const coinDict = useCoinDict(coinInfo);
  const dashboard = data?.dashboard;
  const pairs = dashboard ? [...dashboard.pairs] : [];
  const [options, setOptions] = useState<CryptoPairOption[]>([]);
  const [prices, setPrices] = useState<PriceResponse>({});
  const hasCoins = !!Object.values(coinDict).length;

  const addNewPair = (newSymbol: string, newVsCurrency: string) => {
    const dashboardId = dashboard?.id;
    if (dashboardId) {
      addCryptoPair({
        variables: {
          dashboardId,
          symbol: newSymbol,
          vsCurrency: newVsCurrency,
        },
      });
    }
  };

  useEffect(() => {
    if (coinInfo) {
      const options = coinInfo.supportedCurrencies
        .map((vsCurrency) => {
          return coinInfo.coins
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
  }, [dashboard, coinInfo]);

  useEffect(() => {
    if (dashboard?.pairs && Object.values(coinDict).length) {
      getPrices(dashboard.pairs, coinDict, setPrices);
    }
  }, [coinDict, dashboard]);

  if (!dashboard) {
    return null;
  }

  if (loadingCoinInfo || loadingDashboard) {
    const label = [
      loadingCoinInfo && "tokens",
      loadingCoinInfo && "dashboards",
    ]
      .filter((v) => v)
      .join(", ");
    return <Card>Loading: {label}</Card>;
  }

  if (coinInfoError) {
    return <CoinInfoError message={coinInfoError.message} />
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
          {hasCoins &&
            !!pairs.length &&
            pairs.sort().map((pair) => {
              const coin = coinDict[pair.symbol];
              const vsCoin = coinDict[pair.vsCurrency];

              const coinId = coin?.id || "";
              const vsCurrencySumbol = vsCoin?.symbol || "";
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

export default DashboardPage;
