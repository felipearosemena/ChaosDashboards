import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import { createDashboard } from "lib/store";
import {
  Button,
  styled,
  TextField,
} from "@mui/material";
import { Card } from "components/Layout";

const Form = styled("form")({
  margin: "auto",
  display: "grid",
  gridTemplateColumns: '300px auto',
  gap: 20,
});

const NewDashboard: NextPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");

  const onCreate: FormEventHandler<HTMLFormElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (title.length) {
      const dashboard = createDashboard(title);
      router.push(`/dashboard/${dashboard.id}`);
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
            <Button
              style={{ width: 160 }}
              type="submit"
              color="primary"
              variant="outlined"
              disabled={!title.length}
            >
              Add Dashboard
            </Button>
          </Form>
        </Card>
      </main>
    </div>
  );
};

export default NewDashboard;
