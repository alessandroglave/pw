const designTokens = {
	color: {
		title: "text-slate-900",
		body: "text-slate-800",
		"body-light": "text-slate-700",
		"body-lighter": "text-slate-500",
		slate: "text-slate",
		caption: "text-slate-400",
		white: "text-white",
		danger: "text-red-600",
	},
	text: {
		h1: "text-3xl lg:text-4xl",
		h2: "text-2.5xl lg:text-3.5xl",
		h3: "text-2xl",
		h4: "text-1.5xl lg:text-2xl",
		h5: "text-xl lg:text-1.5xl",
		h6: "text-lg lg:text-1.5xl",
		h7: "text-lg lg:text-xl leading-tight",
		h8: "text-base lg:text-lg",
		body: "text-base lg:text-lg",
		alternate: "text-sm lg:text-md",
		caption: "text-xs lg:text-sm",
		sectionTitle: "text-md lg:text-xl",
	},
	weight: {
		light: "font-light",
		normal: "font-normal",
		medium: "font-medium",
		semibold: "font-semibold",
		bold: "font-bold",
	},
	background: {
		white: "bg-white",
		light: "bg-background-light",
		section: "bg-background-light",
	},
	borderColor: {
		default: "border-slate-200",
	},
	rounded: {
		card: "rounded-xl",
	},
} as const;
export default designTokens;
