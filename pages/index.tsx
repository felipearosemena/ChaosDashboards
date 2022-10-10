import type { NextPage } from "next";
import Head from "next/head";
import useSWR from "swr";
import { CoinPair } from "../models/CoinPair";
import styles from "../styles/Home.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

let aPair: CoinPair = ["1", "2"]

const Home: NextPage = () => {
  const { data, error } = useSWR<string[]>("/api/pairs", fetcher);

  return (
    <div className={styles.container}>
      <Head>
        <title>Chaos Dashboards</title>
        <meta name="description" content="Create currency pair widgets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {data && (
          <select placeholder="Choose symbol">
            {data.map((symbol) => (
              <option value={symbol} key={symbol}>{symbol}</option>
            ))}
          </select>
        )}
      </main>
    </div>
  );
};

export default Home;
