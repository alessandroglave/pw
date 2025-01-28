import { useCallback, useState } from "react";
import { DatePicker } from "@/components/ui/datepicker";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useToast } from "@/components/ui/useToast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCreateClosing } from "../mutations";
import { formatDate } from "@/utils/formatDate";
import { backendDateFormat } from "@/constants";
import { CreateClosingPayload } from "@/types";

export function CreateClosingDialog({ refetch, close }: any) {
	const { mutateAsync: createClosing, isPending } = useCreateClosing();

	const { toast } = useToast();

	const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
	const [toDate, setToDate] = useState<Date | undefined>(new Date());
	const [reason, setReason] = useState<string>("");

	const handleReason = useCallback((e) => {
		e.preventDefault();
		setReason((prev) => e.currentTarget.value);
	}, []);

	const handleSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			if (!fromDate || !toDate) return;

			const payload: CreateClosingPayload = {
				from_date: formatDate(fromDate?.toString(), backendDateFormat),
				to_date: formatDate(toDate?.toString(), backendDateFormat),
				reason,
			};
			const data = await createClosing(payload);
			if (data?.id) {
				toast({ title: "Giorni di chisura creati", variant: "success" });
			} else {
				toast({
					title:
						"Si è verificato un errore, i giorni di chisura non sono stati creati",
					variant: "destructive",
				});
			}
			close();
			refetch();
		},
		[close, createClosing, fromDate, reason, refetch, toDate, toast]
	);

	return (
		<Dialog open={true} onOpenChange={close}>
			{/* DialogTitle is used by screen readers */}
			<DialogTitle>Crea un nuovo periodo di chiusura</DialogTitle>
			<DialogContent>
				<h2 className="text-xl font-medium text-slate-800 pb-1">
					Crea un nuovo periodo di chiusura
				</h2>
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 gap-4">
						<div className="grid grid-cols-1 gap-1.5">
							<Label htmlFor="fromDate">Da</Label>
							<DatePicker date={fromDate} setDate={setFromDate} />
						</div>
						<div className="grid grid-cols-1 gap-1.5">
							<Label htmlFor="toDate">A</Label>
							<DatePicker date={toDate} setDate={setToDate} />
						</div>
						<div className="grid grid-cols-1 gap-1.5">
							<Label htmlFor="reason">Motivazione (facoltativa)</Label>
							<Input
								id="reason"
								name="reason"
								value={reason}
								onChange={handleReason}
								placeholder="es. festività"
							/>
						</div>
						<Button
							onClick={handleSubmit}
							{...(isPending && {
								disabled: true,
							})}
						>
							{isPending ? "Salvataggio in corso..." : "Salva"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
