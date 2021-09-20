import type { Item } from "../lib/api";

import styles from "../styles/Item.module.css";
import HTMLParser from "./HTMLParser";
import ItemFooter from "./ItemFooter";

interface ItemCommentProps {
  item: Item;
  children?: React.ReactNode;
}

function ItemComment({ item, children }: ItemCommentProps) {
  return (
    <article tabIndex={0} className={styles.item_comment}>
      <section className={styles.item_content}>
        <HTMLParser html={item.content} />
      </section>
      <ItemFooter item={item} showCommentsLink={false} />
      {children}
    </article>
  );
}

export default ItemComment;
