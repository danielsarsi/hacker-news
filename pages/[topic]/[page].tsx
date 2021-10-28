import type {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
} from "next";
import Head from "next/head";
import useSWR from "swr";

import ErrorPage from "../../components/ErrorPage";
import ItemFooter from "../../components/ItemFooter";
import ItemHeader from "../../components/ItemHeader";
import Pagination from "../../components/Pagination";
import {
  apiEndpoints,
  APIError,
  apiTopic,
  Story,
  TOPICS,
  Topics,
} from "../../lib/api";
import { isValidNumber, isValidTopic } from "../../lib/utils";
import styleItem from "../../styles/Item.module.css";
import styleTopicPage from "../../styles/TopicPage.module.css";
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

export const getStaticProps: GetStaticProps<TopicPageProps> = async ({
  params,
}) => {
  if (!params) {
    return { redirect: { destination: "/", permanent: true } };
  }

  // Check if topic is valid.
  if (!isValidTopic(params.topic)) {
    return { notFound: true };
  }

  // Check if page number is valid.
  if (!isValidNumber(params.page)) {
    return {
      redirect: { destination: `/${params.topic}/1`, permanent: true },
    };
  }

  const topic = params.topic;
  const page = +params.page;

  // Now we know the topic is valid and there's a page number, so we
  // need to check if there's an endpoint and its maxPages.
  const topics = await apiEndpoints();

  const endpoint = topics.endpoints.find(
    (endpoint) => endpoint.topic === topic
  );

  if (!endpoint || !endpoint.maxPages) {
    return { notFound: true };
  }

  // Get the news.
  const news = await apiTopic(topic, page);

  if (news.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      topic,
      stories: news,
      page,
      maxPages: endpoint.maxPages,
    },
    revalidate: 60,
  };
};

interface TopicPageProps {
  topic: Topics;
  stories: Story[];
  page: number;
  maxPages: number;
}

function TopicPage({ page, maxPages, topic, stories }: TopicPageProps) {
  const { data, error } = useSWR<Story[], Error>([topic, page], apiTopic, {
    fallbackData: stories,
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
