import Head from "next/head";
import Header from "./header";

interface LayoutProps {
  children?: JSX.Element;
  titulo?: string;
  descricao?: string;
}

function Layout({ children, titulo, descricao }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{titulo ? `${titulo} / hacker news` : `hacker news`}</title>
        <meta
          name="description"
          content={descricao ?? "(mais) uma versão de news.ycombinator.com"}
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
