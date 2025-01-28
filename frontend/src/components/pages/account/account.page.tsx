import Container from "@/components/ui/container";
import Layout from "@/components/ui/theme/layout";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import MyReservations from "./myReservations";

export default function Account() {
	return (
		<Layout>
			<Container>
				<h1>Il mio account</h1>
				<MyReservations />
				<Button
					variant="default"
					onClick={() =>
						signOut({
							redirect: true,
							callbackUrl: process.env.NEXT_PUBLIC_WEBSITE_URL,
						})
					}
				>
					Logout
				</Button>
			</Container>
		</Layout>
	);
}
