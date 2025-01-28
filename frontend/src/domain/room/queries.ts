import { Room } from "@/types";
import { client, RequestType } from "@/libs/api/client";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

export async function getRoomData(
	room_id: string | number
): Promise<null | Room> {
	const room = await client.get(
		`/rooms/${room_id}`,
		undefined,
		undefined,
		"s2s"
	);

	if (!room || room?.status === "error") return null;
	return room.data.data as Room;
}

export async function getRooms(
	type: RequestType,
	token?: string
): Promise<Room[]> {
	const rooms = await client.get("/rooms", undefined, token, type);
	if (!rooms || rooms?.status === "error") return [];
	return rooms.data.data as Room[];
}

export const useGetRooms = (type: RequestType) => {
	const { data: session } = useSession({ required: true });
	return useQuery({
		queryFn: async () => {
			const response = await getRooms(type, session!.user!.access_token);
			return response;
		},
		queryKey: ["rooms"],
		gcTime: 1, // cache time (default to 5 minutes). Set to 1ms to disable cache
	});
};
