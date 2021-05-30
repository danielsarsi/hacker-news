import parser from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { Item, obterItem } from "../../lib/api";
import { formatarData } from "../../lib/util";
import styles from "../../styles/Item.module.css";

const processarItem = (item: Item) => {
  item.time_ago = formatarData(item.time);

  if (item.content) {
    item.content = DOMPurify.sanitize(item.content);
  }

  if (item.comments_count > 0) {
    item.comments = item.comments.map(processarItem);
  }

  return item;
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   const paths = [];
//   const topStories = await obterTopStories();

//   for (let index = 0; index < topStories.length; index++) {
//     if (index > MAXIMO_ITENS) {
//       break;
//     }

//     const id = "" + topStories[index];
//     paths.push({ params: { id } });
//   }

//   return { paths, fallback: true };
// };

interface PaginaItemProps {
  item: Item;
}

export const getServerSideProps: GetServerSideProps<PaginaItemProps> = async ({
  params,
}) => {
  if (!params?.id) {
    return { notFound: true };
  }

  const item = await obterItem(+params.id);

  return {
    props: { item: processarItem(item) },
    // revalidate: 60,
  };
};

function PaginaItem({
  item,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const renderizarComentario = (itens: Item[]) =>
    itens.map((item) => (
      <article className={styles.comentario} key={item.id}>
        <section className={styles.conteudo}>{parser(item.content)}</section>
        <footer className={styles.informacoes}>
          {item.user && <span>{item.user}</span>}
          <span>{item.time_ago}</span>
        </footer>
        {item.comments && renderizarComentario(item.comments)}
      </article>
    ));

  return (
    <Layout titulo={item.title} descricao={`(${item.points}) por ${item.user}`}>
      <main>
        <article>
          <section className={styles.item}>
            <p className={styles.pontos}>{item.points}</p>
            <h1 className={styles.titulo}>
              <a
                href={item.url ?? `item/${item.id}`}
                className={styles[item.type]}
              >
                {item.title}
              </a>
            </h1>
            <footer className={styles.informacoes}>
              {item.user && <span>{item.user}</span>}
              <span>{item.time_ago}</span>
            </footer>
          </section>

          {item.content && (
            <section className={styles.conteudo}>
              {parser(item.content)}
            </section>
          )}

          {item.comments && (
            <section className={styles.comentarios}>
              {renderizarComentario(item.comments)}
            </section>
          )}
        </article>
      </main>
    </Layout>
  );
}

export default PaginaItem;
