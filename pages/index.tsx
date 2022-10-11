import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBootstrapData } from "lib/hooks";
import { Dashboard } from "lib/types";
import { getDashboards } from "lib/store";

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
