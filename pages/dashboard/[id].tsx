import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { CoinDataContext } from "components/CoinDataProvider";
import { Card } from "components/Layout";
import { Box, CircularProgress, Grid } from "@mui/material";
import { StatCardWidget } from "components/StatCardWidget";
import Autocomplete from "components/Autocomplete";
import {
  useDashboardByIdQuery,
  useAddCryptoPairMutation,
  usePricesLazyQuery,
  CryptoPair,
  PricePair,
} from "lib/graphql/generated";
import { CoinInfoError } from "components/CoinInfoError";
import { dedupe, useCryptoPairOptions } from "lib/utils";

const useLazyPrices = () => {
  const [fetchPrices, { loading }] = usePricesLazyQuery();
  const [pricePairs, setPricePairs] = useState<PricePair[]>([]);

  const getPricesFor = async (pairs: CryptoPair[] = []) => {
    const ids = dedupe(pairs.map((p) => p.coinId));
    const vsCurrencies = dedupe(pairs.map((p) => p.vsCurrency));
    const { data } = await fetchPrices({ variables: { ids, vsCurrencies } });

    if (data) {
      setPricePairs(data.prices);
    }
  };

  return { pricePairs, getPricesFor, loading };
};

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const {
    data: coinInfoData,
    loading: loadingCoinInfo,
    error: coinInfoError,
  } = useContext(CoinDataContext);
  const { pricePairs, getPricesFor } = useLazyPrices();
  const {
    data,
    loading: loadingDashboard,
    error: dashboardError,
    refetch,
  } = useDashboardByIdQuery({
    variables: { id },
    skip: !id.length,
    onCompleted({ dashboard }) {
      getPricesFor(dashboard?.pairs);
    },
  });
  const [addCryptoPair, { loading: addingPair }] = useAddCryptoPairMutation({
    onCompleted() {
      refetch();
    },
  });
  const coinInfo = coinInfoData?.coinInfo;
  const dashboard = data?.dashboard;
  const options = useCryptoPairOptions(coinInfo, dashboard);

  const addNewPair = (newCoinId: string, newVsCurrency: string) => {
    const dashboardId = dashboard?.id;
    if (dashboardId) {
      addCryptoPair({
        variables: {
          dashboardId,
          coinId: newCoinId,
          vsCurrency: newVsCurrency,
        },
      })
    }
  };

  if (loadingCoinInfo || !dashboard) {
    return (
      <Card>
        <CircularProgress />
      </Card>
    );
  }

  if (coinInfoError) {
    return <CoinInfoError message={coinInfoError.message} />;
  }

  if (dashboardError) {
    return (
      <Card>
        <h1>Failed to load dashboard</h1>
        <p>
          {dashboardError.message} - {dashboardError.extraInfo}
        </p>
      </Card>
    );
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

            <Box display={"inline-flex"} alignItems={"center"}>
              <Autocomplete
                key={"vscurrency-" + dashboard?.pairs.length}
                disabled={addingPair || loadingDashboard}
                options={options}
                onChange={(option) =>
                  addNewPair(option.coinId, option.vsCurrency)
                }
              />
              {(addingPair || loadingDashboard) && (
                <CircularProgress size={24} style={{ marginLeft: 20 }} />
              )}
            </Box>
          </Card>
        </Box>
        <Grid container spacing={3}>
          {coinInfo?.coins &&
            dashboard?.pairs.map((pair) => {
              const coin = coinInfo?.coins.find(
                (coin) => coin.id === pair.coinId
              );
              const vsCoin = coinInfo?.coins.find(
                (coin) => coin.symbol === pair.vsCurrency
              );

              const pricePair = pricePairs.find(
                (price) =>
                  price.coinId === pair.coinId &&
                  price.vsCurrency === pair.vsCurrency
              );

              return (
                <Grid item xs={6} key={`${pair.coinId}-${pair.vsCurrency}`}>
                  {coin && vsCoin && (
                    <StatCardWidget
                      coin={coin}
                      vsCoin={vsCoin}
                      price={pricePair?.price}
                    />
                  )}
                </Grid>
              );
            })}
        </Grid>
      </main>
    </div>
  );
};

export default DashboardPage;
