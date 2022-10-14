import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
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
  CoinInfo,
} from "lib/graphql/generated";
import { CoinInfoError } from "components/CoinInfoError";
import { getCoinMap, useCryptoPairOptions, useWidgetList } from "lib/utils";

const useLazyPrices = (pairs: CryptoPair[] = [], coinInfo?: CoinInfo) => {
  const [fetchPrices, { loading }] = usePricesLazyQuery();
  const [pricePairs, setPricePairs] = useState<PricePair[]>([]);

  useEffect(() => {
    if (pairs.length && coinInfo) {
      const getPrices = async () => {
        const { coins, supportedCurrencies } = coinInfo;
        const { coinsById, coinsBySymbol } = getCoinMap(coins);
        const { ids, vsCurrencies } = pairs.reduce<{
          ids: string[];
          vsCurrencies: string[];
        }>(
          (curr, pair) => {
            if (supportedCurrencies.includes(pair.vsCurrency)) {
              curr.ids.push(pair.coinId);
              curr.vsCurrencies.push(pair.vsCurrency);
            } else {
              // If the pair's vsCurrency isn't supported
              // try flipping the currencies so we're using the vsCurrency
              // corresponding to the pair's `coinId` 
              const vsCurrency = coinsById[pair.coinId]?.symbol;
              const id = coinsBySymbol[pair.vsCurrency]?.id;

              if (vsCurrency && id) {
                curr.ids.push(id);
                curr.vsCurrencies.push(vsCurrency);
              }
            }
            return curr;
          },
          {
            ids: [],
            vsCurrencies: [],
          }
        );

        const { data } = await fetchPrices({
          variables: { ids, vsCurrencies },
        });

        if (data) {
          setPricePairs(data.prices);
        }
      };

      getPrices();
    }
  }, [pairs, coinInfo, fetchPrices]);

  return { pricePairs, loading };
};

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const {
    data: coinInfoData,
    loading: loadingCoinInfo,
    error: coinInfoError,
  } = useContext(CoinDataContext);
  const coinInfo = coinInfoData?.coinInfo;
  const {
    data,
    loading: loadingDashboard,
    error: dashboardError,
    refetch,
  } = useDashboardByIdQuery({
    variables: { id },
    skip: !id.length,
  });
  const [addCryptoPair, { loading: addingPair }] = useAddCryptoPairMutation({
    onCompleted() {
      refetch();
    },
  });
  const dashboard = data?.dashboard;

  const { pricePairs } = useLazyPrices(dashboard?.pairs, coinInfo);
  const options = useCryptoPairOptions(coinInfo, dashboard?.pairs);
  const widgets = useWidgetList(dashboard?.pairs, coinInfo?.coins, pricePairs);

  const addNewPair = (newCoinId: string, newVsCurrency: string) => {
    const dashboardId = dashboard?.id;
    if (dashboardId) {
      addCryptoPair({
        variables: {
          dashboardId,
          coinId: newCoinId,
          vsCurrency: newVsCurrency,
        },
      });
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
          {widgets.map((widget) => (
            <Grid
              item
              xs={6}
              key={`${widget.coin.symbol}-${widget.vsCoin.symbol}`}
            >
              <StatCardWidget
                coin={widget.coin}
                vsCoin={widget.vsCoin}
                price={widget.price}
              />
            </Grid>
          ))}
        </Grid>
      </main>
    </div>
  );
};

export default DashboardPage;
