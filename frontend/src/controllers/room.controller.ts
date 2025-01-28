import { getRoomData } from "@/domain/room/queries";
import { Room } from "@/types";
import { getContextParameter } from "@/utils/getContextParameter";
import { GetServerSideProps } from "next";

export const RoomController: GetServerSideProps<RoomPageProps> = async (
	context
) => {
	const id = getContextParameter("id", context);

	if (!id || isNaN(Number(id))) {
		return redirect;
	}

	const room = await getRoomData(id);

	if (!room) {
		return redirect;
	}

	return {
		props: {
			room,
		},
	};
};

export interface RoomPageProps {
	room: Room;
}

const redirect = {
	redirect: {
		destination: "/",
		permanent: false,
	},
};
