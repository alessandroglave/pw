import styles from "./loader.module.css";

export default function Loader() {
	return <div className={styles.loader} />;
}

export function LoaderOverlay() {
	return (
		<div className="absolute inset-0 bg-white/60 flex items-center justify-center">
			<Loader />
		</div>
	);
}
