import { TOPICOS } from "../lib/api";
import styles from "../styles/Nav.module.css";
import NavItem from "./NavItem";

function Nav() {
  return (
    <nav>
      <ul className={styles.navegacao}>
        {TOPICOS?.map((topico, index) => (
          <NavItem topico={topico} key={`topic-${index}`} />
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
