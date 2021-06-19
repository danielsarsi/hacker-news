import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import Header from "./header";

interface LayoutProps {
  children?: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [carregando, estaCarregando] = useState(false);

  useEffect(() => {
    const eventoComeco = (url: string) => {
      if (url !== router.asPath) {
        estaCarregando(true);
      }
    };

    const eventoCompletado = (url: string) => {
      if (url !== router.asPath) {
        estaCarregando(false);
      }
    };

    router.events.on("routeChangeStart", eventoComeco);
    router.events.on("routeChangeComplete", eventoCompletado);
    router.events.on("routeChangeError", eventoCompletado);

    return () => {
      router.events.off("routeChangeStart", eventoComeco);
      router.events.off("routeChangeComplete", eventoCompletado);
      router.events.off("routeChangeError", eventoCompletado);
    };
  }, [router.asPath, router.events]);

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
      <Header carregando={carregando} />
      {children}
    </>
  );
}

export default Layout;
