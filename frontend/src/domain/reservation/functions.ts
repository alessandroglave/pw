import {
	BookReservation,
	Reservation,
	ReservationDisplay,
	Room,
	RoomDisplay,
} from "@/types";
import { calculateNights, formatDate } from "@/utils/formatDate";
import { checkInFrom, checkOutFrom, presentationDateFormat } from "@/constants";
import { formatPrice } from "@/utils/formatPrice";

export function formatReservationDataToDisplay(
	data: Reservation | BookReservation
): ReservationDisplay {
	return {
		id: (data as Reservation)?.id ? `#${(data as Reservation).id}` : null,
		check_in_date: `${formatDate(
			data.check_in_date,
			presentationDateFormat
		)}, dalle ${checkInFrom}`,
		check_out_date: `${formatDate(
			data.check_out_date,
			presentationDateFormat
		)}, dalle ${checkOutFrom}`,
		name: data.room.name,
		room_type: data.room.room_type,
		price_per_night: formatPrice(data.room.price_per_night),
		nights: calculateNights(data.check_in_date, data.check_out_date) ?? 1,
		persons: data.persons,
		total: formatPrice(data.total_cost),
	};
}

export function getRoomName(room: Room | RoomDisplay) {
	let text = `Camera #${room.room_number}`;
	if (!room.name) return text;
	text += ` - ${room.name}`;
	return text;
}
