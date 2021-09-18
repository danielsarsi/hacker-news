import Link from "next/link";
import { useRouter } from "next/router";

import styles from "../styles/Nav.module.css";

interface NavItemProps {
  topico: string;
}

function NavItem({ topico }: NavItemProps) {
  const router = useRouter();
  const { topico: topicoParam } = router.query;

  return (
    <li className={topico === topicoParam ? styles.ativo : undefined}>
      <Link href={`/${topico}/1`}>
        <a>{topico}</a>
      </Link>
    </li>
  );
}

export default NavItem;
