import { cn } from "@/utils/cn";
import designTokens from "@/components/ui/designTokens";
import { PropsWithChildren } from "react";
import { BookReservation, ReservationDisplay } from "@/types";
import { formatReservationDataToDisplay } from "@/domain/reservation/functions";

export default function Overview({
	reservation,
}: {
	reservation: BookReservation;
}) {
	const data = formatReservationDataToDisplay(reservation);
	return (
		<div className="grid gap-4">
			<h2 className={designTokens.text.h2}>Dettagli prenotazione</h2>
			<div>
				<p className={designTokens.text.body}>
					<strong>Check-in:</strong> {data.check_in_date}.
				</p>
				<p className={designTokens.text.body}>
					<strong>Check-out:</strong> {data.check_out_date}.
				</p>
			</div>
			<PricesRecap data={data} />
		</div>
	);
}

function PricesRecap({ data }: { data: ReservationDisplay }) {
	return (
		<ul className="m-0">
			<Item
				label={
					<div>
						<div>Camera</div>
						{data.room_type && (
							<div>
								<span
									className={cn(
										designTokens.text.caption,
										designTokens.weight.normal,
										designTokens.color["body-light"]
									)}
								>
									Tipologia camera: {data.room_type}
								</span>
							</div>
						)}
					</div>
				}
				value={data.name}
			/>
			<Item label="Prezzo per notte" value={data.price_per_night} />
			<Item label="Notti" value={data.nights} />
			<Item label="Persone" value={data.persons} />
			<Item label="Totale" value={<strong>{data.total}</strong>} />
		</ul>
	);
}

function Item({
	label,
	value,
}: PropsWithChildren<{ label: React.ReactNode; value: React.ReactNode }>) {
	return (
		<li
			className={cn(
				"py-2 border-b",
				designTokens.borderColor,
				designTokens.color.body,
				"last:border-none",
				"flex flex-row lg:flex-nowrap justify-between items-center"
			)}
		>
			<span
				className={cn(
					designTokens.weight.semibold,
					designTokens.color.title,
					designTokens.color.body,
					designTokens.text.body
				)}
			>
				{label}
			</span>
			<span className={cn(designTokens.color.title, designTokens.text.body)}>
				{value}
			</span>
		</li>
	);
}
