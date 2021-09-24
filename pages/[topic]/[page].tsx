import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

import type {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
} from "next";

import ItemFooter from "../../components/ItemFooter";
import ItemHeader from "../../components/ItemHeader";
import { APIError, Story, apiTopic, apiEndpoints, TOPICS } from "../../lib/api";
import styleItem from "../../styles/Item.module.css";
import styleTopicPage from "../../styles/TopicPage.module.css";
import Error500 from "../500";
import ErrorPage from "../_error";

export const getStaticPaths: GetStaticPaths = async () => {
  const topics = await apiEndpoints();

  const paths: GetStaticPathsResult["paths"] = [];

  for (const endpoint of topics.endpoints) {
    const { topic, maxPages } = endpoint;

    if (TOPICS.includes(topic)) {
      for (let index = 0; index < maxPages; index++) {
        paths.push({ params: { topic, page: index + 1 + "" } });
      }
    }
  }

  return {
    paths,
    fallback: "blocking",
  };
};

interface TopicPageQuery {
  [key: string]: string;
  topic: string;
  page: string;
}

export const getStaticProps: GetStaticProps<TopicPageProps, TopicPageQuery> =
  async ({ params }) => {
    if (!params?.topic) {
      return { redirect: { destination: "/", permanent: false } };
    }

    if (!params.page) {
      return {
        redirect: { destination: `/${params.topic}/1`, permanent: false },
      };
    }

    const news = await apiTopic(params.topic, +params.page);

    if (news.length === 0) {
      return { notFound: true };
    }

    return {
      props: {
        fallbackData: news,
      },
      revalidate: 60,
    };
  };

interface TopicPageProps {
  fallbackData: Story[];
}

function TopicPage({ fallbackData }: TopicPageProps) {
  const router = useRouter();
  const { topic, page } = router.query as TopicPageQuery;

  const { data, error } = useSWR([topic, page], apiTopic, {
    fallbackData,
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
        <title>{`${topic} / hacker news`}</title>
      </Head>
      <main>
        <ol className={styleTopicPage.stories_list}>
          {data?.map((story) => (
            <li key={story.id}>
              <article className={styleItem.item}>
                <ItemHeader item={story} />
                <ItemFooter item={story} />
              </article>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}

export default TopicPage;
