import { AppProps } from "next/app";

import Layout from "../components/Layout";
import "../styles/globals.css";

function HackerNews({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default HackerNews;
