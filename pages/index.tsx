import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Layout from "../components/layout";
import { obterNews, Story } from "../lib/api";
import styleInicio from "../styles/Inicio.module.css";
import styleItem from "../styles/Item.module.css";

interface InicioProps {
  news: Story[];
}

export const getServerSideProps: GetServerSideProps<InicioProps> = async () => {
  const news = await obterNews();

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
          {news.map((item) => (
            <li key={item.id}>
              <article className={styleItem.item}>
                <p className={styleItem.pontos}>{item.points ?? 0}</p>
                <h1 className={styleItem.titulo}>
                  <a
                    href={item.url ?? `item/${item.id}`}
                    className={styleItem[item.type]}
                  >
                    {item.title}
                  </a>
                </h1>
                <footer className={styleItem.informacoes}>
                  {item.user && <span>{item.user}</span>}
                  <a href={`item/${item.id}`}>
                    {item.comments_count === 1
                      ? `1 comentário`
                      : `${item.comments_count ?? 0} comentários`}
                  </a>
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
