import { AppProps } from "next/app";
import { SWRConfig } from "swr";

import Layout from "../components/Layout";
import { loadingStateMiddleware } from "../lib/middleware";
import "../styles/globals.css";

function HackerNews({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ use: [loadingStateMiddleware] }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  );
}

export default HackerNews;
