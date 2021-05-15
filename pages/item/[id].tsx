import parser from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { MAXIMO_ITENS } from "..";
import { Item, obterItem, obterTopStories } from "../../lib/api";
import { formatarData } from "../../lib/util";
import styles from "../../styles/Item.module.css";

interface ItemEncapsulado {
  item: Item;
  textoSanitizado?: string;
  dataFormatada: string;
  comentarios?: ItemEncapsulado[];
}

const encapsularItem = async (item: Item) => {
  const itemEncapsulado: ItemEncapsulado = {
    item,
    textoSanitizado: DOMPurify.sanitize(item.text ?? "") ?? undefined,
    dataFormatada: formatarData(item.time),
  };

  if (item.kids) {
    itemEncapsulado.comentarios = [];

    for (const id of item.kids) {
      const proximoItem = await obterItem(id);
      const proximoItemEncapsulado = await encapsularItem(proximoItem);
      itemEncapsulado.comentarios.push(proximoItemEncapsulado);
    }
  }

  return itemEncapsulado;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [];
  const topStories = await obterTopStories();

  for (let index = 0; index < topStories.length; index++) {
    if (index > MAXIMO_ITENS) {
      break;
    }

    const id = "" + topStories[index];
    paths.push({ params: { id } });
  }

  return { paths, fallback: "blocking" };
};

interface PaginaItemProps {
  itemEncapsulado: ItemEncapsulado;
}

export const getStaticProps: GetStaticProps<PaginaItemProps> = async ({
  params,
}) => {
  if (!params?.id) {
    return { notFound: true };
  }

  const item = await obterItem(+params.id);
  const itemEncapsulado = await encapsularItem(item);

  return {
    props: { itemEncapsulado },
    revalidate: 60,
  };
};

function PaginaItem({
  itemEncapsulado,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const renderizarItens = (itens: ItemEncapsulado[]) => {
    const html: JSX.Element[] = [];

    for (const item of itens) {
      // API retorna em branco, às vezes
      if (item.textoSanitizado) {
        html.push(
          <article className={styles.comentario} key={item.item.id}>
            {item.textoSanitizado && (
              <section className={styles.conteudo}>
                {parser(item.textoSanitizado)}
              </section>
            )}
            <footer className={styles.informacoes}>
              <span>{item.item.by}</span>
              <span>{item.dataFormatada}</span>
            </footer>
            {item.comentarios && renderizarItens(item.comentarios)}
          </article>
        );
      }
    }

    return html;
  };

  return (
    <main>
      <Head>
        <title>{itemEncapsulado.item.title} / hacker news</title>
        <meta
          name="description"
          content={`(${itemEncapsulado.item.score}) ${itemEncapsulado.item.by}`}
        ></meta>
      </Head>
      <article>
        <section className={styles.item}>
          <p className={styles.pontos}>{itemEncapsulado.item.score}</p>
          <h1 className={styles.titulo}>
            <a
              href={
                itemEncapsulado.item.url ?? `item/${itemEncapsulado.item.id}`
              }
              className={styles[itemEncapsulado.item.type]}
            >
              {itemEncapsulado.item.title}
            </a>
          </h1>
          <footer className={styles.informacoes}>
            <span>{itemEncapsulado.item.by}</span>
            <span>{itemEncapsulado.dataFormatada}</span>
          </footer>
        </section>

        {itemEncapsulado.textoSanitizado && (
          <section className={styles.conteudo}>
            {parser(itemEncapsulado.textoSanitizado)}
          </section>
        )}

        {itemEncapsulado.comentarios && (
          <section className={styles.comentarios}>
            {renderizarItens(itemEncapsulado.comentarios)}
          </section>
        )}
      </article>
    </main>
  );
}

export default PaginaItem;
