import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "../styles/Circulo.module.css";

function Circle() {
  const [carregando, estaCarregando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const eventoComeco = (url: string) => {
      if (url !== router.asPath) {
        estaCarregando(true);
      }
    };

    const eventoCompletado = (url: string) => {
      if (url !== router.asPath) {
        estaCarregando(false);
      }
    };

    router.events.on("routeChangeStart", eventoComeco);
    router.events.on("routeChangeComplete", eventoCompletado);
    router.events.on("routeChangeError", eventoCompletado);

    return () => {
      router.events.off("routeChangeStart", eventoComeco);
      router.events.off("routeChangeComplete", eventoCompletado);
      router.events.off("routeChangeError", eventoCompletado);
    };
  }, [router.asPath, router.events]);

  return (
    <div
      className={[styles.circulo, carregando && styles.circulo_carregando].join(
        " "
      )}
    />
  );
}

export default Circle;
