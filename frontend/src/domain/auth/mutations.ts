import { client } from "../../libs/api/client";

export const login = (payload: { email: string; password: string }) =>
	client.post("/auth/token", payload, undefined, "s2s");

export async function signup(payload: {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	phone_number: string;
}) {
	return client.post("/auth/signup", payload);
}
