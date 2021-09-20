import { TOPICS } from "../lib/api";
import styles from "../styles/Nav.module.css";
import NavItem from "./NavItem";

function Nav() {
  return (
    <nav>
      <ul className={styles.nav}>
        {TOPICS?.map((topico, index) => (
          <NavItem topic={topico} key={`topic-${index}`} />
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
