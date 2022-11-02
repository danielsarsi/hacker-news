import "../styles/globals.css";

import { Space_Mono } from "@next/font/google";

import LayoutHeader from "../components/LayoutHeader";

const spaceMono = Space_Mono({
	weight: ["400", "700"],
	style: ["italic", "normal"],
	subsets: ["latin"],
	display: "swap",
	preload: true,
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={spaceMono.className}>
			<head>
				<title>hacker news</title>
				<meta
					name="description"
					content="(mais) uma versão de news.ycombinator.com"
				></meta>
				<link rel="icon" type="image/svg+xml" href="/circle.svg" />
				<link rel="alternate icon" href="/favicon.ico" />
			</head>
			<body>
				<LayoutHeader />
				<main>{children}</main>
			</body>
		</html>
	);
}
