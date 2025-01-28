import { getReservationById } from "@/domain/reservation/queries";
import { Reservation } from "@/types";
import { getContextParameter } from "@/utils/getContextParameter";
import preloadSession from "@/utils/preloadSession";
import { GetServerSideProps } from "next";

export const BookConfirmedController: GetServerSideProps<
	BookConfirmedPageProps
> = async (ctx) => {
	const session = await preloadSession(ctx);

	const id = getContextParameter("id", ctx);
	if (!id) {
		return {
			redirect: {
				destination: "/ricerca-disponibilita",
				permanent: false,
			},
		};
	}

	// On backend side, it's allowed to view the reservation only the user to whom it belongs,
	// or to a staff member ("admin" or "staff" roles)
	const reservation = await getReservationById(
		id,
		session?.user?.access_token ?? ""
	);
	if (!reservation) {
		return {
			redirect: {
				destination: "/ricerca-disponibilita",
				permanent: false,
			},
		};
	}

	return {
		props: {
			session,
			reservation,
		},
	};
};

export interface BookConfirmedPageProps {
	session: Awaited<ReturnType<typeof preloadSession>>;
	reservation: Reservation;
}
