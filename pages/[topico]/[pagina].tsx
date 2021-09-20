import type {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

import ItemFooter from "../../components/ItemFooter";
import ItemHeader from "../../components/ItemHeader";
import { obterTopico, obterAPI, Story } from "../../lib/api";
import styleInicio from "../../styles/Inicio.module.css";
import styleItem from "../../styles/Item.module.css";

export const getStaticPaths: GetStaticPaths = async () => {
  const topicos = await obterAPI();

  const paths: GetStaticPathsResult["paths"] = [];

  for (const endpoint of topicos.endpoints) {
    const { topic, maxPages } = endpoint;

    for (let index = 0; index < maxPages; index++) {
      paths.push({ params: { topico: topic, pagina: index + 1 + "" } });
    }
  }

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<InicioProps> = async ({
  params,
}) => {
  if (!params?.topico) {
    return { redirect: { destination: "/", permanent: false } };
  }

  if (!params.pagina) {
    return {
      redirect: { destination: `/${params.topico}/1`, permanent: false },
    };
  }

  const news = await obterTopico(params.topico as string, +params.pagina);

  if (news.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      fallbackData: news,
    },
    revalidate: 60,
  };
};

interface InicioProps {
  fallbackData: Story[];
}

function Inicio({ fallbackData }: InicioProps) {
  const router = useRouter();
  const { topico, pagina } = router.query;

  const { data } = useSWR([topico, pagina], obterTopico, {
    fallbackData,
  });

  return (
    <>
      <Head>
        <title>{`${topico} / hacker news`}</title>
      </Head>
      <main>
        <ol className={styleInicio.lista}>
          {data?.map((story) => (
            <li key={story.id}>
              <article className={styleItem.item}>
                <ItemHeader item={story} />
                <ItemFooter item={story} />
              </article>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}

export default Inicio;
