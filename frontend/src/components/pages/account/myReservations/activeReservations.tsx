import { Button } from "@/components/ui/button";
import designTokens from "@/components/ui/designTokens";
import { useConfirm } from "@/components/ui/hooks/useConfirm";
import EditReservationForm from "@/domain/reservation/components/editReservationForm";
import {
  useDeleteReservation,
  useEditReservation,
} from "@/domain/reservation/mutations";
import { EditReservationArgs, Reservation, ReservationDisplay } from "@/types";
import { cn } from "@/utils/cn";
import { formatReservationDataToDisplay } from "@/domain/reservation/functions";
import { useState } from "react";
import { LoaderOverlay } from "@/components/ui/loader";
import { useToast } from "@/components/ui/useToast";
import { getRoomTypeLabel } from "@/domain/room/functions";
import { useMyReservationsCtx } from "./myreservations.provider";

export default function ActiveReservations({ data }: { data: Reservation[] }) {
  return (
    <div>
      <h3 className="mb-4">Prossime prenotazioni</h3>
      <div>
        <ul className="grid gap-4">
          {data.map((reservation) => (
            <UserActiveReservation
              // using the following string as the key, once the reservation is changed the old component will be unmounted
              // and mounted the new one (resetting so, for example, the UserActiveReservation component internal state, like the "isEditing" variable)
              key={`${reservation.id}_${reservation.check_in_date}_${reservation.check_out_date}_${reservation.room}_${reservation.persons}`}
              reservation={reservation}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function UserActiveReservation({ reservation }: { reservation: Reservation }) {
  const { refetch } = useMyReservationsCtx();
  const [isEditing, setIsEditing] = useState(false);
  const formattedReservation: ReservationDisplay =
    formatReservationDataToDisplay(reservation);

  const { toast } = useToast();

  const { mutateAsync: editReservation, isPending: isEditPending } =
    useEditReservation();

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
    message: "La tua prenotazione verrà eliminata.",
    onConfirm: deleteHandler,
  });

  const handleDelete = async () => {
    showDeleteDialog();
  };

  const editAction = async (args: EditReservationArgs) => {
    const res = await editReservation(args);
    setIsEditing(false);
    if (res?.id) {
      toast({
        title: "Prenotazione modificata",
        variant: "success",
      });
    } else {
      toast({
        title:
          "Si è verificato un errore, la tua prenotazione non è stata modificata",
        variant: "destructive",
      });
    }
    refetch();
  };

  return (
    <>
      <li
        className={cn(
          "py-2 border-4 border-blue-200 bg-blue-50/40 rounded-xl px-4 py-4 hover:bg-blue-50",
          designTokens.color.body,
          designTokens.text.alternate,
          "w-full relative"
        )}
      >
        {isEditPending && <LoaderOverlay />}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <Recap reservation={formattedReservation} />

          <div className="flex gap-2 mt-2 flex flex-col md:flex-row w-full md:w-auto">
            <Button
              className="w-full flex"
              variant="default"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "Annulla modifica" : "Modifica"}
            </Button>
            <Button
              className="w-full flex"
              variant="destructive"
              onClick={handleDelete}
            >
              Elimina
            </Button>
          </div>
        </div>
        {isEditing && (
          <EditReservationForm
            reservation={reservation}
            editAction={editAction}
          />
        )}
      </li>
      <DeleteDialog />
    </>
  );
}

function Recap({ reservation }: { reservation: ReservationDisplay }) {
  return (
    <div className="flex w-full gap-2 flex-col">
      <div>
        <strong>ID prenotazione:</strong> {reservation.id}
      </div>

      <div className="flex gap-1 flex-col">
        {reservation.room_type && (
          <div>
            <strong>{getRoomTypeLabel(reservation.room_type)}</strong>
          </div>
        )}
        <div>
          <strong>Check-in:</strong> {reservation.check_in_date}
        </div>
        <div>
          <strong>Check-out:</strong> {reservation.check_out_date}
        </div>
        <div>
          <strong>Persone:</strong> {reservation.persons}
        </div>
        <div>
          <strong>Costo Totale:</strong> {reservation.total}
        </div>
      </div>
    </div>
  );
}
