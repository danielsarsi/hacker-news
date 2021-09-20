import { useEffect, useState } from "react";

import styles from "../styles/Circle.module.css";

function Circle() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const listener = (event: CustomEventInit<boolean>) => {
      setIsLoading(event.detail || false);
    };

    document.addEventListener("loading", listener);
    return () => {
      document.removeEventListener("loading", listener);
    };
  }, []);

  return (
    <div
      className={[styles.circle, isLoading && styles.circle_loading].join(" ")}
    >
      <div className={styles.circle_small_content}>
        <div className={styles.circle_small}></div>
      </div>
      <div className={styles.circle_big} />
    </div>
  );
}

export default Circle;
