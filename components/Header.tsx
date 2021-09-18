import styles from "../styles/Header.module.css";
import Circulo from "./Circulo";
import Nav from "./Nav";

function Header() {
  return (
    <header className={styles.cabecalho}>
      <Circulo />
      <Nav />
    </header>
  );
}

export default Header;
