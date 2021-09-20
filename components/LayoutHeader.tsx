import Link from "next/link";

import styles from "../styles/LayoutHeader.module.css";
import Circle from "./Circle";
import Nav from "./Nav";

function LayoutHeader() {
  return (
    <header className={styles.header}>
      <Link href="/news/1">
        <a>
          <Circle />
        </a>
      </Link>
      <Nav />
    </header>
  );
}

export default LayoutHeader;
