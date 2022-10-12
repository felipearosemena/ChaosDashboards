import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Dashboard } from "lib/types";
import { getDashboards } from "lib/store";
import { useRouter } from "next/router";
import {
  Button,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
} from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Box } from "@mui/system";
import { Card } from "components/Layout";
import Rocket from "@mui/icons-material/ChevronRight";
import { BootstrapDataContext } from "components/BootstrapDataProvider";

// Define Server Side Props
// export async function getServerSideProps(context: any) {
//   // fetch the todo, the param was received via context.query.id
//   const res = await fetch(process.env.API_URL + "/" + context.query.id)
//   const todo = await res.json()

//   //return the serverSideProps the todo and the url from out env variables for frontend api calls
//   return { props: { todo, url: process.env.API_URL } }
// }


const Dashboards: NextPage = () => {
  const router = useRouter();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const { loading, error } = useContext(BootstrapDataContext);

  useEffect(() => {
    setDashboards(getDashboards());
  }, []);

  if (loading) {
    return <Card>Loading</Card>
  }

  if (error) {
    return <Card>
      <h1>Uh oh!</h1>
      <p>{error}</p>
    </Card>
  }

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
                Let's Go
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Dashboards;
