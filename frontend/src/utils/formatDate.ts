import {
	format,
	intervalToDuration,
	parseISO,
	isBefore,
	startOfDay,
} from "date-fns";
import { it } from "date-fns/locale";

/**
 * @desc helpers in this file are used to centralize date parsing and validations
 **/

export function formatDate(date: any, options: any) {
	return format(date, options, { locale: it });
}
export function parseDate(date: string) {
	return parseISO(date);
}
export function calculateNights(start: any, end: any) {
	return intervalToDuration({ start, end }).days;
}
export function isBeforeToday(date: string) {
	const formattedDate = startOfDay(parseISO(date));
	const today = startOfDay(new Date());
	return isBefore(formattedDate, today);
}
