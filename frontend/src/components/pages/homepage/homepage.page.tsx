import Layout from "@/components/ui/theme/layout";
import SearchAvailabilityForm from "@/domain/search-availability/components/searchAvailabilityForm";
import Container from "@/components/ui/container";
import { cn } from "@/utils/cn";
import designTokens from "@/components/ui/designTokens";
import ImageCard from "@/components/ui/imageCard/imageCard";
import SEO from "@/libs/seo/seo";

export default function Homepage() {
	return (
		<>
			<SEO appendSiteName={false} />
			<Layout>
				<div
					className="w-full flex items-center justify-center bg-cover bg-center min-h-[450px]"
					style={{ backgroundImage: `url(/hp-hero.jpg)` }}
				/>
				<Container>
					<div className="py-12">
						<SearchAvailabilityForm layout="cols" />
						<div className="grid md:grid-cols-2 gap-4 mt-12">
							<ImageCard imageUrl="/mocks/horizontal-01.jpg" url="/camere">
								<span className={cn("text-white", designTokens.text.h2)}>
									Scopri le nostre camere
								</span>
							</ImageCard>
							<ImageCard
								imageUrl="/mocks/vertical-01.jpg"
								url="/ricerca-disponibilita"
							>
								<span className={cn("text-white", designTokens.text.h2)}>
									Prenota il tuo soggiorno
								</span>
							</ImageCard>
						</div>
					</div>
				</Container>
			</Layout>
		</>
	);
}
