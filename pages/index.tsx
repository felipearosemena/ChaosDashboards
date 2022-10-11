import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Dashboard } from "lib/types";
import { getDashboards } from "lib/store";

// Define Server Side Props
// export async function getServerSideProps(context: any) {
//   // fetch the todo, the param was received via context.query.id
//   const res = await fetch(process.env.API_URL + "/" + context.query.id)
//   const todo = await res.json()

//   //return the serverSideProps the todo and the url from out env variables for frontend api calls
//   return { props: { todo, url: process.env.API_URL } }
// }

const Home: NextPage = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  useEffect(() => {
    setDashboards(getDashboards());
  }, []);

  return (
    <div>
      <Head>
        <title>Chaos Dashboards</title>
        <meta name="description" content="Create currency pair widgets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Link href="/new">add dashboard</Link>
        <hr />
        {!!dashboards.length && (
          <ul>
            {dashboards.map((dashboard) => (
              <li key={dashboard.id}>
                <Link href={`/dashboard/${dashboard.id}`}>
                  <span>
                    {dashboard.title} - {dashboard.pairs.length} pairs
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Home;
