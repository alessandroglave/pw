import Layout from "@/components/ui/theme/layout";
import Container from "@/components/ui/container";
import Overview from "./overview";
import { BookConfirmedPageProps } from "@/controllers/book.confirmed.controller";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function BookConfirmed(props: BookConfirmedPageProps) {
	return (
		<Layout>
			<Container>
				<div className="py-8 px-8 rounded-xl bg-green-100 mb-8">
					<h1>Prenotazione confermata</h1>
					<p className="mt-2 mb-4">
						Puoi gestire la prenotazione dal tuo profilo.
					</p>
					<Link
						href="/account"
						className={buttonVariants({ variant: "default" })}
					>
						Account
					</Link>
				</div>
				<Overview reservation={props.reservation} />
			</Container>
		</Layout>
	);
}
