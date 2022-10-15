import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Card } from "components/Layout";
import { Box, CircularProgress, Grid } from "@mui/material";
import { StatCardWidget } from "components/StatCardWidget";
import Autocomplete from "components/Autocomplete";
import {
  useDashboardByIdQuery,
  useAddCryptoPairMutation,
  useWidgetsQuery,
  useCryptoPairOptionsQuery,
} from "lib/graphql/generated";

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const {
    data,
    loading: loadingDashboard,
    error: dashboardError,
  } = useDashboardByIdQuery({
    variables: { id },
    skip: !id.length,
  });

  const dashboard = data?.dashboard;
  const {
    data: widgetData,
    loading: loadingWidgets,
    error: widgetsError,
    refetch,
  } = useWidgetsQuery({
    variables: {
      dashboardId: dashboard?.id || "",
    },
    skip: !dashboard?.id,
    notifyOnNetworkStatusChange: true,
  });
  const [addCryptoPair, { loading: addingPair }] = useAddCryptoPairMutation({
    onCompleted() {
      refetch();
    },
  });

  const {
    data: optionsData,
    loading: loadingOptions,
  } = useCryptoPairOptionsQuery();

  const widgets = widgetData?.widgets;
  const pairOptions = optionsData?.pairOptions;
  const options = useMemo(() => {
    return pairOptions && widgets
      ? pairOptions.map((option) => {
          return {
            ...option,
            disabled: !!widgets.find(
              (widget) =>
                widget.coin.id === option.coinId &&
                widget.vsCoin.symbol === option.vsCurrency
            ),
          };
        })
      : [];
  }, [pairOptions, widgets]);

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

  if (loadingDashboard) {
    return (
      <Card>
        <CircularProgress />
      </Card>
    );
  }

  if (dashboardError || widgetsError) {
    return (
      <Card>
        <h1>Failed to load dashboard</h1>
        <p>
          We were not able to load this dashboard. Try refreshing your browser.
        </p>
      </Card>
    );
  }

  return (
    <div>
      <Head>
        <title>{dashboard && `Dashboard: ${dashboard?.title}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box mb={3}>
          <Card>
            <h1>{dashboard?.title}</h1>

            <Box display={"inline-flex"} alignItems={"center"}>
              <Autocomplete
                disabled={addingPair || !options.length}
                options={options}
                onChange={(option) =>
                  addNewPair(option.coinId, option.vsCurrency)
                }
              />
              {(addingPair || loadingWidgets || loadingOptions) && (
                <CircularProgress size={24} style={{ marginLeft: 20 }} />
              )}
            </Box>
          </Card>
        </Box>
        <Grid container spacing={3}>
          {widgets?.map((widget) => (
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
