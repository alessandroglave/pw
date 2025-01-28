"use client";

import Container from "../container";

import Layout from "./layout";

export default function BackofficeLayout({
	children,
}: React.PropsWithChildren) {
	return (
		<Layout>
			<Container>
				<h1 className="mt-4">Gestione hotel</h1>
				<div>{children}</div>
			</Container>
		</Layout>
	);
}
