import { cn } from "@/utils/cn";
import * as React from "react";
import designTokens from "./designTokens";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = ({ className, ...props }: LabelProps) => {
	return (
		<label
			className={cn(
				designTokens.color["body-light"],
				designTokens.weight.medium,
				designTokens.text.alternate,
				"flex mb-2",
				className
			)}
			{...props}
		/>
	);
};

export default Label;
