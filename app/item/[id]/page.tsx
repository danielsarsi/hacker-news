import { notFound } from "next/navigation";

import ItemComment from "../../../components/ItemComment";
import ItemFooter from "../../../components/ItemFooter";
import ItemHeader from "../../../components/ItemHeader";
import { apiItem, Item } from "../../../lib/api";
import { isValidNumber } from "../../../lib/utils";
import styles from "../../../styles/Item.module.css";

interface ItemPageParams {
	id: string;
}

interface ItemPageProps {
	params: ItemPageParams;
}

export default async function ItemPage({ params }: ItemPageProps) {
	if (!params) {
		return { redirect: { destination: "/", permanent: true } };
	}

	if (!isValidNumber(params.id)) {
		return { notFound: true };
	}

	const id = +params.id;

	const item = await apiItem(id);

	if (!item || item.type === "job" || item.deleted || !item.title) {
		notFound();
	}

	return (
		<article>
			<section className={styles.item}>
				<ItemHeader item={item} />
				<ItemFooter item={item} />
			</section>

			{item.content && (
				<section className={styles.item_content}>{item.content}</section>
			)}

			{item.comments && (
				<section className={styles.item_comments}>
					{renderItemComment(item.comments)}
				</section>
			)}
		</article>
	);
}

const renderItemComment = (comments: Item[]) =>
	comments.map((comment) => (
		<ItemComment item={comment} key={comment.id}>
			{comment.comments && renderItemComment(comment.comments)}
		</ItemComment>
	));
