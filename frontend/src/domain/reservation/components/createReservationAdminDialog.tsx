import { useState } from "react";
import { useToast } from "@/components/ui/useToast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BookGuestPayload, Room } from "@/types";
import { useGetAvailableRooms } from "@/domain/search-availability/queries";
import SearchAvailabilityForm from "@/domain/search-availability/components/searchAvailabilityForm";
import { mapRoomToDisplay } from "@/domain/room/functions";
import RoomPreview from "@/domain/room/components/roomPreview";
import Loader from "@/components/ui/loader";
import { GuestForm, GuestFormStateT } from "./guestForm";
import { useBookGuestReservation } from "../mutations";

enum VIEWS {
	SEARCH,
	FORM,
}

type SearchStateT = {
	from_date: string | undefined;
	to_date: string | undefined;
	persons: number | undefined;
};

export function CreateReservationAdminDialog({ refetch, close }: any) {
	const [view, setView] = useState<VIEWS>(VIEWS.SEARCH);
	const [searchState, setSearchState] = useState<SearchStateT>({
		from_date: undefined,
		to_date: undefined,
		persons: undefined,
	});
	const [roomId, setRoomId] = useState<number | undefined>(undefined);

	const { data, isLoading } = useGetAvailableRooms(searchState);

	const search = async (from_date: string, to_date: string, persons: number) =>
		setSearchState({ from_date, to_date, persons });

	const chooseRoom = (roomId: number) => {
		setRoomId(roomId);
		setView(VIEWS.FORM);
	};

	const { toast } = useToast();
	const { mutateAsync: createGuestReservation, isPending } =
		useBookGuestReservation();

	const onSubmit = async (state: GuestFormStateT) => {
		const payload: BookGuestPayload = {
			email: state.email,
			first_name: state.first_name,
			last_name: state.last_name,
			phone_number: state.phone_number,
			room_id: roomId!,
			persons: searchState.persons!,
			from_date: searchState.from_date!,
			to_date: searchState.to_date!,
		};
		const data = await createGuestReservation(payload);
		if (data?.id) {
			toast({ title: "Prenotazione creata", variant: "success" });
		} else {
			toast({
				title: "Si è verificato un errore, la prenotazione non è stata creata",
				variant: "destructive",
			});
		}
		close();
		refetch();
	};

	return (
		<Dialog open={true} onOpenChange={close}>
			{/* DialogTitle is used by screen readers */}
			<DialogTitle>Crea una prenotazione</DialogTitle>
			<DialogContent>
				<h2 className="text-xl font-medium text-slate-800 pb-1">
					Crea una prenotazione
				</h2>
				{view === VIEWS.SEARCH && (
					<>
						<div>
							<SearchAvailabilityForm searchAction={search} layout="rows" />
							<div className="md:col-span-7 lg:col-span-8 mt-4 bg-white p-4 rounded-xl">
								<div>
									{isLoading && (
										<div className="flex justify-center">
											<Loader />
										</div>
									)}
									{!isLoading && (
										<>
											{!data?.data && <div />}
											{data?.data && !data.data.length && (
												<div>Nessuna disponibilità</div>
											)}
											{data?.data && data.data.length > 0 && (
												<div className="max-h-[400px] relative overflow-scroll grid gap-4">
													{data.data.map((room: Room) => (
														<RoomPreview
															variation="small"
															room={mapRoomToDisplay(room)}
															type="admin-booking"
															key={`${searchState.from_date}_${searchState.to_date}_${searchState.persons}_${room.id}`}
															bookAction={() => chooseRoom(room.id)}
														/>
													))}
												</div>
											)}
										</>
									)}
								</div>
							</div>
						</div>
					</>
				)}

				{view === VIEWS.FORM && roomId && (
					<div className="grid grid-gap-2 relative">
						{isPending && (
							<div className="flex justify-center">
								<Loader />
							</div>
						)}
						{!isPending && (
							<>
								<div>
									<Button
										variant="link"
										onClick={() => setView(VIEWS.SEARCH)}
										className="p-0 text-blue-400"
									>
										Annulla
									</Button>
								</div>
								<GuestForm onSubmit={onSubmit} />
							</>
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
