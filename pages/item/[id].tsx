import parser from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";

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

  if (!item) {
    return { notFound: true };
  }

  if (item.type === "job") {
    return { notFound: true };
  }

  return {
    props: { item: processarItem(item) },
  };
};

function PaginaItem({
  item,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const renderizarComentario = (itens: Item[]) =>
    itens.map((item) => (
      <article tabIndex={0} className={styles.comentario} key={item.id}>
        <section className={styles.conteudo}>{parser(item.content)}</section>
        <footer className={styles.informacoes}>
          <span>{item.time_ago}</span>
          {item.user && <span>{item.user}</span>}
        </footer>
        {item.comments && renderizarComentario(item.comments)}
      </article>
    ));

  return (
    <>
      <Head>
        <title>{`${item.title} / hacker news`}</title>
        <meta
          name="description"
          content={`(${item.points}) por ${item.user}`}
        ></meta>
      </Head>
      <main>
        <article>
          <section className={styles.item}>
            <p className={styles.pontos}>{item.points}</p>
            <h1 className={styles.titulo}>
              {item.url?.includes("item?id=") ? (
                <Link href={`/item/${item.id}`}>
                  <a className={styles[item.type]}>{item.title}</a>
                </Link>
              ) : (
                <a href={item.url} className={styles[item.type]}>
                  {item.title}
                </a>
              )}
            </h1>
            <footer className={styles.informacoes}>
              <span>{item.time_ago}</span>
              <span>{item.user}</span>
              <Link href={`/item/${item.id}`}>
                <a>
                  {item.comments_count === 1
                    ? `1 comment`
                    : `${item.comments_count ?? 0} comments`}
                </a>
              </Link>
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
    </>
  );
}

export default PaginaItem;
