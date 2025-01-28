import { getRoomData } from "@/domain/room/queries";
import { SearchQueryData, Room } from "@/types";
import { getContextParameter } from "@/utils/getContextParameter";
import preloadSession from "@/utils/preloadSession";
import { GetServerSideProps } from "next";

export const BookController: GetServerSideProps<BookPageProps> = async (
	ctx
) => {
	const session = await preloadSession(ctx);

	const room_id = getContextParameter("room_id", ctx);
	const from_date = getContextParameter("from_date", ctx);
	const to_date = getContextParameter("to_date", ctx);
	const persons = getContextParameter("persons", ctx);

	if (!room_id || !from_date || !to_date || !persons) {
		return {
			redirect: {
				destination: "/ricerca-disponibilita",
				permanent: false,
			},
		};
	}
	const room = await getRoomData(room_id);
	if (!room) {
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
			from_date,
			to_date,
			persons,
			room,
		},
	};
};

export interface BookPageProps extends SearchQueryData {
	session: Awaited<ReturnType<typeof preloadSession>>;
	room: Room;
}
