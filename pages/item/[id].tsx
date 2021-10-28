import type {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

import ErrorPage from "../../components/ErrorPage";
import HTMLParser from "../../components/HTMLParser";
import ItemComment from "../../components/ItemComment";
import ItemFooter from "../../components/ItemFooter";
import ItemHeader from "../../components/ItemHeader";
import { APIError, apiItem, apiTopic, Item, TOPICS } from "../../lib/api";
import { isValidNumber } from "../../lib/utils";
import styles from "../../styles/Item.module.css";
import Error500 from "../500";

export const getStaticPaths: GetStaticPaths = async () => {
  const topics = await Promise.all(TOPICS.map((topic) => apiTopic(topic, 1)));
  const storiesIds = topics.flatMap((story) => story.map((item) => item.id));
  const paths = storiesIds.map((id) => ({
    params: { id: id + "" },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<ItemPageProps> = async ({
  params,
}) => {
  if (!params) {
    return { redirect: { destination: "/", permanent: true } };
  }

  if (!isValidNumber(params.id)) {
    return { notFound: true };
  }

  const id = +params.id;
  const item = await apiItem(id);

  if (!item || item.type === "job" || item.deleted || !item.title) {
    return { notFound: true };
  }

  return {
    props: { id, item },
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
  id: number;
  item: Item;
}

function ItemPage({ id, item }: ItemPageProps) {
  const { data, error } = useSWR<Item, Error>([id], apiItem, {
    fallbackData: item,
  });

  if (error) {
    if (error instanceof APIError) {
      return <ErrorPage statusCode={error.statusCode} />;
    }

    return <Error500 />;
  }

  return (
    <>
      <Head>
        <title>{`${item.title} / hacker news`}</title>
        <meta
          name="description"
          content={`(${item.points}) by ${item?.user}`}
        ></meta>
      </Head>
      <main>
        {data && (
          <article>
            <section className={styles.item}>
              <ItemHeader item={data} />
              <ItemFooter item={data} />
            </section>

            {data.content && (
              <section className={styles.item_content}>
                <HTMLParser html={data.content} />
              </section>
            )}

            {data.comments && (
              <section className={styles.item_comments}>
                {renderItemComment(data.comments)}
              </section>
            )}
          </article>
        )}
      </main>
    </>
  );
}

export default ItemPage;
