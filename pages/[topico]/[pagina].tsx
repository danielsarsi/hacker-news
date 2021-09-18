import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";

import { obterTopico, Story } from "../../lib/api";
import { formatarData } from "../../lib/util";
import styleInicio from "../../styles/Inicio.module.css";
import styleItem from "../../styles/Item.module.css";

interface InicioProps {
  news: Story[];
  topico: string;
}

export const getServerSideProps: GetServerSideProps<InicioProps> = async ({
  params,
}) => {
  if (
    params?.pagina &&
    ["news", "newest", "ask", "show", "jobs"].includes(params?.topico as string)
  ) {
    const news = await obterTopico(params.topico as string, +params.pagina);

    if (news.length === 0) {
      return { notFound: true };
    }

    return {
      props: {
        news: news.map((story) => {
          story.time_ago = formatarData(story.time);
          return story;
        }),
        topico: params.topico as string,
      },
    };
  }

  return { notFound: true };
};

function Inicio({
  news,
  topico,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{`${topico} / hacker news`}</title>
      </Head>
      <main>
        <ol className={styleInicio.lista}>
          {news.map((story) => (
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
