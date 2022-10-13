import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  styled,
  TextField,
} from "@mui/material";
import { Card } from "components/Layout";
import {
  useCreateDashboardMutation,
  DashboardsDocument,
} from "lib/graphql/generated";

const Form = styled("form")({
  margin: "auto",
  display: "grid",
  gridTemplateColumns: "300px auto",
  gap: 20,
});

const NewDashboard: NextPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [createDashboard, { loading }] = useCreateDashboardMutation({
    refetchQueries: [{ query: DashboardsDocument }],
    onCompleted({ createDashboard }) {
      router.push(`/dashboard/${createDashboard.id}`);
    },
  });

  const onCreate: FormEventHandler<HTMLFormElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (title.length) {
      createDashboard({
        variables: {
          title,
        },
      });
    }
  };

  return (
    <div>
      <Head>
        <title>Add new Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Card>
          <h1>New Dashboard</h1>
          <Form onSubmit={onCreate}>
            <TextField
              name="title"
              autoFocus
              label={"Name"}
              onChange={(e) => setTitle(e.target.value)}
              style={{ flexGrow: 1 }}
            />
            <Box sx={{ position: "relative", width: 180 }}>
              <Button
                style={{ height: "100%", width: "100%" }}
                type="submit"
                color="primary"
                variant="outlined"
                disabled={!title.length || loading}
              >
                {!loading ? (
                  "Add Dashboard"
                ) : (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
              </Button>
            </Box>
          </Form>
        </Card>
      </main>
    </div>
  );
};

export default NewDashboard;
