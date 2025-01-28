export function parseQuery(value: string | string[] | undefined) {
	if (!value) return value;
	if (Array.isArray(value)) return value?.[0];
	return value;
}
