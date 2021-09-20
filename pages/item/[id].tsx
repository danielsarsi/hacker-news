import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

import type { Item } from "../../lib/api";
import type {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
} from "next";

import HTMLParser from "../../components/HTMLParser";
import ItemComment from "../../components/ItemComment";
import ItemFooter from "../../components/ItemFooter";
import ItemHeader from "../../components/ItemHeader";
import { apiItem, apiTopic, TOPICS } from "../../lib/api";
import styles from "../../styles/Item.module.css";
import Error500 from "../500";

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: GetStaticPathsResult["paths"] = [];

  for (const topic of TOPICS) {
    const stories = await apiTopic(topic, 1);

    for (const story of stories) {
      paths.push({ params: { id: story.id + "" } });
    }
  }

  return {
    paths,
    fallback: "blocking",
  };
};

interface ItemPageQuery {
  [key: string]: string;
  id: string;
}

export const getStaticProps: GetStaticProps<ItemPageProps, ItemPageQuery> =
  async ({ params }) => {
    if (!params?.id) {
      return { notFound: true };
    }

    const item = await apiItem(+params.id);

    if (!item || item.type === "job" || item.deleted || !item.title) {
      return { notFound: true };
    }

    return {
      props: { fallbackData: item },
      revalidate: 10,
    };
  };

const renderItemComment = (comments: Item[]) =>
  comments.map((comment) => (
    <ItemComment item={comment} key={comment.id}>
      {comment.comments && renderItemComment(comment.comments)}
    </ItemComment>
  ));

interface ItemPageProps {
  fallbackData: Item;
}

function ItemPage({ fallbackData }: ItemPageProps) {
  const router = useRouter();
  const { id } = router.query as ItemPageQuery;

  const { data: item, error } = useSWR([+id], apiItem, {
    fallbackData,
  });

  if (error) {
    return <Error500 />;
  }

  return (
    <>
      <Head>
        <title>{`${item?.title ?? fallbackData.title} / hacker news`}</title>
        <meta
          name="description"
          content={`(${item?.points ?? fallbackData.points}) by ${
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
              <section className={styles.item_content}>
                <HTMLParser html={item.content} />
              </section>
            )}

            {item.comments && (
              <section className={styles.item_comments}>
                {renderItemComment(item.comments)}
              </section>
            )}
          </article>
        )}
      </main>
    </>
  );
}

export default ItemPage;
