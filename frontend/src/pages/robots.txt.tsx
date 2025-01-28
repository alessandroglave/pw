export default function Robots() {
	return null;
}

/**
 * This function returns a `robots.txt` text file.
 * If ALLOW_INDEXING variable value is set to "true", it allows indexing.
 */
export async function getServerSideProps({ res }) {
	const content =
		process.env.ALLOW_INDEXING == "true" ? config.allow : config.disallow;
	res.setHeader("Content-Type", "text/plain");
	res.write(content);
	res.end();
	return { props: {} };
}

const config = {
	allow: `User-agent: *
Disallow`,
	disallow: `User-agent: *
Disallow: /`,
};
