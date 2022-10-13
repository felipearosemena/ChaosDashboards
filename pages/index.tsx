import type { NextPage } from "next";
import Head from "next/head";
import { useContext } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Card } from "components/Layout";
import Rocket from "@mui/icons-material/ChevronRight";
import { CoinDataContext } from "components/CoinDataProvider";
import { useDashboardsQuery } from "lib/graphql/generated";

const Dashboards: NextPage = () => {
  const router = useRouter();
  const { loading, error } = useContext(CoinDataContext);
  const { data, loading: loadingDashboards, error: dashboardsError } = useDashboardsQuery({
    fetchPolicy: 'network-only'
  });

  if (loading || loadingDashboards) {
    return <Card>Loading</Card>;
  }

  if (error || dashboardsError) {
    return (
      <Card>
        <h1>Uh oh!</h1>
        <p>{error}</p>
      </Card>
    );
  }

  const dashboards = data?.dashboards || []

  return (
    <div>
      <Head>
        <title>Chaos Dashboards</title>
        <meta name="description" content="Create currency pair widgets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Card>
          {dashboards.length ? (
            <>
              <h1>Dashboards</h1>
              <List>
                <Divider />
                {dashboards.map((dashboard) => {
                  const { pairs } = dashboard;
                  const maxToShow = 3;
                  const pairsToShow = pairs.slice(0, maxToShow);
                  const chipOverflow =
                    pairs.length > maxToShow ? pairs.length - maxToShow : 0;
                  const chips = pairsToShow
                    .map((p) => `${p.vsCurrency}/${p.symbol}`)
                    .map((label) => (
                      <Chip
                        key={label}
                        label={label}
                        size={"small"}
                        style={{ margin: "4px" }}
                      />
                    ));

                  return (
                    <ListItemButton
                      disableRipple
                      key={dashboard.id}
                      onClick={() => router.push(`/dashboard/${dashboard.id}`)}
                    >
                      <ListItemText primary={dashboard.title} />
                      {chips}{" "}
                      {!!chipOverflow && (
                        <Chip size={"small"} label={`${chipOverflow} more`} />
                      )}
                      <ChevronRight />
                    </ListItemButton>
                  );
                })}
                <Divider />
              </List>
            </>
          ) : (
            <div>
              <h1>Welcome</h1>
              <p>Get started by creating your first dashboard.</p>
              <Button
                size="large"
                variant="outlined"
                onClick={() => router.push("/new")}
                endIcon={<Rocket />}
              >
                New Dashboard
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Dashboards;
