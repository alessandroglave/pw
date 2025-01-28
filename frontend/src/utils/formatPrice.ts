/**
 * @desc helper used to centralize prices formatting
 **/
export function formatPrice(price: number) {
	return new Intl.NumberFormat("it-IT", {
		style: "currency",
		currency: "EUR",
		minimumFractionDigits: 2,
	}).format(price);
}
