import { RoomPageProps } from "@/controllers/room.controller";
import Layout from "../../ui/theme/layout";
import Container from "../../ui/container";
import { getRoomTypeLabel, mapRoomToDisplay } from "@/domain/room/functions";
import styles from "./room.module.css";
import SEO from "@/libs/seo/seo";
import { getRoomName } from "@/domain/reservation/functions";
import { cn } from "@/utils/cn";
import ImageCard from "@/components/ui/imageCard/imageCard";
import designTokens from "@/components/ui/designTokens";

export default function Room({ room }: RoomPageProps) {
	const data = mapRoomToDisplay(room);
	return (
		<>
			<SEO
				title={getRoomName(room)}
				description={data.description}
				image={data.featured_image}
			/>
			<Layout>
				<div
					className={styles.hero}
					style={{ backgroundImage: `url(${data.featured_image})` }}
				>
					<Container type="small">
						<div className="flex items-start w-full pb-6 relative">
							<h1 className="text-white">{getRoomName(data)}</h1>
						</div>
					</Container>
				</div>
				<Container type="small">
					<div className="flex flex-col md:flex-row gap-3 md:gap-8 justify-between items-center mt-6 mb-6 ">
						<div
							className={cn(
								"bg-slate-500 text-white font-medium uppercase rounded-md text-base px-5 py-2"
							)}
						>
							{getRoomTypeLabel(data.room_type)}
						</div>
						<ul className="flex flex-col md:flex-row gap-3 md:gap-8 text-lg justify-center text-center">
							<li>
								<strong>Persone:</strong> {data.capacity}
							</li>
							<li>
								<strong>Prezzo per notte:</strong> {data.price_per_night}
							</li>
						</ul>
					</div>

					{data.description && (
						<div className="py-4">
							<h2>Descrizione</h2>
							<p>{data.description}</p>
						</div>
					)}
					{data.gallery && data.gallery.length > 0 && (
						<div className="py-4">
							<h2>Galleria fotografica</h2>
							<div className="grid md:grid-cols-3 gap-2 items-center justify-center">
								{data.gallery.map((image, key) => (
									<a
										href={image}
										key={`${image}_${key}`}
										target="_blank"
										rel="noreferrer noopener"
									>
										<img
											src={image}
											alt="Immagine stanza"
											className="w-full h-auto"
										/>
									</a>
								))}
							</div>
						</div>
					)}
					<div className="grid">
						<ImageCard
							imageUrl="/mocks/vertical-01.jpg"
							url="/ricerca-disponibilita"
						>
							<span className={cn("text-white", designTokens.text.h2)}>
								Prenota il tuo soggiorno
							</span>
						</ImageCard>
					</div>
				</Container>
			</Layout>
		</>
	);
}
