import Container from "../container";
import { cn } from "@/utils/cn";
import designTokens from "../designTokens";
import { useNavbarItems } from "./navbar/navbar";
import Link from "next/link";
import { address, footerDisclaimer, phone, phoneLabel } from "@/config";

export default function Footer() {
	const links = useNavbarItems();
	return (
		<footer
			role="contentinfo"
			className="mt-5 py-8 w-full bg-slate-50/50 border border-t-slate-200"
		>
			<Container>
				<div className="grid md:grid-cols-2">
					<div className="flex flex-col gap-2 justify-start items-start">
						<h5>Contattaci</h5>
						<a href={`tel:${phone}`} className="hover:opacity-80">
							{phoneLabel}
						</a>
						<p
							className={cn(
								designTokens.color["body-lighter"],
								designTokens.text.alternate
							)}
						>
							{address}
						</p>
					</div>
					<div className="grid gap-2">
						<h5>Navigazione</h5>
						<nav>
							<ul role="menubar">
								{links.map(({ href, label }) => (
									<Link
										key={href}
										role="menuitem"
										href={href}
										className="block hover:opacity-90"
									>
										{label}
									</Link>
								))}
							</ul>
						</nav>
					</div>
				</div>
				<SubFooter />
			</Container>
		</footer>
	);
}

function SubFooter() {
	return (
		<div
			className={cn(
				"border-t",
				designTokens.borderColor.default,
				"mt-8 py-4 w-full grid"
			)}
		>
			<span
				className={cn(
					designTokens.text.caption,
					designTokens.color["body-light"]
				)}
			>
				{footerDisclaimer}
			</span>
		</div>
	);
}
