import Label from "@/components/ui/label";
import Input from "@/components/ui/input";
import { ChangeEvent, useMemo, useState } from "react";
import { signup } from "@/domain/auth/mutations";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import designTokens from "@/components/ui/designTokens";
import { useToast } from "@/components/ui/useToast";

/**
 * Form configuration object, used to display
 * dynamically the input fields.
 * The `signupOnly` field valued at `true` indicates the fields to be displayed
 * in the signup form only
 * */
const formConfig = [
	{ name: "email", label: "Email", type: "email", signupOnly: false },
	{ name: "password", label: "Password", type: "password", signupOnly: false },
	{ name: "first_name", label: "Nome", type: "text", signupOnly: true },
	{ name: "last_name", label: "Cognome", type: "text", signupOnly: true },
	{
		name: "phone_number",
		label: "Recapito telefonico",
		type: "phone",
		signupOnly: true,
	},
] as const;

// helper function to return the form configuration based on the selected type
const getFormConfig = (type: FormType) =>
	type === "signin" ? formConfig.filter((c) => !c.signupOnly) : formConfig;

type StateT = { [key in (typeof formConfig)[number]["name"]]: string };

// function to create initial form state based on type (authentication/registration)
function buildDefaultState(type: FormType) {
	const config =
		type === "signin" ? formConfig.filter((c) => !c.signupOnly) : formConfig;
	const defaultState: StateT = config.reduce(
		(prev, cur) => ({ ...prev, [cur.name]: "" }),
		{} as StateT
	);
	return defaultState;
}

// custom hook containing the functions used in the React component below
function useForm(type: FormType, redirectAfterSignIn = false) {
	const { toast } = useToast();

	const [formType, setFormType] = useState<FormType>(type);
	const router = useRouter();
	const [state, setState] = useState<StateT>(buildDefaultState(formType));

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (formType === "signup") {
			const sign = await signup({ ...state });

			if (sign.status === "error") {
				toast({
					title: "Si è verificato un errore, il tuo account non è stato creato",
					variant: "destructive",
				});
				return;
			}
		}

		// login with next-auth using the custom “credentials” provider created
		// that will make a post call to the API backend login endpoint
		// with the email and password entered by the user
		signIn("credentials", {
			email: state.email,
			password: state.password,
			redirect: false,
		}).then((resp) => {
			if (resp?.error) {
				toast({
					title: "Utente o password non corretti.",
					variant: "destructive",
				});
			} else {
				if (redirectAfterSignIn) {
					router.push("/");
				}
			}
		});
	};

	// TODO: add proper validation.
	// This function checks if all fields have at least one character
	const isSubmitDisabled = useMemo(() => {
		const fieldsToCheck =
			formType === "signup"
				? formConfig.map((fc) => fc.name)
				: formConfig.filter((c) => !c.signupOnly).map((fc) => fc.name);
		return fieldsToCheck.map((key) => !state[key]).filter(Boolean).length > 0;
	}, [formType, state]);

	return {
		state,
		onChange,
		onSubmit,
		isSubmitDisabled,
		formType,
		toggleFormType: () =>
			setFormType((prev) => (prev === "signin" ? "signup" : "signin")),
	};
}

type FormType = "signup" | "signin";

export function AuthForm({
	type,
	redirectAfterSignIn = false,
}: {
	type: FormType;
	redirectAfterSignIn?: boolean;
}) {
	const {
		toggleFormType,
		formType,
		state,
		onChange,
		onSubmit,
		isSubmitDisabled,
	} = useForm(type, redirectAfterSignIn);

	const inputs = getFormConfig(formType);

	return (
		<form onSubmit={onSubmit}>
			<div className="grid gap-4 max-w-xl mx-auto">
				<h2 className="mb-3">{texts[formType].title}</h2>
				{inputs.map((block) => (
					<div key={block.name}>
						<Label htmlFor={block.name} aria-label={block.name}>
							{block.label}
						</Label>
						<Input
							name={block.name}
							type={block.type}
							onChange={onChange}
							value={state[block.name]}
						/>
					</div>
				))}
				<div>
					<Input
						name="submit"
						type="submit"
						value={texts[formType].btn}
						className={cn(buttonVariants({ variant: "default" }))}
						disabled={isSubmitDisabled}
						aria-disabled={isSubmitDisabled}
					/>
				</div>
				<div className="mt-1">
					<span className={designTokens.text.caption}>
						{texts[formType].footer}
					</span>
					<Button asChild onClick={toggleFormType} variant="link">
						<a href="#">{texts[formType].footerBtn}</a>
					</Button>
					{formType === "signin" && (
						<div>
							<Button asChild variant="link" className="px-0 opacity-80">
								<a href="/reset-password">Hai dimenticato la password?</a>
							</Button>
						</div>
					)}
				</div>
			</div>
		</form>
	);
}

// object containing the form texts sorted by formType
// To avoid conditions such as: <h2>{formType === "signup" ? "Crea un account" : "Login"}</h2>
const texts = {
	signin: {
		title: "Accedi al tuo account",
		btn: "Accedi",
		footer: "Non hai un account?",
		footerBtn: "Registrati",
	},
	signup: {
		title: "Crea un account",
		btn: "Registrati",
		footer: "Hai già un account?",
		footerBtn: "Accedi",
	},
};
