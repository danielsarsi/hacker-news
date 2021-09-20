import Head from "next/head";

interface ErrorPageProps {
  statusCode: number;
}

function ErrorPage({ statusCode }: ErrorPageProps) {
  return (
    <>
      <Head>
        <title>{statusCode} / hacker news</title>
      </Head>
      <main>
        <h1>{statusCode}</h1>
      </main>
    </>
  );
}

export default ErrorPage;
