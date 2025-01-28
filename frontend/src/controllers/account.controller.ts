import preloadSession from "@/utils/preloadSession";
import { GetServerSideProps } from "next";

export const AccountController: GetServerSideProps<
	AccountControllerPageProps
> = async (ctx) => {
	const session = await preloadSession(ctx);

	if (!session?.user) {
		return {
			redirect: {
				destination: "/login",
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

export interface AccountControllerPageProps {
	session: Awaited<ReturnType<typeof preloadSession>>;
}
