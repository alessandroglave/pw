import SearchAvailabilityForm from "@/domain/search-availability/components/searchAvailabilityForm";
import Layout from "@/components/ui/theme/layout";
import RoomPreview from "@/domain/room/components/roomPreview";
import Container from "@/components/ui/container";
import { useGetAvailableRooms } from "@/domain/search-availability/queries";
import { Room } from "@/types";
import { parseQuery } from "@/utils/parseQuery";
import { useRouter } from "next/router";
import { parseDate } from "@/utils/formatDate";
import { mapRoomToDisplay } from "@/domain/room/functions";
import Loader from "@/components/ui/loader";
import SEO from "@/libs/seo/seo";

// Reads and query parameters from URL
function usePageQueryParams() {
	const router = useRouter();
	const { from_date, to_date, persons } = router.query;

	return {
		from_date: parseQuery(from_date),
		to_date: parseQuery(to_date),
		persons: parseQuery(persons),
	};
}

export default function Search() {
	const { from_date, to_date, persons } = usePageQueryParams();
	const { data, isLoading } = useGetAvailableRooms({
		from_date,
		to_date,
		persons,
	});

	return (
		<>
			<SEO
				title="Ricerca disponibilità"
				description="Prenota il tuo prossimo soggiorno."
			/>
			<Layout>
				<Container>
					<div className="w-full grid md:grid-cols-12 gap-4">
						<div className="md:col-span-5 lg:col-span-4">
							<h5 className="mb-4">Ricerca disponibilità:</h5>
							<SearchAvailabilityForm
								searchAction="replace"
								layout="rows"
								{
									// if there are parameters in the url, they are used to set the initial state of the filters
									// (for example when landing on this page a search from the home page)
									...(from_date && to_date && persons
										? {
												initialState: {
													from_date: parseDate(from_date),
													to_date: parseDate(to_date),
													persons: Number(persons),
												},
										  }
										: {})
								}
							/>
						</div>
						<div className="md:col-span-7 lg:col-span-8">
							<div>
								{isLoading && (
									<div className="flex justify-center">
										<Loader />
									</div>
								)}
								{!isLoading && !data?.data && <div />}
								{!isLoading && data?.data && !data.data.length && (
									<div>Nessuna disponibilità</div>
								)}
								{!isLoading && data?.data && data.data.length > 0 && (
									<div className="grid gap-4">
										{data.data.map((room: Room) => (
											<RoomPreview
												variation="big"
												room={mapRoomToDisplay(room)}
												type="booking"
												key={`rp_${from_date}_${to_date}_${persons}_${room.id}`}
												bookUrl={`/book?room_id=${room.id}&from_date=${from_date}&to_date=${to_date}&persons=${persons}`}
											/>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</Container>
			</Layout>
		</>
	);
}
