import Layout from "../ui/theme/layout";
import Container from "../ui/container";
import { AuthForm } from "@/domain/auth/components/authForm";
import SEO from "@/libs/seo/seo";

export default function Login() {
	return (
		<>
			<SEO
				title="Accedi"
				description="Accedi all'area riservata per poter gestire i tuoi soggiorni."
			/>
			<Layout>
				<Container>
					<AuthForm type="signin" redirectAfterSignIn />
				</Container>
			</Layout>
		</>
	);
}
