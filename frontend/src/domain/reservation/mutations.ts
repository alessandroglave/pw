import {
	BookGuestPayload,
	BookPayload,
	EditReservationArgs,
	Reservation,
} from "@/types";
import { client } from "@/libs/api/client";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";

export async function bookReservation(
	payload: BookPayload,
	token: string
): Promise<null | Reservation> {
	const reservation = await client.post("/reservations/", payload, token);
	if (!reservation || reservation?.status === "error") return null;
	return reservation.data.data as Reservation;
}

// admin | staff
async function bookGuestReservation(
	payload: BookGuestPayload,
	token: string
): Promise<null | Reservation> {
	const reservation = await client.post("/reservations/guest", payload, token);
	if (!reservation || reservation?.status === "error") return null;
	return reservation.data.data as Reservation;
}

export const useBookGuestReservation = () => {
	const { data: session } = useSession({ required: true });
	return useMutation({
		mutationFn: async (payload: BookGuestPayload) =>
			bookGuestReservation(payload, session?.user?.access_token ?? ""),
	});
};

export async function deleteReservation(id: Reservation["id"], token: string) {
	const response = await client.delete("/reservations/" + id, null, token);
	if (!response || response?.status === "error") return null;
	return response.data.data as { id: number; deleted: boolean };
}

export const useDeleteReservation = () => {
	const { data: session } = useSession({ required: true });
	return useMutation({
		mutationFn: async (id: number) =>
			deleteReservation(id, session?.user?.access_token ?? ""),
	});
};

export async function editReservation(
	args: EditReservationArgs,
	token: string
): Promise<null | Reservation> {
	const { reservation_id, ...body } = args;
	const reservation = await client.put(
		"/reservations/" + reservation_id,
		body,
		token
	);
	if (!reservation || reservation?.status === "error") return null;
	return reservation.data.data as Reservation;
}

export const useEditReservation = () => {
	const { data: session } = useSession({ required: true });
	return useMutation({
		mutationFn: async (args: EditReservationArgs) =>
			editReservation(args, session?.user?.access_token ?? ""),
	});
};
