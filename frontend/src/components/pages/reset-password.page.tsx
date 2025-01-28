import { useState } from "react";
import Container from "../ui/container";
import Input from "../ui/input";
import Label from "../ui/label";
import Layout from "../ui/theme/layout";
import { resetPassword } from "@/domain/auth/mutations";
import { useToast } from "@/components/ui/useToast";
import { LoaderOverlay } from "../ui/loader";
import { useRouter } from "next/router";
import { Button } from "../ui/button";

export default function ResetPassword() {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");

	const router = useRouter();
	const { toast } = useToast();

	const onSubmit = async (e) => {
		e.preventDefault();

		if (!email) {
			toast({
				title: "Inserisci una mail valida",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);
		const res = await resetPassword({ email });

		if (res) {
			toast({
				title: "Password modificata",
				variant: "success",
			});
			router.push("/login");
			setIsLoading(false);
		} else {
			toast({
				title: "Si è verificato un errore, la password non è stata modificata",
				variant: "destructive",
			});
			setIsLoading(false);
		}
	};

	return (
		<>
			<Layout>
				<Container type="small">
					{isLoading && <LoaderOverlay />}

					<h1>Resetta la tua password</h1>
					<p className="mt-2">
						Inserisci la tua email.
						<br />
						Ti invieremo un messaggio contenente la tua nuova password.
					</p>
					<div>
						<form onSubmit={onSubmit} className="mt-6 grid gap-2">
							<Label htmlFor="email">La tua email</Label>
							<Input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.currentTarget.value)}
							/>
							<div className="mt-2">
								<Button type="submit">Resetta la tua password</Button>
							</div>
						</form>
					</div>
				</Container>
			</Layout>
		</>
	);
}
