import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { createDashboard } from "lib/store";

const NewDashboard: NextPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");

  const onCreate = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const dashboard = createDashboard(title);
    router.push(`/dashboard/${dashboard.id}`);
  };

  return (
    <div>
      <Head>
        <title>Add new Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Link href="/">Back</Link>
        <form onSubmit={onCreate}>
          <input name="title" onChange={(e) => setTitle(e.target.value)} />
          <button type="submit">Save</button>
        </form>
      </main>
    </div>
  );
};

export default NewDashboard;
