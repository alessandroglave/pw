import { getRooms } from "@/domain/room/queries";
import { Room } from "@/types";
import { GetServerSideProps } from "next";

/**
 * @desc Retrieves all rooms data and returns it as prop.
 * It caches the page:
 * @doc https://nextjs.org/docs/pages/api-reference/config/next-config-js/headers#cache-control
 */
export const RoomsController: GetServerSideProps<RoomsPageProps> = async (
	context
) => {
	context.res.setHeader(
		"Cache-Control",
		"public, s-maxage=1800, stale-while-revalidate=3600"
	);
	const rooms = await getRooms("s2s");
	return {
		props: {
			rooms,
		},
	};
};

export interface RoomsPageProps {
	rooms: Room[];
}
