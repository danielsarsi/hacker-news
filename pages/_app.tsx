import { AppProps } from "next/app";
import "../styles/globals.css";

function HackerNews({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default HackerNews;
