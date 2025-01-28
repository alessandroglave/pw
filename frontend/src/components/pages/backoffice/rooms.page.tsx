import { Button } from "@/components/ui/button";
import designTokens from "@/components/ui/designTokens";
import { useConfirm } from "@/components/ui/hooks/useConfirm";
import Loader from "@/components/ui/loader";
import BackofficeLayout from "@/components/ui/theme/backofficeLayout";
import { toast } from "@/components/ui/useToast";
import { getRoomName } from "@/domain/reservation/functions";
import { CreateRoomDialog } from "@/domain/room/components/createRoomDialog";
import { getRoomTypeLabel } from "@/domain/room/functions";
import { deleteRoom } from "@/domain/room/mutations";
import { useGetRooms } from "@/domain/room/queries";
import { Room } from "@/types";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/formatPrice";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Rooms() {
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);

  const { data, isLoading, refetch } = useGetRooms("client");

  return (
    <BackofficeLayout>
      <div className="grid gap-2">
        <div className="flex flex-col lg:flex-row gap-2 lg:justify-between lg:items-center mb-2">
          <div>
            <h3 className="mt-4">Camere</h3>
          </div>
          <div>
            <Button onClick={() => setShowCreateDialog(true)}>
              Nuova camera
            </Button>
          </div>
        </div>
        {showCreateDialog && (
          <CreateRoomDialog
            close={() => setShowCreateDialog(false)}
            refetch={refetch}
          />
        )}

        <div className="grid gap-2">
          <div className="pt-4">
            {isLoading && (
              <div className="flex justify-center">
                <Loader />
              </div>
            )}
            {!isLoading && !data && <div />}
            {!isLoading && data && !data.length && (
              <div>Nessuna camera presente</div>
            )}
            {data && data.length > 0 && (
              <>
                <ul className="grid gap-1.5 mt-4">
                  {data.map((room) => (
                    <Row
                      room={room}
                      key={`room_${room.id}`}
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

function Row({ refetch, room }: { refetch: any; room: Room }) {
  const { data: session } = useSession({ required: true });

  const handleDelete = async () => {
    showDeleteDialog();
    const res = await deleteRoom(room.id, session?.user?.access_token ?? "");
    if (res?.deleted) {
      toast({
        title: "Camera eliminata",
        variant: "success",
      });
    } else {
      toast({
        title: "Si è verificato un errore, la camera",
        variant: "destructive",
      });
    }
    refetch();
  };

  const [DeleteDialog, showDeleteDialog] = useConfirm({
    title: `Sei sicuro di voler eliminare la Camera #${room.room_number}?`,
    message: "La camera verrà eliminata.",
    onConfirm: handleDelete,
  });

  return (
    <>
      <div className="pb-2 border-b w-full grid lg:grid-cols-12 gap-2 lg:justify-between lg:items-center">
        <div className="lg:col-span-3">
          <p
            className={cn(
              designTokens.color.body,
              designTokens.text.body,
              "font-semibold"
            )}
          >
            ID: {room.id} - {getRoomName(room)}
          </p>
        </div>
        <div className="lg:col-span-3">
          <p
            className={cn(
              designTokens.color["body-light"],
              designTokens.text.alternate
            )}
          >
            Tipologia {getRoomTypeLabel(room.room_type)}
          </p>
        </div>
        <div className="lg:col-span-2">
          <p
            className={cn(
              designTokens.color["body-light"],
              designTokens.text.alternate
            )}
          >
            Capacità {room.capacity}
          </p>
          <p
            className={cn(
              designTokens.color["body-light"],
              designTokens.text.alternate
            )}
          >
            Costo per notte {formatPrice(room.price_per_night)}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:col-span-4 lg:justify-end">
          <Button variant="destructive" onClick={showDeleteDialog}>
            Elimina
          </Button>
        </div>
      </div>
      <DeleteDialog />
    </>
  );
}
