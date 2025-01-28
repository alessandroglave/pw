"use client";

import { Dispatch, SetStateAction } from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/cn";
import { presentationDateFormat } from "@/constants";
import { formatDate } from "@/utils/formatDate";

// from: https://ui.shadcn.com/docs/components

export function DatePicker({
	date,
	setDate,
}: {
	date: Date | undefined;
	setDate: Dispatch<SetStateAction<Date | undefined>>;
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[280px] justify-start text-left font-normal",
						!date && "text-gray-50"
					)}
				>
					<CalendarIcon />
					{date ? (
						formatDate(date.toString(), presentationDateFormat)
					) : (
						<span>Scegli una data</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar mode="single" selected={date} onSelect={setDate} />
			</PopoverContent>
		</Popover>
	);
}
