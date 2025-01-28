import { client } from "@/libs/api/client";
import { Room, RoomPayload } from "@/types";

export async function createRoom(
	payload: RoomPayload,
	token: string
): Promise<null | Room> {
	const room = await client.post("/rooms/", payload, token);
	if (!room || room?.status === "error") return null;
	return room.data.data as Room;
}

export async function deleteRoom(id: number, token: string) {
	const response = await client.delete("/rooms/" + id, undefined, token);
	if (!response || response?.status === "error") return null;
	return response.data.data as { id: number; deleted: boolean };
}
