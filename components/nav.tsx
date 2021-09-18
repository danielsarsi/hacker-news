import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

import { API, obter } from "../lib/api";
import styles from "../styles/Nav.module.css";

function Nav() {
  const { data } = useSWR<API>("/", obter, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const router = useRouter();
  const { topico } = router.query;

  let topicos = ["news", "newest", "ask", "show", "jobs"];

  if (data) {
    topicos = data.endpoints
      // remove endpoints que não são tópicos
      .filter((d) => d.maxPages)
      .map((d) => d.topic);
  }

  const itens = topicos?.map((t) => (
    <li key={t} className={topico === t ? styles.ativo : undefined}>
      <Link href={`/${t}/1`}>
        <a>{t}</a>
      </Link>
    </li>
  ));

  return (
    <nav>
      <ul className={styles.navegacao}>{itens}</ul>
    </nav>
  );
}

export default Nav;
