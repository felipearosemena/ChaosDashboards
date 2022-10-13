import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo } from "react";
import { CoinDataContext } from "components/CoinDataProvider";
import { Card } from "components/Layout";
import { Box, Grid } from "@mui/material";
import { StatCardWidget } from "components/StatCardWidget";
import Autocomplete, { CryptoPairOption } from "components/Autocomplete";
import {
  useDashboardByIdQuery,
  useAddCryptoPairMutation,
  DashboardByIdDocument,
  Coin,
  CoinInfo,
  CryptoPair,
  Dashboard,
  usePricesLazyQuery,
} from "lib/graphql/generated";
import { CoinInfoError } from "components/CoinInfoError";

type CoinDict = { [key: string]: Coin };

const useCoinDict = (coinInfo?: CoinInfo) => {
  return useMemo(() => {
    if (coinInfo) {
      let newDict: CoinDict = {};
      coinInfo.coins.forEach((coin) => (newDict[coin.symbol] = coin));
      return newDict;
    } else {
      return {};
    }
  }, [coinInfo]);
};

const isOptionDisabled = (
  pairs: CryptoPair[] = [],
  symbol: string,
  vsCurrency: string
) => {
  return pairs
    ? !!pairs.find(
        (pair) => pair.symbol === symbol && pair.vsCurrency === vsCurrency
      )
    : false;
};

const useCryptoPairOptions = (
  coinInfo?: CoinInfo | null,
  dashboard?: Dashboard | null
) => {
  return useMemo<CryptoPairOption[]>(() => {
    if (coinInfo && dashboard) {
      // Nested loop, not ideal for performance if we have a large number of token pairs to support
      // But should be ok if we are working with a limited number
      return coinInfo.supportedCurrencies
        .map((vsCurrency) => {
          return coinInfo.coins
            .filter((coin) => coin.symbol && coin.symbol !== vsCurrency)
            .map(({ symbol = "" }) => {
              const label = vsCurrency + "/" + symbol;
              const disabled = isOptionDisabled(
                dashboard.pairs,
                symbol,
                vsCurrency
              );
              return {
                symbol,
                vsCurrency,
                label,
                disabled,
              };
            });
        })
        .flat();
    } else {
      return [];
    }
  }, [dashboard, coinInfo]);
};

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const {
    data: coinInfoData,
    loading: loadingCoinInfo,
    error: coinInfoError,
  } = useContext(CoinDataContext);
  const { data, loading: loadingDashboard } = useDashboardByIdQuery({
    fetchPolicy: "cache-first",
    variables: { id },
    skip: !id.length,
  });
  const [addCryptoPair] = useAddCryptoPairMutation({
    refetchQueries: [{ query: DashboardByIdDocument, variables: { id } }],
  });
  const [getPrices, { data: priceData }] = usePricesLazyQuery();
  const coinInfo = coinInfoData?.coinInfo;
  const coinDict = useCoinDict(coinInfo);
  const dashboard = data?.dashboard;
  const options = useCryptoPairOptions(coinInfo, dashboard);
  // const [prices, setPrices] = useState<PriceResponse>({});
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
    if (dashboard?.pairs && hasCoins) {
      const { pairs } = dashboard;
      const ids = pairs
        .map((pair) => {
          const { symbol } = pair;
          const coin = coinDict[symbol];
          return coin?.id;
        })
        .filter((id) => id);

      const vsCurrencies = pairs.map((p) => p.vsCurrency);

      getPrices({
        variables: {
          ids,
          vsCurrencies,
        },
      });
    }
  }, [getPrices, coinDict, dashboard, hasCoins]);

  if (loadingCoinInfo || loadingDashboard) {
    const label = [loadingCoinInfo && "tokens", loadingCoinInfo && "dashboards"]
      .filter((v) => v)
      .join(", ");
    return <Card>Loading: {label}</Card>;
  }

  if (coinInfoError) {
    return <CoinInfoError message={coinInfoError.message} />;
  }

  return (
    <div>
      <Head>
        <title>Dashboard: {dashboard?.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box mb={3}>
          <Card>
            <h1>{dashboard?.title}</h1>

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
            !!dashboard?.pairs.length &&
            dashboard?.pairs.map((pair) => {
              const coin = coinDict[pair.symbol];
              const vsCoin = coinDict[pair.vsCurrency];

              const coinId = coin?.id || "";
              const vsCurrency = vsCoin?.symbol || "";

              let price = priceData?.prices.find(
                (item) =>
                  item.coinId === coinId && item.vsCurrency === vsCurrency
              )?.price;

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
