import { useGetUserReservations } from "@/domain/reservation/queries";
import { createContext, PropsWithChildren, useContext } from "react";

type MyReservationsCtxT = ReturnType<typeof useGetUserReservations>;

export const MyReservationsCtx = createContext<MyReservationsCtxT>(
	null as unknown as MyReservationsCtxT
);

export function useMyReservationsCtx() {
	const ctx = useContext(MyReservationsCtx);
	if (!ctx) {
		throw new Error(
			"useMyReservationsCtx must be used inside MyReservationsProvider"
		);
	}
	return ctx;
}

export const MyReservationsProvider = ({ children }: PropsWithChildren) => {
	const query = useGetUserReservations();

	return (
		<MyReservationsCtx.Provider value={query}>
			{children}
		</MyReservationsCtx.Provider>
	);
};
