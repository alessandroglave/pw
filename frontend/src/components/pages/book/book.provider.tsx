import { useToast } from "@/components/ui/useToast";
import { BookPageProps } from "@/controllers/book.controller";
import { bookReservation } from "@/domain/reservation/mutations";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type BookCtxT = Omit<BookPageProps, "session"> & {
	isLoading: boolean;
	confirmReservation: () => void;
};

export const BookCtx = createContext<BookCtxT>(null as unknown as BookCtxT);

export function useBookCtx() {
	const ctx = useContext(BookCtx);
	if (!ctx) {
		throw new Error("useBookCtx must be used inside BookProvider");
	}
	return ctx;
}

export const BookProvider = ({
	from_date,
	to_date,
	persons,
	room,
	children,
}: PropsWithChildren<Omit<BookPageProps, "session">>) => {
	const router = useRouter();
	const { data: session } = useSession();
	const [isLoading, setIsLoading] = useState<BookCtxT["isLoading"]>(false);
	const { toast } = useToast();

	const confirmReservation: BookCtxT["confirmReservation"] = async () => {
		setIsLoading(true);
		const reservation = await bookReservation(
			{
				room_id: room.id,
				from_date,
				to_date,
				persons: +persons,
			},
			session?.user?.access_token ?? ""
		);
		if (reservation?.id) {
			toast({
				title: "Prenotazione effettuata",
				variant: "success",
			});
			if (reservation) {
				router.push(`/book/confirmed?id=${reservation.id}`);
			}
		} else {
			toast({
				title:
					"Si è verificato un errore, la tua prenotazione non è stata effettuata.",
				variant: "destructive",
			});
		}
		setIsLoading(false);
	};

	const ctx = {
		from_date,
		to_date,
		persons,
		room,
		isLoading,
		confirmReservation,
	};
	return <BookCtx.Provider value={ctx}>{children}</BookCtx.Provider>;
};
