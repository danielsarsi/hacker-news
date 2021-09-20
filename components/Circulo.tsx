import { useEffect, useState } from "react";

import styles from "../styles/Circulo.module.css";

function Circle() {
  const [carregando, estaCarregando] = useState(false);

  useEffect(() => {
    const listener = (event: CustomEventInit<boolean>) => {
      estaCarregando(event.detail || false);
    };

    document.addEventListener("loading", listener);
    return () => {
      document.removeEventListener("loading", listener);
    };
  }, []);

  return (
    <div
      className={[styles.circulo, carregando && styles.circulo_carregando].join(
        " "
      )}
    >
      <div className={styles.circulo_menor_conteudo}>
        <div className={styles.circulo_menor}></div>
      </div>
      <div className={styles.circulo_maior} />
    </div>
  );
}

export default Circle;
