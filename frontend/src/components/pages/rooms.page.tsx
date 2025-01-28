import { RoomsPageProps } from "@/controllers/rooms.controller";
import Layout from "../ui/theme/layout";
import Container from "../ui/container";
import RoomPreview from "@/domain/room/components/roomPreview";
import { mapRoomToDisplay } from "@/domain/room/functions";
import SEO from "@/libs/seo/seo";

export default function Rooms({ rooms }: RoomsPageProps) {
	return (
		<>
			<SEO
				title="Le nostre camere"
				description="Scopri tutte le camere del nostro hotel"
			/>
			<Layout>
				<Container>
					<h1>Le nostre camere</h1>
					<div className="mt-6 grid gap-4">
						{rooms.length > 0 &&
							rooms.map((room) => (
								<RoomPreview
									variation="big"
									type="preview"
									room={mapRoomToDisplay(room)}
									key={room.id}
								/>
							))}
					</div>
				</Container>
			</Layout>
		</>
	);
}
