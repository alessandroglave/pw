const clientUrl = process.env.NEXT_PUBLIC_BACKEND_URL + "/v1";
const s2sUrl = process.env.S2S_BACKEND_URL + "/v1";

export type RequestType = "client" | "s2s";

const baseUrlMap = {
	client: clientUrl,
	s2s: s2sUrl,
};

/**
 * @desc Custom client, using native `fetch`, used to make requests to backed,
 * centralizing response structure.
 * It can be used from browser client and for server-to-server requests with
 * different configurations (eg. 2 different urls)
 */
export const client = {
	get: async (
		path: string,
		params: any = null,
		token?: string,
		type: RequestType | undefined = "client"
	): Promise<ClientResponse> => {
		let url = baseUrlMap[type] + path;

		if (params) {
			url += "?" + new URLSearchParams(params).toString();
		}
		try {
			const headers: HeadersInit = {};
			if (token) headers.Authorization = `Bearer ${token}`;

			const res = await fetch(url, { headers });
			return await handleResponse(res);
		} catch (e) {
			console.error(e);
			return { status: "error", data: "fetch error" };
		}
	},
	post: async (
		path: string,
		body: any,
		token?: string,
		type: RequestType | undefined = "client"
	): Promise<ClientResponse> => mutation("POST", path, body, token, type),
	put: async (
		path: string,
		body: any,
		token?: string,
		type: RequestType | undefined = "client"
	): Promise<ClientResponse> => mutation("PUT", path, body, token, type),
	delete: async (
		path: string,
		body: any,
		token?: string,
		type: RequestType | undefined = "client"
	): Promise<ClientResponse> => mutation("DELETE", path, body, token, type),
};

async function mutation(
	method = "POST",
	path: string,
	body: any,
	token?: string,
	type: RequestType = "client"
): Promise<ClientResponse> {
	const url = baseUrlMap[type] + path;
	try {
		const headers: HeadersInit = { "Content-Type": "application/json" };
		if (token) headers.Authorization = `Bearer ${token}`;

		const res = await fetch(url, {
			method,
			body: JSON.stringify(body),
			headers,
		});

		return await handleResponse(res);
	} catch (e) {
		console.error(e);
		return { status: "error", data: "fetch error" };
	}
}

async function handleResponse(res: Response): Promise<ClientResponse> {
	const data = await res.json();
	if (!res.ok) {
		return { status: "error", data: data.detail ?? "error" };
	}
	return { status: "success", data };
}

type SuccessResponse = { status: "success"; data: any };
type ErrorResponse = { status: "error"; data: any };
type ClientResponse = SuccessResponse | ErrorResponse;
