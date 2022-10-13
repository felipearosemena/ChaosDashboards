import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import { CoinDataContext } from "components/CoinDataProvider";
import { Card } from "components/Layout";
import { Box, Grid } from "@mui/material";
import { StatCardWidget } from "components/StatCardWidget";
import Autocomplete from "components/Autocomplete";
import {
  useDashboardByIdQuery,
  useAddCryptoPairMutation,
  DashboardByIdDocument,
} from "lib/graphql/generated";
import { CoinInfoError } from "components/CoinInfoError";
import { useCryptoPairOptions } from "lib/utils";

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
      });
    }
  };

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
                addNewPair(option.coinId, option.vsCurrency)
              }
            />
          </Card>
        </Box>
        <Grid container spacing={3}>
          {dashboard?.pairs.map((pair) => {
              const coin = coinInfo?.coins.find(
                (coin) => coin.id === pair.coinId
              );
              const vsCoin = coinInfo?.coins.find(
                (coin) => coin.symbol === pair.vsCurrency
              );

              return (
                <Grid item xs={6} key={`${pair.coinId}-${pair.vsCurrency}`}>
                  {coin && vsCoin && (
                    <StatCardWidget
                      coin={coin}
                      vsCoin={vsCoin}
                      price={pair.price}
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
