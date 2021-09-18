import styles from "../styles/Header.module.css";
import Circulo from "./circulo";
import Nav from "./nav";

function Header() {
  return (
    <header className={styles.cabecalho}>
      <Circulo />
      <Nav />
    </header>
  );
}

export default Header;
