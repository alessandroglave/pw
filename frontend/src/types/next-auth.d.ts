import NextAuth from "next-auth";

declare module "next-auth" {
	interface User {
		access_token: string;
		email: string;
		first_name: string;
		last_name: string;
		role: string;
		expires_in: number;
	}
	interface Session extends DefaultSession {
		[key: string | number]: any;
		user?: User;
	}
}
