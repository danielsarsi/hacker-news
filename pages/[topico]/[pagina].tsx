import type {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

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
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<InicioProps> = async ({
  params,
}) => {
  if (!params || !params.topico) {
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
                <p className={styleItem.pontos}>
                  {story.points ?? (story.type === "job" ? <>&#8212;</> : 0)}
                </p>
                <h1 className={styleItem.titulo}>
                  {story.url?.includes("item?id=") ? (
                    <Link href={`/item/${story.id}`}>
                      <a className={styleItem[story.type]}>{story.title}</a>
                    </Link>
                  ) : (
                    <a href={story.url} className={styleItem[story.type]}>
                      {story.title}
                    </a>
                  )}
                </h1>
                <footer className={styleItem.informacoes}>
                  <span>{story.time_ago}</span>
                  {story.user && <span>{story.user}</span>}
                  {story.type !== "job" && (
                    <Link href={`/item/${story.id}`}>
                      <a>
                        {story.comments_count === 1
                          ? `1 comment`
                          : `${story.comments_count ?? 0} comments`}
                      </a>
                    </Link>
                  )}
                </footer>
              </article>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}

export default Inicio;
