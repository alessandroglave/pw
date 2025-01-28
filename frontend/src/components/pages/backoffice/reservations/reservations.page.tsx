import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DatePicker } from "@/components/ui/datepicker";
import { useConfirm } from "@/components/ui/hooks/useConfirm";
import Label from "@/components/ui/label";
import Loader from "@/components/ui/loader";
import BackofficeLayout from "@/components/ui/theme/backofficeLayout";
import { toast } from "@/components/ui/useToast";
import {
	presentationDateFormat,
	presentationShortDateFormat,
} from "@/constants";
import { useDeleteReservation } from "@/domain/reservation/mutations";
import { useBackofficeReservations } from "@/domain/reservation/queries";
import { Reservation } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { useState } from "react";
import {
	ReservationsProvider,
	useReservationsCtx,
} from "./reservations.provider";
import { CreateReservationAdminDialog } from "@/domain/reservation/components/createReservationAdminDialog";
import { cn } from "@/utils/cn";
import designTokens from "@/components/ui/designTokens";
import { getRoomName } from "@/domain/reservation/functions";

export default function Reservations() {
	return (
		<BackofficeLayout>
			<ReservationsProvider>
				<div className="grid gap-2">
					<HeaderSection />
					<ListSection />
				</div>
			</ReservationsProvider>
		</BackofficeLayout>
	);
}
function HeaderSection() {
	const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
	const { refetch } = useReservationsCtx();

	return (
		<>
			<div className="flex flex-col lg:flex-row gap-2 lg:justify-between lg:items-center mb-2">
				<div>
					<h3 className="mt-4">Prenotazioni</h3>
				</div>
				<div>
					<Button onClick={() => setShowCreateDialog(true)}>
						Nuova prenotazione
					</Button>
				</div>
			</div>
			{showCreateDialog && (
				<CreateReservationAdminDialog
					close={() => setShowCreateDialog(false)}
					refetch={refetch}
				/>
			)}
		</>
	);
}
function ListSection() {
	const { dateToCheck, setDateToCheck } = useReservationsCtx();

	return (
		<div className="grid lg:grid-cols-12 gap-2">
			<div className="lg:col-span-4">
				<Label>Filtra per data</Label>
				<DatePicker date={dateToCheck} setDate={setDateToCheck} />
				<span className="text-sm block mt-2">
					Selezionando un giorno sul calendario, verranno ricercati tutte le
					prenotazioni nella data selezionata.
				</span>
			</div>
			<div className="lg:col-span-8 pt-4">
				<ReservationsSection date={dateToCheck} />
			</div>
		</div>
	);
}

function ReservationsSection({ date }: { date: Date | undefined }) {
	const { dateToCheck, data, isLoading, refetch } = useReservationsCtx();

	const formattedDate = dateToCheck
		? formatDate(dateToCheck.toString(), presentationDateFormat)
		: null;
	return (
		<>
			{isLoading && (
				<div className="flex justify-center">
					<Loader />
				</div>
			)}
			{!isLoading && !data && <div />}
			{!isLoading && data && !data.length && (
				<div>Nessuna prenotazione presente per il giorno {formattedDate}</div>
			)}
			{!isLoading && data && data.length > 0 && (
				<>
					<h4>Risultati per il giorno {formattedDate}:</h4>
					<ul className="grid gap-1.5 mt-4">
						{data.map((reservation) => (
							<Row
								reservation={reservation}
								refetch={refetch}
								key={`reservation_${reservation.id}`}
							/>
						))}
					</ul>
				</>
			)}
		</>
	);
}

function Row({
	refetch,
	reservation,
}: {
	refetch: any;
	reservation: Reservation;
}) {
	const { mutateAsync: deleteReservation } = useDeleteReservation();

	const deleteHandler = async () => {
		const res = await deleteReservation(reservation.id);
		if (res?.deleted) {
			toast({
				title: "Prenotazione eliminata",
				variant: "success",
			});
		} else {
			toast({
				title:
					"Si è verificato un errore, la prenotazione non è stata eliminata",
				variant: "destructive",
			});
		}
		refetch();
	};

	const [DeleteDialog, showDeleteDialog] = useConfirm({
		title: "Sei sicuro?",
		message: "La prenotazione verrà eliminata.",
		onConfirm: deleteHandler,
	});

	const handleDelete = async () => {
		showDeleteDialog();
	};

	return (
		<>
			<div className="rounded-xl bg-slate-50 p-4 mb-2 flex flex-col lg:flex-row gap-2 lg:justify-between lg:items-center">
				<div className="grid lg:grid-cols-2 w-full">
					<p className="flex flex-col">
						<strong
							className={cn(
								designTokens.color.body,
								designTokens.text.sectionTitle
							)}
						>
							ID: #{reservation.id}
						</strong>
						<strong
							className={cn(
								designTokens.color["body-light"],
								designTokens.text.body
							)}
						>
							{getRoomName(reservation.room)}
						</strong>
					</p>
					<p
						className={cn(
							"flex flex-col lg:justify-end w-full",
							designTokens.color["body-light"],
							designTokens.text.alternate
						)}
					>
						Check-in:{" "}
						{formatDate(reservation.check_in_date, presentationShortDateFormat)}{" "}
						<br />
						Check-out:{" "}
						{formatDate(
							reservation.check_out_date,
							presentationShortDateFormat
						)}
					</p>

					<div
						className={cn(
							"lg:col-span-2 mt-2",
							designTokens.color["body-lighter"],
							designTokens.text.alternate
						)}
					>
						{reservation.guest.personal_info.first_name}{" "}
						{reservation.guest.personal_info.last_name}
						<br />
						{reservation.guest.personal_info.email},{" "}
						{reservation.guest.personal_info.phone_number ?? ""}
					</div>
				</div>
				<Button variant="destructive" onClick={handleDelete}>
					Elimina
				</Button>
			</div>
			<DeleteDialog />
		</>
	);
}
