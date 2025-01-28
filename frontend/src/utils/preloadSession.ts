import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";

/**
 * @desc Preloads NextAuth session. Use it on server side (in GetServerSideProps)
 **/
export default async function preloadSession({
	req,
	res,
}: GetServerSidePropsContext) {
	const session: Session | null = await getServerSession(req, res, authOptions);
	return session;
}
