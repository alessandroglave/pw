import { cn } from "@/utils/cn";
import * as React from "react";
import designTokens from "./designTokens";

// from: https://ui.shadcn.com/docs/components

const Input = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, name, ...props }, ref) => {
	return (
		<>
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-md border  bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					designTokens.color.body,
					designTokens.borderColor,
					"placeholder:text-gray-500",
					className
				)}
				name={name}
				ref={ref}
				{...props}
			/>
		</>
	);
});
Input.displayName = "Input";

export default Input;

export const inputStyle = `flex h-10 w-full rounded-md border  bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${designTokens.color.body} ${designTokens.borderColor} placeholder:text-gray-500`;
