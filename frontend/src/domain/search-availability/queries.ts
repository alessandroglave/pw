import { client } from "@/libs/api/client";
import { useQuery } from "@tanstack/react-query";

import {
	ParsedSearchQueryData,
	Room,
	CheckRoomAvailabilityData,
} from "@/types";

export const checkRoomAvailability = (payload: CheckRoomAvailabilityData) =>
	client.get(
		`/rooms/${payload.room_id}/?from_date=${payload.from_date}&to_date=${payload.to_date}&persons=${payload.persons}`,
		payload
	);

export const useGetAvailableRooms = (search_terms: ParsedSearchQueryData) => {
	return useQuery(getAvailableRoomsQuery(search_terms));
};

const getAvailableRoomsQuery = (search_terms: ParsedSearchQueryData) => ({
	queryFn: async () => {
		if (
			!search_terms.from_date ||
			!search_terms.to_date ||
			!search_terms.persons
		) {
			return null;
		}
		const data = await client.get("/rooms/available-rooms", search_terms);
		if (!data || data.status === "error") return null;
		return data.data as { data: Room[] };
	},
	queryKey: [
		`availableRooms_${search_terms.from_date}_${search_terms.to_date}_${search_terms.persons}`,
	],
});
