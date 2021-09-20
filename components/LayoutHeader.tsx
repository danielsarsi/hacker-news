import styles from "../styles/LayoutHeader.module.css";
import Circle from "./Circle";
import Nav from "./Nav";

function LayoutHeader() {
  return (
    <header className={styles.header}>
      <Circle />
      <Nav />
    </header>
  );
}

export default LayoutHeader;
