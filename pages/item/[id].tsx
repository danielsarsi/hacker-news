import parser from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { Item, obterItem } from "../../lib/api";
import { formatarData } from "../../lib/util";
import styles from "../../styles/Item.module.css";

interface ItemEncapsulado {
  item: Item;
  textoSanitizado?: string;
  dataFormatada: string;
  comentarios?: ItemEncapsulado[];
}

const encapsularItem = (item: Item) => {
  const itemEncapsulado: ItemEncapsulado = {
    item,
    dataFormatada: formatarData(item.time),
  };

  if (item.content) {
    itemEncapsulado.textoSanitizado = DOMPurify.sanitize(item.content);
  }

  if (item.comments_count > 0) {
    itemEncapsulado.comentarios = item.comments.map(encapsularItem);
  }

  return itemEncapsulado;
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
  itemEncapsulado: ItemEncapsulado;
}

export const getServerSideProps: GetServerSideProps<PaginaItemProps> = async ({
  params,
}) => {
  if (!params?.id) {
    return { notFound: true };
  }

  const item = await obterItem(+params.id);
  const itemEncapsulado = encapsularItem(item);

  return {
    props: { itemEncapsulado },
    // revalidate: 60,
  };
};

function PaginaItem({
  itemEncapsulado,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const renderizarItens = (itens: ItemEncapsulado[]) =>
    itens.map(({ textoSanitizado, dataFormatada, item, comentarios }) => {
      if (textoSanitizado) {
        return (
          <article className={styles.comentario} key={item.id}>
            <section className={styles.conteudo}>
              {parser(textoSanitizado)}
            </section>
            <footer className={styles.informacoes}>
              {item.user && <span>{item.user}</span>}
              <span>{dataFormatada}</span>
            </footer>
            {comentarios && renderizarItens(comentarios)}
          </article>
        );
      }
    });

  const router = useRouter();

  if (router.isFallback) {
    return <Layout />;
  }

  return (
    <Layout
      titulo={itemEncapsulado.item.title}
      descricao={`(${itemEncapsulado.item.points}) por ${itemEncapsulado.item.user}`}
    >
      <main>
        <article>
          <section className={styles.item}>
            <p className={styles.pontos}>{itemEncapsulado.item.points}</p>
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
              {itemEncapsulado.item.user && (
                <span>{itemEncapsulado.item.user}</span>
              )}
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
