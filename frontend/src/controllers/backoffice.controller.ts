import { canManage } from "@/domain/auth/functions";
import preloadSession from "@/utils/preloadSession";
import { GetServerSideProps } from "next";

export const BackofficeController: GetServerSideProps<
	BackofficeControllerPageProps
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

	if (!canManage(session.user)) {
		return {
			redirect: {
				destination: "/",
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

export interface BackofficeControllerPageProps {
	session: Awaited<ReturnType<typeof preloadSession>>;
}
