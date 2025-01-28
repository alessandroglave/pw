"use client";

import Footer from "./footer";
import Navbar from "./navbar/navbar";

export default function Layout({ children }: React.PropsWithChildren) {
	return (
		<>
			<Navbar />
			<main>{children}</main>
			<Footer />
		</>
	);
}
