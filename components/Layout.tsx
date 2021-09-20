import Head from "next/head";
import { ReactNode } from "react";

import Header from "./Header";

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
      <Header />
      {children}
    </>
  );
}

export default Layout;