import type {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

import HTMLParser from "../../components/HTMLParser";
import ItemComment from "../../components/ItemComment";
import ItemFooter from "../../components/ItemFooter";
import ItemHeader from "../../components/ItemHeader";
import { Item, obterItem, obterTopico, TOPICOS } from "../../lib/api";
import styles from "../../styles/Item.module.css";

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: GetStaticPathsResult["paths"] = [];

  for (const topic of TOPICOS) {
    const stories = await obterTopico(topic, 1);

    for (const story of stories) {
      paths.push({ params: { id: story.id + "" } });
    }
  }

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<PaginaItemProps> = async ({
  params,
}) => {
  if (!params?.id) {
    return { notFound: true };
  }

  const item = await obterItem(+params.id);

  if (!item || item.type === "job" || item.deleted || !item.title) {
    return { notFound: true };
  }

  return {
    props: { fallbackData: item },
    revalidate: 10,
  };
};

const renderizarComentario = (comments: Item[]) =>
  comments.map((comment) => (
    <ItemComment item={comment} key={comment.id}>
      {comment.comments && renderizarComentario(comment.comments)}
    </ItemComment>
  ));

interface PaginaItemProps {
  fallbackData: Item;
}

function PaginaItem({ fallbackData }: PaginaItemProps) {
  const router = useRouter();
  const { id } = router.query;

  const { data: item } = useSWR([+id!], obterItem, {
    fallbackData,
  });

  return (
    <>
      <Head>
        <title>{`${item?.title ?? fallbackData.title} / hacker news`}</title>
        <meta
          name="description"
          content={`(${item?.points ?? fallbackData.points}) por ${
            item?.user ?? fallbackData.title
          }`}
        ></meta>
      </Head>
      <main>
        {item && (
          <article>
            <section className={styles.item}>
              <ItemHeader item={item} />
              <ItemFooter item={item} />
            </section>

            {item.content && (
              <section className={styles.conteudo}>
                <HTMLParser html={item.content} />
              </section>
            )}

            {item.comments && (
              <section className={styles.comentarios}>
                {renderizarComentario(item.comments)}
              </section>
            )}
          </article>
        )}
      </main>
    </>
  );
}

export default PaginaItem;
