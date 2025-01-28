import { Room, RoomDisplay } from "@/types";
import {
	descriptionsByTypesMap,
	roomMocksGalleryImages,
	roomMocksHeaderImagesMap,
	roomTypesMap,
} from "./constants";
import { formatPrice } from "@/utils/formatPrice";
import { shuffleArray } from "@/utils/shuffleArray";

export function getRoomTypeLabel(roomType: Room["room_type"]) {
	return roomTypesMap.get(roomType) ?? null;
}

/**
 * @desc function used to format backend data
 * and to insert some mock descriptions and images
 */
export function mapRoomToDisplay(room: Room): RoomDisplay {
	const roomType = roomTypesMap.get(room.room_type) ?? "Single";
	
	return {
		...room,
		price_per_night: formatPrice(room.price_per_night),
		featured_image: roomMocksHeaderImagesMap.get(room.room_type) ?? roomMocksHeaderImagesMap.get('Single'),
		description: descriptionsByTypesMap.get(room.room_type) ?? descriptionsByTypesMap.get('Single')!,
		gallery: shuffleArray(roomMocksGalleryImages),
	};
}
