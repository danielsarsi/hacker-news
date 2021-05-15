import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { MAXIMO_ITENS } from "..";
import { Item, obterItem, obterTopStories } from "../../lib/api";
import { formatarData } from "../../lib/util";
import parser from "html-react-parser";

import styles from "../../styles/Item.module.css";

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [];
  const topStories = await obterTopStories();

  for (const [index, id] of Object.entries(topStories)) {
    if (+index > MAXIMO_ITENS) {
      break;
    }

    paths.push({ params: { id: id.toString() } });
  }

  return { paths, fallback: false };
};

interface Comentario {
  item: Item;
  comentarios?: Comentario[];
}

const obterComentarios = async (item: Item) => {
  const comentario: Comentario = { item, comentarios: [] };

  if (item.kids) {
    for (const kid of item.kids) {
      const i = await obterItem(kid);
      comentario.comentarios!.push(await obterComentarios(i));
    }
  }

  return comentario;
};

export const getStaticProps: GetStaticProps<{
  item: Item;
  comentarios: Comentario[];
}> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true,
    };
  }

  const item = await obterItem(+params.id);

  const comentarios: Comentario[] = [];
  if (item.kids) {
    for (const kid of item.kids) {
      const i = await obterItem(kid);
      comentarios.push(await obterComentarios(i));
    }
  }

  return {
    props: { item, comentarios },
    revalidate: 60,
  };
};

const PaginaItem = ({
  item,
  comentarios,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const renderizarComentarios = (c: Comentario[]) => {
    return c.map(({ item, comentarios }) => (
      <article className={styles.comentario}>
        <footer className={styles.informacoes}>
          <span>{item.by}</span>
          <span>{formatarData(item.time)}</span>
        </footer>
        {item.text && (
          <section className={styles.conteudo}>{parser(item.text)}</section>
        )}
        {comentarios && renderizarComentarios(comentarios)}
      </article>
    ));
  };

  return (
    <main>
      <article>
        <section className={styles.item}>
          <p className={styles.pontos}>{item.score}</p>
          <h1 className={styles.titulo}>
            <a
              href={item.url ?? `item/${item.id}`}
              className={styles[item.type]}
            >
              {item.title}
            </a>
          </h1>
          <footer className={styles.informacoes}>
            <span>{item.by}</span>
            <span>{formatarData(item.time)}</span>
          </footer>
        </section>

        {item.text && (
          <section className={styles.conteudo}>{parser(item.text)}</section>
        )}

        {comentarios.length > 0 && (
          <section className={styles.comentarios}>
            {renderizarComentarios(comentarios)}
          </section>
        )}
      </article>
    </main>
  );
};

export default PaginaItem;
