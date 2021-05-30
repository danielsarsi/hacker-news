import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Header.module.css";

function Header() {
  const router = useRouter();

  const [carregando, estaCarregando] = useState(false);

  useEffect(() => {
    const eventoComeco = (url: string) =>
      url !== router.asPath && estaCarregando(true);

    const eventoCompletado = (url: string) =>
      url === router.asPath ?? estaCarregando(false);

    router.events.on("routeChangeStart", eventoComeco);
    router.events.on("routeChangeComplete", eventoCompletado);
    router.events.on("routeChangeError", eventoCompletado);

    return () => {
      router.events.off("routeChangeStart", eventoComeco);
      router.events.off("routeChangeComplete", eventoCompletado);
      router.events.off("routeChangeError", eventoCompletado);
    };
  }, [carregando]);

  return (
    <header className={styles.cabecalho}>
      <Link href="/news/1">
        <a>
          <div
            className={[
              styles.circulo,
              carregando ? styles.circulo_carregando : undefined,
            ].join(" ")}
          ></div>
        </a>
      </Link>
    </header>
  );
}

export default Header;
