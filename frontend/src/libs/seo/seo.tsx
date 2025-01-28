import {
	defaultFbImage,
	defaultType,
	siteDescription,
	siteName,
} from "@/config";
import Head from "next/head";

interface SEOProps {
	appendSiteName?: boolean;
	title?: string;
	description?: string;
	image?: string;
	imageFb?: string;
	type?: "website" | "article";
	locale?: "it" /* i18n: with more languages, add more locales here
	and handle <link rel="canonical" o "alternate" .. /> tags too. */;
}

/**
 * @desc Component to centralize SEO data display, adding some defaults.
 */
const SEO = ({
	appendSiteName = true,
	title = siteName,
	description = siteDescription,
	image,
	imageFb,
	type = defaultType,
}: SEOProps) => {
	const displayTitle = appendSiteName ? `${title} - ${siteName}` : title;
	return (
		<Head>
			<title>{displayTitle}</title>
			<meta name="description" content={description ?? siteDescription} />

			<meta property="og:title" content={displayTitle} />
			<meta property="og:type" content={type} />
			<meta property="og:image" content={image ?? imageFb ?? defaultFbImage} />

			<meta property="og:description" content={description} />
			<meta property="og:site_name" content={siteName} />
		</Head>
	);
};

export default SEO;
