import { RoomDisplay } from "@/types";
import { cn } from "@/utils/cn";
import designTokens from "../../../components/ui/designTokens";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getRoomName } from "@/domain/reservation/functions";

type RoomPreviewProps = {
	room: RoomDisplay;
	variation: "small" | "big";
} & (
	| { type: "booking"; bookUrl: string; bookAction?: never }
	| {
			type: "edit-booking" | "admin-booking";
			bookAction: () => Promise<void> | void;
			bookUrl?: never;
	  }
	| { type: "preview"; bookUrl?: never; bookAction?: never }
);
export default function RoomPreview({
	variation,
	room,
	type,
	bookUrl,
	bookAction,
}: RoomPreviewProps) {
	const roomUrl = `/camere/${room.id}`;

	return (
		<div
			className={cn(
				"p-4",
				"border",
				designTokens.borderColor,
				designTokens.rounded.card,
				"grid grid-cols-12 gap-4 items-center"
			)}
		>
			<div className="col-span-4">
				<Link href={roomUrl}>
					<img
						src={room.featured_image}
						alt="Foto camera"
						className={cn(
							"w-full h-auto rounded-xl",
							variation === "small" && "max-h-[120px] object-cover"
						)}
					/>
				</Link>
			</div>
			<div className="col-span-8">
				<Link href={roomUrl}>
					<h4 className={cn(variation === "small" && "h5")}>
						{getRoomName(room)}
					</h4>
				</Link>
				<div className="mt-2">
					<p
						className={cn(
							designTokens.color["body-lighter"],
							variation === "small" && "text-md"
						)}
					>
						Persone: {room.capacity}
						{room.room_type && <> - Tipologia camera: {room.room_type}</>}
						<br />
						<strong>Prezzo per notte: {room.price_per_night}</strong>
					</p>
				</div>
				<div className="mt-4">
					{type === "preview" && (
						<Button variant="default" asChild>
							<Link href={roomUrl}>Scopri di più</Link>
						</Button>
					)}
					{bookUrl && (
						<Button variant="default" asChild>
							<Link href={bookUrl}>Prenota</Link>
						</Button>
					)}
					{bookAction && (
						<Button variant="outline" onClick={bookAction}>
							{type === "admin-booking" ? "Prenota" : "Modifica prenotazione"}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
