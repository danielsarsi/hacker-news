import styles from "../styles/Header.module.css";
import Nav from "./nav";
import Circulo from "./circulo";

function Header() {
  return (
    <header className={styles.cabecalho}>
      <Circulo />
      <Nav />
    </header>
  );
}

export default Header;
