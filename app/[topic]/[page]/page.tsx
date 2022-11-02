import { notFound, redirect } from "next/navigation";

import ItemFooter from "../../../components/ItemFooter";
import ItemHeader from "../../../components/ItemHeader";
import Pagination from "../../../components/Pagination";
import { apiEndpoints, apiTopic, TOPICS } from "../../../lib/api";
import { isValidNumber, isValidTopic } from "../../../lib/utils";
import styleItem from "../../../styles/Item.module.css";
import styleTopicPage from "../../../styles/TopicPage.module.css";

interface TopicPageParams {
	topic: string;
	page: string;
}

export interface TopicPageProps {
	params: TopicPageParams;
}

export default async function TopicPage({ params }: TopicPageProps) {
	// Check if topic is valid.
	if (!isValidTopic(params.topic)) {
		notFound();
	}

	// Check if page number is valid.
	if (!isValidNumber(params.page)) {
		redirect(`/${params.topic}/1`);
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
		notFound();
	}

	// Get the news.
	const news = await apiTopic(topic, page);

	if (news.length === 0) {
		notFound();
	}

	return (
		<>
			<ol className={styleTopicPage.stories_list}>
				{news.map((story) => (
					<li key={story.id}>
						<article className={styleItem.item}>
							<ItemHeader item={story} />
							<ItemFooter item={story} />
						</article>
					</li>
				))}
			</ol>
			<Pagination topic={topic} maxPages={endpoint.maxPages} page={page} />
		</>
	);
}

export async function generateStaticParams() {
	return TOPICS.map((topic) => ({ topic, page: "1" }));
}
