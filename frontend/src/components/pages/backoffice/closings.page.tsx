import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { useConfirm } from "@/components/ui/hooks/useConfirm";
import Label from "@/components/ui/label";
import Loader from "@/components/ui/loader";
import BackofficeLayout from "@/components/ui/theme/backofficeLayout";
import { toast } from "@/components/ui/useToast";
import {
	backendDateFormat,
	presentationDateFormat,
	presentationShortDateFormat,
} from "@/constants";
import { CreateClosingDialog } from "@/domain/closings/components/createClosingDialog";
import { useDeleteClosing } from "@/domain/closings/mutations";
import { useGetClosings } from "@/domain/closings/queries";
import { Closing } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { useState } from "react";

export default function Closings() {
	const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);

	const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
	const { data, isLoading, refetch } = useGetClosings(
		fromDate ? formatDate(fromDate.toString(), backendDateFormat) : null
	);
	const formattedDate = formatDate(
		fromDate?.toString(),
		presentationDateFormat
	);

	return (
		<BackofficeLayout>
			<div className="grid gap-2">
				<div className="flex flex-col lg:flex-row gap-2 lg:justify-between lg:items-center mb-2">
					<div>
						<h3 className="mt-4">Giorni di chiusura</h3>
					</div>
					<div>
						<Button onClick={() => setShowCreateDialog(true)}>
							Nuovo giorno di chiusura
						</Button>
					</div>
				</div>
				{showCreateDialog && (
					<CreateClosingDialog
						close={() => setShowCreateDialog(false)}
						refetch={refetch}
					/>
				)}

				<div className="grid lg:grid-cols-12 gap-2">
					<div className="lg:col-span-4">
						<Label>Filtra per data</Label>
						<DatePicker date={fromDate} setDate={setFromDate} />
						<span className="text-sm mt-2 block">
							Selezionando un giorno sul calendario, verranno ricercati tutti i
							giorni di chiusura a partire dalla data selezionata.
						</span>
					</div>
					<div className="lg:col-span-8 pt-4">
						{isLoading && (
							<div className="flex justify-center">
								<Loader />
							</div>
						)}
						{!isLoading && !data && <div />}
						{!isLoading && data && !data.length && (
							<div>Nessuna chiusura presente dal giorno {formattedDate}</div>
						)}
						{data && data.length > 0 && (
							<>
								<h4>Risultati dal giorno {formattedDate}:</h4>
								<ul className="grid gap-1.5 mt-4">
									{data.map((closing) => (
										<Row
											closing={closing}
											key={`closing_${closing.id}`}
											refetch={refetch}
										/>
									))}
								</ul>
							</>
						)}
					</div>
				</div>
			</div>
		</BackofficeLayout>
	);
}

function Row({ refetch, closing }: { refetch: any; closing: Closing }) {
	const { mutateAsync: deleteClosing } = useDeleteClosing();

	const deleteHandler = async () => {
		const res = await deleteClosing(closing.id);
		if (res?.deleted) {
			toast({
				title: "Giorni di chiusura eliminati",
				variant: "success",
			});
		} else {
			toast({
				title: "Si è verificato un errore",
				variant: "destructive",
			});
		}
		refetch();
	};

	const [DeleteDialog, showDeleteDialog] = useConfirm({
		title: "Sei sicuro?",
		message: "I giorni di chiusura verranno eliminati.",
		onConfirm: deleteHandler,
	});

	const handleDelete = async () => {
		showDeleteDialog();
	};

	return (
		<>
			<div className="pb-2 border-b flex flex-col lg:flex-row gap-2 lg:justify-between lg:items-center">
				<p className="flex flex-col">
					<span className="block">
						Dal {formatDate(closing.from_date, presentationShortDateFormat)} al{" "}
						{formatDate(closing.to_date, presentationShortDateFormat)}
					</span>
					{closing.reason && (
						<span className="text-sm block">Motivazione: {closing.reason}</span>
					)}
				</p>
				<Button variant="destructive" onClick={handleDelete}>
					Elimina
				</Button>
			</div>
			<DeleteDialog />
		</>
	);
}
