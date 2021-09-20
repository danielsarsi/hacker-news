import Link from "next/link";

import { Item, Story } from "../lib/api";
import styles from "../styles/Item.module.css";

interface ItemFooterProps {
  item: Item | Story;
  showCommentsLink?: boolean;
}

function ItemFooter({ item, showCommentsLink = true }: ItemFooterProps) {
  return (
    <footer className={styles.item_footer}>
      <span>{item.time_ago}</span>
      {item.user && <span>{item.user}</span>}
      {(showCommentsLink || item.type !== "job") && (
        <Link href={`/item/${item.id}`}>
          <a>
            {item.comments_count === 1
              ? `1 comment`
              : `${item.comments_count ?? 0} comments`}
          </a>
        </Link>
      )}
    </footer>
  );
}

export default ItemFooter;
