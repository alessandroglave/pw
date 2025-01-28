import SearchAvailabilityForm from "@/domain/search-availability/components/searchAvailabilityForm";
import { EditReservationArgs, Reservation, Room } from "@/types";
import { useGetAvailableRooms } from "@/domain/search-availability/queries";
import { useState } from "react";
import RoomPreview from "@/domain/room/components/roomPreview";
import { parseDate } from "@/utils/formatDate";
import { mapRoomToDisplay } from "@/domain/room/functions";
import Loader from "@/components/ui/loader";

export default function EditReservationForm({
	reservation,
	editAction,
}: {
	reservation: Reservation;
	editAction: (args: EditReservationArgs) => Promise<unknown>;
}) {
	const [state, setState] = useState<{
		from_date: string;
		to_date: string;
		persons: number;
	}>({
		from_date: reservation.check_in_date,
		to_date: reservation.check_out_date,
		persons: +reservation.persons,
	});

	const { data, isLoading } = useGetAvailableRooms(state);

	const search = async (from_date: string, to_date: string, persons: number) =>
		setState({ from_date, to_date, persons });

	const editHandler = async (room_id: Room["id"]) => {
		await editAction({
			...state,
			room_id,
			reservation_id: reservation.id,
		});
	};

	return (
		<div>
			<SearchAvailabilityForm
				searchAction={search}
				initialState={{
					...state,
					from_date: parseDate(state.from_date),
					to_date: parseDate(state.to_date),
				}}
			/>
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
								<div className="grid gap-4">
									{data.data.map((room: Room) => (
										<RoomPreview
											variation="small"
											room={mapRoomToDisplay(room)}
											type="edit-booking"
											key={`${state.from_date}_${state.to_date}_${state.persons}_${room.id}`}
											bookAction={() => editHandler(room.id)}
										/>
									))}
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
