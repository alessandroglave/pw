import { login } from "@/domain/auth/mutations";
import { jwtDecode, JwtPayload } from "jwt-decode";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Next-Auth configuration with custom CredentialsProvider
 * @doc https://next-auth.js.org/configuration/providers/credentials
 */
export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "text",
					placeholder: "es. mario.rossi@example.com",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, _req) {
				const user = await login({
					email: credentials?.email || "",
					password: credentials?.password || "",
				});

				if (user?.status === "success" && user.data?.data?.access_token) {
					return user.data.data.access_token;
				}
				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				const accessTokenDecoded = jwtDecode<
					JwtPayload & {
						email: string;
						first_name: string;
						last_name: string;
						role: string;
						exp: number;
					}
				>(user);

				const expires_in = accessTokenDecoded.exp * 1000
				token.user = {
					access_token: user ?? null,
					expires_in,
					email: accessTokenDecoded.email ?? null,
					first_name: accessTokenDecoded.first_name ?? null,
					last_name: accessTokenDecoded.last_name ?? null,
					role: accessTokenDecoded.role ?? null,
				};
			}
			return token;
		},
		async session({ session, token }) {
			session.user = { ...token.user };

			const accessTokenDecoded = jwtDecode<
					JwtPayload & {
						email: string;
						first_name: string;
						last_name: string;
						role: string;
						exp: number;
					}
				>(token.user.access_token);

				const expires_in = accessTokenDecoded.exp * 1000
				
				// if token is expired, logs out user
				if (Date.now() > expires_in) {
          return {
						error: 'Token expired'
					}
        }

			return session;
		},
	},
};
export default NextAuth(authOptions);
