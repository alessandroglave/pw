import { client } from "@/libs/api/client";
import { Closing } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const getClosings = (from_date: string, token: string) =>
	client.get(`/closings/?from_date=${from_date}`, undefined, token);

export const useGetClosings = (from_date: string | null) => {
	const { data: session } = useSession({ required: true });
	return useQuery({
		queryFn: async () => {
			if (!from_date) return null;
			const response = await getClosings(
				from_date,
				session!.user!.access_token
			);
			if (!response || response.status === "error") return null;
			const {
				data: { data: closings },
			} = response;
			return closings as Closing[];
		},
		queryKey: [`closings_${from_date}`],
	});
};
