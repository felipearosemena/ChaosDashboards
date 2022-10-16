import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Card } from "components/Layout";
import Rocket from "@mui/icons-material/ChevronRight";
import {
  DashboardsDocument,
  useDashboardsQuery,
  useDeleteDashboardMutation,
} from "lib/graphql/generated";
import { Close } from "@mui/icons-material";

const Dashboards: NextPage = () => {
  const router = useRouter();
  const { data, loading: loadingDashboards } = useDashboardsQuery({
    fetchPolicy: "cache-first",
  });
  const [deleteDashboard, { loading: deleting }] = useDeleteDashboardMutation({
    refetchQueries: [{ query: DashboardsDocument }],
  });

  if (loadingDashboards) {
    return (
      <Card>
        <CircularProgress />
      </Card>
    );
  }

  const dashboards = data?.dashboards || [];

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
                  const testId = dashboard.title
                    .split(" ")
                    .join("-")
                    .toLowerCase();
                  return (
                    <ListItemButton
                      disableRipple
                      key={dashboard.id}
                      onClick={() => router.push(`/dashboard/${dashboard.id}`)}
                    >
                      <ListItemText primary={dashboard.title} />
                      {!!pairs.length && (
                        <Chip size={"small"} label={`${pairs.length}`} />
                      )}
                      <IconButton
                        data-testid={`delete-dashboard-${testId}`}
                        disabled={deleting}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          deleteDashboard({ variables: { id: dashboard.id } });
                        }}
                      >
                        <Close />
                      </IconButton>
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
                data-testid="new-dashboard-link"
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
