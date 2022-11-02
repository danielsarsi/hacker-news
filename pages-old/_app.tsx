import "../styles/globals.css";

import { AppProps } from "next/app";
import { SWRConfig } from "swr";

import Layout from "../components/Layout";
import { loadingStateMiddleware } from "../lib/middleware";

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
