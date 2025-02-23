import { getRooms } from "@/domain/room/queries";
import { Room } from "@/types";
import { GetServerSideProps } from "next";

/**
 * @desc Retrieves all rooms data and returns it as prop.
 */
export const RoomsController: GetServerSideProps<RoomsPageProps> = async (
	context
) => {
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
