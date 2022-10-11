import "styles/globals.css";
import type { AppProps } from "next/app";
import { BootstrapDataProvider } from "components/BootstrapDataProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BootstrapDataProvider>
      <Component {...pageProps} />
    </BootstrapDataProvider>
  );
}

export default MyApp;
