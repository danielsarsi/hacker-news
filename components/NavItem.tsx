"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

import styles from "../styles/Nav.module.css";

interface NavItemProps {
	topic: string;
}

function NavItem({ topic }: NavItemProps) {
	const selectedLayoutSegments = useSelectedLayoutSegments();

	return (
		<li
			className={
				selectedLayoutSegments && selectedLayoutSegments[0] === topic
					? styles.active
					: undefined
			}
		>
			<Link href={`/${topic}/1`}>{topic}</Link>
		</li>
	);
}

export default NavItem;
