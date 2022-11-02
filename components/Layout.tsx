import { Space_Mono } from "@next/font/google";
import Head from "next/head";
import type { ReactNode } from "react";

import LayoutHeader from "./LayoutHeader";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  style: ["italic", "normal"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
});
interface LayoutProps {
  children?: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className={spaceMono.className}>
      <Head>
        <title>hacker news</title>
        <meta
          name="description"
          content="(mais) uma versão de news.ycombinator.com"
        ></meta>
        <link rel="icon" type="image/svg+xml" href="/circle.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
      </Head>
      <LayoutHeader />
      {children}
    </div>
  );
}

export default Layout;
