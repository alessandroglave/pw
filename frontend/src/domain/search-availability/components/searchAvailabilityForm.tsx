import { DateRangePicker } from "@/components/ui/daterangepicker";
import { useRouter } from "next/router";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { backendDateFormat } from "@/constants";
import { formatDate } from "@/utils/formatDate";
import Label from "@/components/ui/label";
import { inputStyle } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const selectPersons = [1, 2, 3, 4, 5, 6, 7, 8];

export default function SearchAvailabilityForm({
	initialState,
	searchAction = "push",
	layout = "cols",
	buttonText = "Ricerca disponibilità",
}: {
	layout?: "cols" | "rows";
	searchAction?:
		| "push"
		| "replace"
		| ((from_date: string, to_date: string, persons: number) => Promise<void>);
	initialState?: { from_date: Date; to_date: Date; persons: number };
	buttonText?: string;
}) {
	const router = useRouter();

	const [date, setDate] = useState<DateRange | undefined>(
		initialState
			? { from: initialState.from_date, to: initialState.to_date }
			: {
					from: new Date(), // oggi
					to: new Date(+new Date() + 86400000), // tomorrow (60sec*60min*24h = 86400000)
			  }
	);
	const [persons, setPersons] = useState<(typeof selectPersons)[number]>(
		initialState?.persons ?? 1
	);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formattedFromDate = formatDate(
			date?.from?.toString(),
			backendDateFormat
		);
		const formattedToDate = formatDate(date?.to?.toString(), backendDateFormat);

		if (typeof searchAction == "string") {
			// searchAction is "push" or "replace"
			router[searchAction](
				`/ricerca-disponibilita?from_date=${formatDate(
					date?.from?.toString(),
					backendDateFormat
				)}&to_date=${formatDate(
					date?.to?.toString(),
					backendDateFormat
				)}&persons=${persons}`,
				undefined,
				searchAction === "replace" ? { shallow: true } : undefined
			);
			/**
			 * shallow: true allows to change the URL without running data fetching methods again (like GetServerSideProps)
			 * @doc https://nextjs.org/docs/pages/building-your-application/routing/linking-and-navigating#shallow-routing
			 **/
		} else {
			// searchAction is a callback function
			await searchAction(formattedFromDate, formattedToDate, Number(persons));
		}
	};

	return (
		<form name="chooseDates" onSubmit={handleSubmit}>
			<div
				className={`w-full grid gap-4 items-end ${
					layout === "cols" && "md:grid-cols-3"
				}`}
			>
				<div>
					<Label>Check-in/Check-out</Label>
					<DateRangePicker
						date={date}
						setDate={setDate}
						fromDate={new Date()}
					/>
				</div>
				<div>
					<Label>Numero di ospiti</Label>
					<select
						name="persons"
						className={inputStyle}
						value={persons}
						onChange={(e) => setPersons(Number(e.currentTarget.value))}
					>
						{selectPersons.map((num) => (
							<option key={num} value={num}>
								{num}
							</option>
						))}
					</select>
				</div>
				<div>
					<Button type="submit" variant="default" className="w-full">
						{buttonText}
					</Button>
				</div>
			</div>
		</form>
	);
}
