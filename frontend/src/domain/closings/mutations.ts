import { client } from "@/libs/api/client";
import { Closing, CreateClosingPayload } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

async function deleteClosing(id: Closing["id"], token: string) {
	const response = await client.delete("/closings/" + id, null, token);
	if (!response || response?.status === "error") return null;
	return response.data.data as { id: number; deleted: boolean };
}

export const useDeleteClosing = () => {
	const { data: session } = useSession({ required: true });
	return useMutation({
		mutationFn: async (id: number) =>
			deleteClosing(id, session?.user?.access_token ?? ""),
	});
};

async function createClosing(payload: CreateClosingPayload, token: string) {
	const response = await client.post("/closings/", payload, token);
	if (!response || response?.status === "error") return null;
	return response.data.data as { id: number; closing: Closing };
}

export const useCreateClosing = () => {
	const { data: session } = useSession({ required: true });
	return useMutation({
		mutationFn: async (payload: CreateClosingPayload) =>
			createClosing(payload, session?.user?.access_token ?? ""),
	});
};
