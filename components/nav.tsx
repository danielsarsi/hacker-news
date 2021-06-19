import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Nav.module.css";

function Nav() {
  const router = useRouter();
  const { topico } = router.query;

  const topicos = ["news", "newest", "ask", "show", "jobs"];

  return (
    <nav>
      <ul className={styles.navegacao}>
        {topicos.map((t) => (
          <li key={t} className={topico === t ? styles.ativo : undefined}>
            <Link href={`/${t}/1`}>
              <a>{t}</a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
