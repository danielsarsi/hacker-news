import Link from "next/link";

import { Topics } from "../lib/api";
import styles from "../styles/Pagination.module.css";

interface PaginationProps {
  topic: Topics;
  page: number;
  maxPages: number;
}

function Pagination({ topic, page, maxPages }: PaginationProps) {
  return (
    <nav role="navigation" className={styles.pagination_nav}>
      <ol className={styles.pagination_list}>
        {Array.from({ length: maxPages }, (_, i) => (
          <li key={i}>
            <Link href={`/${topic}/${i + 1}`}>
              <a aria-current={i + 1 === page ? "page" : undefined}>{i + 1}</a>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Pagination;
