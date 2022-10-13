import "styles/globals.css";
import type { AppProps } from "next/app";
import { CoinDataProvider } from "components/CoinDataProvider";
import Head from "next/head";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Layout } from "components/Layout";
import { CssBaseline } from "@mui/material";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      theme={createTheme({
        palette: { mode: "dark" },
        typography: {
          fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
          button: {
            textTransform: "none",
          },
        },
      })}
    >
      <CssBaseline />
      <CoinDataProvider>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CoinDataProvider>
    </ThemeProvider>
  );
}

export default MyApp;
