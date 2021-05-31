import Link from "next/link";
import styles from "../styles/Header.module.css";

interface HeaderProps {
  carregando: boolean;
}

function Header({ carregando }: HeaderProps) {
  return (
    <header className={styles.cabecalho}>
      <Link href="/news/1">
        <a>
          <div
            className={[
              styles.circulo,
              carregando && styles.circulo_carregando,
            ].join(" ")}
          ></div>
        </a>
      </Link>
    </header>
  );
}

export default Header;
