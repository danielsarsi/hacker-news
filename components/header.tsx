import styles from "../styles/Header.module.css";
import Nav from "./nav";

interface HeaderProps {
  carregando: boolean;
}

function Header({ carregando }: HeaderProps) {
  return (
    <header className={styles.cabecalho}>
      <div
        className={[
          styles.circulo,
          carregando && styles.circulo_carregando,
        ].join(" ")}
      ></div>
      <Nav />
    </header>
  );
}

export default Header;
