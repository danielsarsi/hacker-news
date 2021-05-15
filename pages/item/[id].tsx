import parser from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { MAXIMO_ITENS } from "..";
import { Item, obterItem, obterTopStories } from "../../lib/api";
import { formatarData } from "../../lib/util";
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

  return { paths, fallback: "blocking" };
};

interface Comentario {
  item: Item;
  textoSanitizado?: string;
  dataFormatada: string;
  comentarios?: Comentario[];
}

const obterComentarios = async (item: Item) => {
  const comentario: Comentario = {
    item,
    dataFormatada: formatarData(item.time),
    comentarios: [],
  };

  if (item.text) {
    comentario.textoSanitizado = DOMPurify.sanitize(item.text);
  }

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
  textoSanitizado?: string;
  dataFormatada: string;
  comentarios: Comentario[];
}> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true,
    };
  }

  const item = await obterItem(+params.id);

  let textoSanitizado = "";
  if (item.text) {
    textoSanitizado = DOMPurify.sanitize(item.text);
  }

  const dataFormatada = formatarData(item.time);

  const comentarios: Comentario[] = [];
  if (item.kids) {
    for (const kid of item.kids) {
      const i = await obterItem(kid);
      comentarios.push(await obterComentarios(i));
    }
  }

  return {
    props: { item, comentarios, textoSanitizado, dataFormatada },
    revalidate: 60,
  };
};

const PaginaItem = ({
  item,
  textoSanitizado,
  dataFormatada,
  comentarios,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const renderizarComentarios = (loop: Comentario[]) => {
    const html: JSX.Element[] = [];

    for (const comentario of loop) {
      let textoEmHTML;
      if (comentario.textoSanitizado) {
        textoEmHTML = (
          <section className={styles.conteudo}>
            {parser(comentario.textoSanitizado)}
          </section>
        );
      }

      html.push(
        <article className={styles.comentario} key={comentario.item.id}>
          <footer className={styles.informacoes}>
            <span>{comentario.item.by}</span>
            <span>{comentario.dataFormatada}</span>
          </footer>
          {textoEmHTML}
          {comentario.comentarios &&
            renderizarComentarios(comentario.comentarios)}
        </article>
      );
    }

    return html;
  };

  let textoEmHTML;
  if (textoSanitizado) {
    textoEmHTML = (
      <section className={styles.conteudo}>{parser(textoSanitizado)}</section>
    );
  }

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
            <span>{dataFormatada}</span>
          </footer>
        </section>

        {textoEmHTML}

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
