import { PropsWithChildren } from "react";
import styles from "./imageCard.module.css";
import Link from "next/link";

export default function ImageCard({
	children,
	imageUrl,
	url,
	className,
}: PropsWithChildren<{
	url: string;
	imageUrl: string;
	className?: string;
}>) {
	return (
		<div
			className={`${styles.card} ${className ?? ""}`}
			style={{ backgroundImage: `url(${imageUrl})` }}
		>
			<Link
				href={url}
				className="z-10 flex items-center justify-center w-full h-full"
			>
				{children}
			</Link>
		</div>
	);
}
