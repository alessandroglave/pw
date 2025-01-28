// helper used to extend requests to backend to test loading states
export function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
