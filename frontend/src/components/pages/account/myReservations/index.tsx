import Loader from "@/components/ui/loader";

import ActiveReservations from "./activeReservations";
import PastReservations from "./pastReservations";
import { MyReservationsProvider, useMyReservationsCtx } from "./myreservations.provider";

export default function MyReservations() {
  return (
    <MyReservationsProvider>
      <div className="py-12">
        <MyReservationsContent />
      </div>
    </MyReservationsProvider>
  );
}

function MyReservationsContent() {
  const { data: reservations, isLoading } = useMyReservationsCtx();

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader />
      </div>
    );
  }

  if (
    !reservations ||
    (reservations.active.length === 0 && reservations.past.length === 0)
  ) {
    return <h3>Non sono presenti prenotazioni</h3>;
  }

  return (
    <div className="w-full grid gap-4">
      {reservations.active.length > 0 && (
        <ActiveReservations data={reservations.active} />
      )}
      {reservations.past.length > 0 && (
        <PastReservations data={reservations.past} />
      )}
    </div>
  );
}
