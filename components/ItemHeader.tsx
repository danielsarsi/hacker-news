import Link from "next/link";

import type { Item, Story } from "../lib/api";

import styles from "../styles/Item.module.css";

interface ItemHeaderProps {
  item: Item | Story;
}

function ItemHeader({ item }: ItemHeaderProps) {
  return (
    <header className={styles.item_header}>
      <p className={styles.item_points}>
        {item.points ?? (item.type === "job" ? <>&#8212;</> : 0)}
      </p>
      <h1 className={styles.item_title}>
        {item.url?.includes("item?id=") ? (
          <Link href={`/item/${item.id}`}>
            <a className={styles[item.type]}>{item.title}</a>
          </Link>
        ) : (
          <a href={item.url} className={styles[item.type]}>
            {item.title}
          </a>
        )}
      </h1>
    </header>
  );
}

export default ItemHeader;
