import { useRouter } from "next/router";
import styles from "../styles/Header.module.css";

function Header() {
  const router = useRouter();

  return (
    <header className={styles.cabecalho}>
      <div
        className={[
          styles.circulo,
          router.isFallback && styles.circulo_carregando,
        ].join(" ")}
      ></div>
    </header>
  );
}

export default Header;
