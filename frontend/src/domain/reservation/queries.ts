import { Reservation } from "@/types";
import { client } from "@/libs/api/client";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { isBeforeToday } from "@/utils/formatDate";

export async function getReservationById(
	id: string | number,
	token: string
): Promise<null | Reservation> {
	const reservation = await client.get(
		"/reservations/" + id,
		null,
		token,
		"s2s"
	);
	if (!reservation || reservation?.status === "error") return null;
	return reservation.data.data as Reservation;
}

type GetUserReservationsData = { past: Reservation[]; active: Reservation[] };

export async function getUserReservations(
	token: string
): Promise<null | GetUserReservationsData> {
	const response = await client.get("/reservations/my", null, token);
	if (!response || response?.status === "error") return null;
	const {
		data: { data: reservations },
	} = response;

	const result: GetUserReservationsData = {
		past: [],
		active: [],
	};

	for (const reservation of reservations) {
		if (isBeforeToday(reservation.check_in_date)) {
			result.past.push(reservation);
		} else {
			result.active.push(reservation);
		}
	}

	return result;
}

export const useGetUserReservations = () => {
	const { data: session } = useSession({ required: true });
	return useQuery(getUserReservationsQuery(session!.user!.access_token));
};

const getUserReservationsQuery = (token: string) => ({
	queryFn: async () => {
		return getUserReservations(token);
	},
	queryKey: ["getUserReservations"],
	gcTime: 1, // cache time (default to 5 minutes). Set to 1ms to disable cache
});

async function getBackofficeReservations(day: string | null, token: string) {
	if (!day) return null;

	const response = await client.get("/reservations/day", { day }, token);
	if (!response || response?.status === "error") return null;
	const {
		data: { data: reservations },
	} = response;

	return reservations as Reservation[];
}

export const useBackofficeReservations = (day: string | null) => {
	const { data: session } = useSession({ required: true });
	return useQuery(
		getBackofficeReservationsQuery(day, session!.user!.access_token)
	);
};

const getBackofficeReservationsQuery = (day: string | null, token: string) => ({
	queryFn: async () => {
		return getBackofficeReservations(day, token);
	},
	queryKey: [`getBackofficeReservations_${day}`],
	gcTime: 1, // cache time (default to 5 minutes). Set to 1ms to disable cache
});
