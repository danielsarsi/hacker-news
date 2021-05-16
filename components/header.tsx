import { useRouter } from "next/router";
import styles from "../styles/Header.module.css";

function Header() {
  const router = useRouter();

  return (
    <header className={styles.cabecalho}>
      <a href="/">
        <div
          className={[
            styles.circulo,
            router.isFallback ? styles.circulo_carregando : undefined,
          ].join(" ")}
        ></div>
      </a>
    </header>
  );
}

export default Header;
