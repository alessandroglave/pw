import { buttonVariants } from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { cn } from "@/utils/cn";
import { ChangeEvent, useMemo, useState } from "react";

const guestFormConfig = [
	{ name: "first_name", label: "Nome", type: "text" },
	{ name: "last_name", label: "Cognome", type: "text" },
	{ name: "email", label: "Email", type: "email" },
	{
		name: "phone_number",
		label: "Recapito telefonico",
		type: "phone",
	},
] as const;

export type GuestFormStateT = {
	[key in (typeof guestFormConfig)[number]["name"]]: string;
};

const defaultState = guestFormConfig.reduce(
	(prev, cur) => ({ ...prev, [cur.name]: "" }),
	{} as GuestFormStateT
);

function useForm(onSubmit: any) {
	const [state, setState] = useState<GuestFormStateT>(defaultState);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const onFormSubmit = (e) => {
		e.preventDefault();
		onSubmit(state);
	};

	const isSubmitDisabled = useMemo(() => {
		return (
			guestFormConfig.map((key) => !state[key.name]).filter(Boolean).length > 0
		);
	}, [state]);

	return {
		state,
		onChange,
		isSubmitDisabled,
		onFormSubmit,
	};
}

export function GuestForm({ onSubmit }: { onSubmit: any }) {
	const { state, onChange, isSubmitDisabled, onFormSubmit } = useForm(onSubmit);

	return (
		<form onSubmit={onFormSubmit}>
			<div className="grid gap-4 max-w-xl mx-auto">
				<h2 className="mb-3">{`Inserisci i dati dell'ospite`}</h2>
				{guestFormConfig.map((block) => (
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
						value="Prenota"
						className={cn(buttonVariants({ variant: "default" }))}
						disabled={isSubmitDisabled}
						aria-disabled={isSubmitDisabled}
					/>
				</div>
			</div>
		</form>
	);
}
