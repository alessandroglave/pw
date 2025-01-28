export interface ContainerI {
	type?: "default" | "small";
	className?: string;
}

const Container = ({
	children,
	className,
	type = "default",
}: React.PropsWithChildren<ContainerI>) => {
	return (
		<div
			className={`w-full mx-auto ${
				type === "default" ? "max-w-screen-xl" : "max-w-screen-md"
			} px-4 ${className ?? ""}`}
		>
			{children}
		</div>
	);
};

export default Container;
