import type {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

import ItemFooter from "../../components/ItemFooter";
import ItemHeader from "../../components/ItemHeader";
import Pagination from "../../components/Pagination";
import {
  apiEndpoints,
  APIError,
  apiTopic,
  isValidTopic,
  Story,
  TOPICS,
  Topics,
} from "../../lib/api";
import styleItem from "../../styles/Item.module.css";
import styleTopicPage from "../../styles/TopicPage.module.css";
import ErrorPage from "../_error";
import Error500 from "../500";

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
  topic: Topics;
  page: string;
}

export const getStaticProps: GetStaticProps<TopicPageProps, TopicPageQuery> =
  async ({ params }) => {
    if (!params) {
      return { redirect: { destination: "/", permanent: true } };
    }

    // Check if topic is valid.
    if (!isValidTopic(params.topic)) {
      return { notFound: true };
    }

    // Check if there's a page number.
    if (!params.page) {
      return {
        redirect: { destination: `/${params.topic}/1`, permanent: true },
      };
    }

    // Now we know the topic is valid and there's a page number, so we
    // need to check if there's an endpoint and its maxPages.
    const topics = await apiEndpoints();

    const endpoint = topics.endpoints.find(
      (endpoint) => endpoint.topic === params.topic
    );

    if (!endpoint || !endpoint.maxPages) {
      return { notFound: true };
    }

    // Get the news.
    const news = await apiTopic(params.topic, +params.page);

    if (news.length === 0) {
      return { notFound: true };
    }

    return {
      props: {
        fallbackData: news,
        maxPages: endpoint.maxPages,
      },
      revalidate: 60,
    };
  };

interface TopicPageProps {
  fallbackData: Story[];
  maxPages: number;
}

function TopicPage({ fallbackData, maxPages }: TopicPageProps) {
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
        <Pagination topic={topic} maxPages={maxPages} page={+page} />
      </main>
    </>
  );
}

export default TopicPage;
