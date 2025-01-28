import { backendDateFormat } from "@/constants";
import { useBackofficeReservations } from "@/domain/reservation/queries";
import { Reservation } from "@/types";
import { formatDate } from "@/utils/formatDate";
import {
	createContext,
	Dispatch,
	PropsWithChildren,
	SetStateAction,
	useContext,
	useState,
} from "react";

type ReservationsCtxT = {
	dateToCheck: Date | undefined;
	setDateToCheck: Dispatch<SetStateAction<Date | undefined>>;
	data: Reservation[] | null | undefined;
	isLoading: boolean;
	refetch: any;
};

export const ReservationsCtx = createContext<ReservationsCtxT>(
	null as unknown as ReservationsCtxT
);

export function useReservationsCtx() {
	const ctx = useContext(ReservationsCtx);
	if (!ctx) {
		throw new Error(
			"useReservationsCtx must be used inside ReservationsProvider"
		);
	}
	return ctx;
}

export const ReservationsProvider = ({ children }: PropsWithChildren) => {
	const [dateToCheck, setDateToCheck] = useState<Date | undefined>(new Date());
	const { data, isLoading, refetch } = useBackofficeReservations(
		dateToCheck ? formatDate(dateToCheck.toString(), backendDateFormat) : null
	);

	const ctx = {
		dateToCheck,
		setDateToCheck,
		data,
		isLoading,
		refetch,
	};
	return (
		<ReservationsCtx.Provider value={ctx}>{children}</ReservationsCtx.Provider>
	);
};
