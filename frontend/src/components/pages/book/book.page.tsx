import { useSession } from "next-auth/react";
import { BookProvider, useBookCtx } from "./book.provider";
import { BookPageProps } from "@/controllers/book.controller";
import Layout from "@/components/ui/theme/layout";
import Container from "@/components/ui/container";
import { AuthForm } from "@/domain/auth/components/authForm";
import Overview from "./overview";
import { calculateNights } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { LoaderOverlay } from "@/components/ui/loader";

export default function Book(props: BookPageProps) {
	const { status } = useSession();
	const isAuthenticated = status === "authenticated";

	return (
		<Layout>
			<Container>
				<BookProvider
					from_date={props.from_date}
					to_date={props.to_date}
					persons={props.persons}
					room={props.room}
				>
					{/**
					 * @desc if user is not authenticated it shows the signup form.
					 * Once registered, the AuthForm components logins user automatically.
					 * The `isAuthenticated` flag is then `true`, so <AutenticatedView /> component will be shows.
					 */}
					{!isAuthenticated ? (
						<AuthForm type="signup" />
					) : (
						<AuthenticatedView />
					)}
				</BookProvider>
			</Container>
		</Layout>
	);
}

function AuthenticatedView() {
	const { data: session } = useSession();
	const ctx = useBookCtx();
	const nights = calculateNights(ctx.from_date, ctx.to_date) ?? 1;
	const total_cost = nights * ctx.room.price_per_night;

	return (
		<div className="grid gap-4">
			{ctx.isLoading && <LoaderOverlay />}
			<Overview
				reservation={{
					check_in_date: ctx.from_date,
					check_out_date: ctx.to_date,
					persons: ctx.persons,
					room: ctx.room,
					total_cost,
					guest: {
						personal_info: {
							first_name: session?.user?.first_name || "",
							last_name: session?.user?.last_name || "",
							email: session?.user?.email || "",
						},
					},
				}}
			/>
			<ConfirmBtn />
		</div>
	);
}

function ConfirmBtn() {
	const { confirmReservation } = useBookCtx();

	return (
		<Button variant="default" type="button" onClick={confirmReservation}>
			Conferma prenotazione
		</Button>
	);
}
