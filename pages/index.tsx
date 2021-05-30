import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Layout from "../components/layout";
import { obterNews, Story } from "../lib/api";
import { formatarData } from "../lib/util";
import styleInicio from "../styles/Inicio.module.css";
import styleItem from "../styles/Item.module.css";

interface InicioProps {
  news: Story[];
}

export const getServerSideProps: GetServerSideProps<InicioProps> = async () => {
  let news = await obterNews();

  news = news.map((story) => {
    story.time_ago = formatarData(story.time);
    return story;
  });

  return {
    props: {
      news,
    },
    // revalidate: 60,
  };
};

function Inicio({
  news,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <main>
        <ol className={styleInicio.lista}>
          {news.map((story) => (
            <li key={story.id}>
              <article className={styleItem.item}>
                <p className={styleItem.pontos}>
                  {story.points ?? (story.type === "job" ? <>&#8212;</> : 0)}
                </p>
                <h1 className={styleItem.titulo}>
                  <a
                    href={story.url ?? `item/${story.id}`}
                    className={styleItem[story.type]}
                  >
                    {story.title}
                  </a>
                </h1>
                <footer className={styleItem.informacoes}>
                  <span>{story.time_ago}</span>
                  {story.user && <span>{story.user}</span>}
                  {story.type === "link" && (
                    <a href={`item/${story.id}`}>
                      {story.comments_count === 1
                        ? `1 comentário`
                        : `${story.comments_count ?? 0} comentários`}
                    </a>
                  )}
                </footer>
              </article>
            </li>
          ))}
        </ol>
      </main>
    </Layout>
  );
}

export default Inicio;
