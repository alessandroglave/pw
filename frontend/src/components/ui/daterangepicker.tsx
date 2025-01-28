import { Dispatch, SetStateAction } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/utils/cn";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/utils/formatDate";
import { Button } from "./button";

// from: https://ui.shadcn.com/docs/components

export function DateRangePicker({
	date,
	setDate,
	className = "",
	fromDate,
}: React.PropsWithChildren<{
	date: DateRange | undefined;
	setDate: Dispatch<SetStateAction<DateRange | undefined>>;
	className?: string;
	fromDate?: Date;
}>) {
	return (
		<div className={cn("grid gap-2 bg-white", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"w-full justify-center text-center font-normal",
							!date && "text-gray-200"
						)}
					>
						<CalendarIcon />
						{date?.from ? (
							date.to ? (
								<>
									{formatDate(date.from, "LLL dd, y")} -{" "}
									{formatDate(date.to, "LLL dd, y")}
								</>
							) : (
								formatDate(date.from, "LLL dd, y")
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="bg-white w-auto p-0" align="start">
					<Calendar
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={setDate}
						numberOfMonths={1}
						{...(fromDate ? { hidden: { before: fromDate } } : {})}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
