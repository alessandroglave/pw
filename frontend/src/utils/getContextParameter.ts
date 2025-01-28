import { GetServerSidePropsContext } from "next";

/**
 * @desc Extracts a query parameter value from ssr context.
 * If multiple parameters with same key are provided,
 * return only the first value
 * @returns string | null
 */
export function getContextParameter(
	key: string,
	context: GetServerSidePropsContext,
	decodeUriComponent = false
) {
	let param = context?.query?.[key];
	if (!param) {
		return null;
	}
	if (Array.isArray(param)) {
		param = param?.[0];
	}

	if (decodeUriComponent) {
		param = decodeURIComponent(param);
	}
	return param;
}
