import designTokens from "@/components/ui/designTokens";
import BackofficeLayout from "@/components/ui/theme/backofficeLayout";

import { cn } from "@/utils/cn";
import Link from "next/link";

export default function Backoffice() {
	return (
		<BackofficeLayout>
			<div className="grid gap-4 lg:grid-cols-3 mt-8">
				{links.map(({ href, label }) => (
					<div
						className={cn(
							"rounded-xl flex min-h-[200px] relative w-full overflow-hidden border bg-slate-50 hover:bg-slate-100",
							designTokens.borderColor
						)}
						key={href}
					>
						<Link
							href={href}
							className={cn(
								"p-8 w-full flex items-center justify-center text-primary-900",
								designTokens.text.h3
							)}
						>
							{label}
						</Link>
					</div>
				))}
			</div>
		</BackofficeLayout>
	);
}
const links = [
	{ href: "/backoffice/reservations", label: "Prenotazioni" },
	{ href: "/backoffice/closings", label: "Giorni di chiusura" },
	{ href: "/backoffice/rooms", label: "Camere" },
];
