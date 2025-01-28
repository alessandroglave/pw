export type Room = {
	id: number;
	name: string;
	room_type: string;
	capacity: string;
	description: string;
	price_per_night: number;
	room_number: number;
};
export type RoomDisplay = Omit<Room, "price_per_night"> & {
	price_per_night: string;
	featured_image?: string;
	gallery: string[];
};

export type ParsedSearchQueryData = {
	from_date: string | undefined;
	to_date: string | undefined;
	persons: string | number | undefined;
};

export type SearchQueryData = {
	[Property in keyof ParsedSearchQueryData]: NonNullable<
		ParsedSearchQueryData[Property]
	>;
};
export type CheckRoomAvailabilityData = Omit<SearchQueryData, "persons"> & {
	room_id: number;
	persons: number;
};

export type User = {
	role: string;
};

export type PersonalInfo = {
	first_name: string;
	last_name: string;
	email: string;
	phone_number?: string;
};

export type Guest = {
	id: number;
	personal_info: PersonalInfo;
};

export type BookPayload = CheckRoomAvailabilityData;
export type BookGuestPayload = BookPayload & PersonalInfo;

export type Reservation = {
	id: number;
	check_in_date: string;
	check_out_date: string;
	total_cost: number;
	notes?: string | null;
	persons: number | string;
	room: Room;
	guest: Guest;
};

export type BookReservation = Omit<Reservation, "id" | "guest"> & {
	guest: Omit<Guest, "id" | "personal_info"> & {
		personal_info: Omit<PersonalInfo, "id">;
	};
};

export type ReservationDisplay = {
	id: React.ReactNode;
	check_in_date: React.ReactNode;
	check_out_date: React.ReactNode;
	name: string;
	room_type: string;
	price_per_night: React.ReactNode;
	nights: React.ReactNode;
	persons: React.ReactNode;
	total: React.ReactNode;
};

export type EditReservationArgs = {
	reservation_id: number;
	room_id: number;
	from_date: string;
	to_date: string;
	persons: number;
};

export type Closing = {
	id: number;
	from_date: string;
	to_date: string;
	reason: string | null;
};

export type CreateClosingPayload = {
	from_date: string;
	to_date: string;
	reason?: string;
};

export type RoomPayload = {
	room_number: number | null;
	name: string | null;
	room_type: string | null;
	price_per_night: number;
	capacity: number;
};
