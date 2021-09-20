import Head from "next/head";

import type { ReactNode } from "react";

import LayoutHeader from "./LayoutHeader";

interface LayoutProps {
  children?: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
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
    </>
  );
}

export default Layout;
