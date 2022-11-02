import { TopicPageProps } from "./[page]/page";

export default function TopicPageHead({ params }: TopicPageProps) {
	return (
		<>
			<title>{params.topic} / hacker news</title>
		</>
	);
}
