import Layout from "../ui/theme/layout";
import Container from "../ui/container";
import { AuthForm } from "@/domain/auth/components/authForm";
import SEO from "@/libs/seo/seo";

export default function Signup() {
	return (
		<>
			<SEO
				title="Registrati"
				description="Crea un account per prenotare il tuo soggiorno."
			/>
			<Layout>
				<Container>
					<AuthForm type="signup" redirectAfterSignIn />
				</Container>
			</Layout>
		</>
	);
}
