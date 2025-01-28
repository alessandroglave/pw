import preloadSession from "@/utils/preloadSession";
import { GetServerSideProps } from "next";

/**
 * @desc used on signin/signout pages.
 * If user is already logged, it redirects it:
 * - on '/account' page, if it's a client
 * - on '/backoffice' page, if it's a manager (admin or staff roles)
 * @returns
 */
export const AuthController: GetServerSideProps = async (context) => {
	const session = await preloadSession(context);

	if (session?.user) {
		return {
			redirect: {
				destination:
					session.user?.role === "client" ? "/account" : "/backoffice",
				permanent: false,
			},
		};
	}
	return {
		props: {
			session,
		},
	};
};
