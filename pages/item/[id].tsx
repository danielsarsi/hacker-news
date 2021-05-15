import parser from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { MAXIMO_ITENS } from "..";
import Layout from "../../components/layout";
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
    const proximosItens = await Promise.all(item.kids.map(obterItem));
    const proximosItensEncapsulados = await Promise.all(
      proximosItens.map(encapsularItem)
    );

    itemEncapsulado.comentarios = proximosItensEncapsulados;
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

  return { paths, fallback: true };
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

  const router = useRouter();

  if (router.isFallback) {
    return <Layout />;
  }

  return (
    <Layout
      titulo={itemEncapsulado.item.title}
      descricao={`(${itemEncapsulado.item.score}) por ${itemEncapsulado.item.by}`}
    >
      <main>
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
    </Layout>
  );
}

export default PaginaItem;
