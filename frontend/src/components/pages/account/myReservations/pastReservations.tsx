import designTokens from "@/components/ui/designTokens";
import { Reservation, ReservationDisplay } from "@/types";
import { cn } from "@/utils/cn";
import { formatReservationDataToDisplay } from "@/domain/reservation/functions";

export default function PastReservations({ data }: { data: Reservation[] }) {
	return (
		<div
			className={cn(
				"p-4 rounded-xl border bg-slate-50/40",
				designTokens.borderColor.default
			)}
		>
			<h3>Storico prenotazioni</h3>
			<ul className="grid gap-4">
				{data.map((reservation) => (
					<UserReservation
						key={reservation.id}
						data={formatReservationDataToDisplay(reservation)}
					/>
				))}
			</ul>
		</div>
	);
}

function UserReservation({ data }: { data: ReservationDisplay }) {
	return (
		<li
			className={cn(
				"py-2 border-b",
				designTokens.borderColor,
				designTokens.color.body,
				designTokens.text.alternate,
				"last:border-none",
				"flex flex-row lg:flex-nowrap justify-between items-center"
			)}
		>
			<div className="flex w-full gap-2 flex-row">
				<div>{data.id}</div>

				<div className="flex flex-col gap-0.5">
					<div>
						<strong>Check-in:</strong> {data.check_in_date}
					</div>
					<div>
						<strong>Check-out:</strong> {data.check_out_date}
					</div>
					<div>
						<strong>Persone:</strong> {data.persons}
					</div>
					<div>
						<strong>Costo Totale:</strong> {data.total}
					</div>
				</div>
			</div>
		</li>
	);
}
