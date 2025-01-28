"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { it } from "react-day-picker/locale";

import { cn } from "@/utils/cn";

// from: https://ui.shadcn.com/docs/components

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps) {
	return (
		<DayPicker
			locale={it}
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			classNames={{
				root: "bg-white",
				months: `flex flex-col sm:flex-col space-y-4 sm:space-x-4 sm:space-y-0 `,
				month: "space-y-4",
				caption: "flex justify-center pt-1 relative items-center",
				caption_label: "text-sm font-medium",
				nav: "space-x-1 flex items-center",
				nav_button: cn(
					"bg-white",
					"h-7 w-7 bg-white p-0 opacity-50 hover:opacity-100"
				),
				nav_button_previous: "absolute left-1",
				nav_button_next: "absolute right-1",
				table: "w-full border-collapse space-y-1",
				head_row: "flex",
				head_cell: "text-primary-400 rounded-md w-9 font-normal text-[0.8rem]",
				row: "flex w-full mt-2",
				cell: "h-9 w-9 text-center text-sm p-0 relative  focus-within:relative focus-within:z-20",
				day: cn(
					"text-center hover:bg-primary-200",
					"h-9 w-9 p-0 font-normal aria-selected:opacity-100 aria-selected:bg-primary-400",
					"[&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-primary-400/50 [&:has([aria-selected])]:bg-primary-400 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
				),
				day_range_end: "day-range-end",
				day_selected:
					"bg-primary-600 text-white hover:bg-primary-500 hover:text-white focus:bg-primary-600 focus:text-white",
				day_today: "bg-primary-400 text-white",
				day_outside:
					"day-outside text-primary-400 opacity-50 aria-selected:bg-primary-400/50 aria-selected:text-primary-400 aria-selected:opacity-30",
				day_disabled: "text-gray-200 opacity-50",
				day_range_middle: "aria-selected:bg-primary-600 aria-selected:text-white",
				day_hidden: "invisible",
				...classNames,
			}}
			components={{
				// @ts-ignore
				IconLeft: () => <ChevronLeft className="h-4 w-4" />,
				IconRight: () => <ChevronRight className="h-4 w-4" />,
			}}
			{...props}
		/>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };
