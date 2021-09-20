import Link from "next/link";
import { useRouter } from "next/router";

import styles from "../styles/Nav.module.css";

interface NavItemProps {
  topic: string;
}

function NavItem({ topic }: NavItemProps) {
  const router = useRouter();
  const { topic: topicParam } = router.query;

  return (
    <li className={topic === topicParam ? styles.active : undefined}>
      <Link href={`/${topic}/1`}>
        <a>{topic}</a>
      </Link>
    </li>
  );
}

export default NavItem;
