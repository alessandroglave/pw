import { useCallback, useState } from "react";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useToast } from "@/components/ui/useToast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { roomTypes } from "../constants";
import { RoomPayload } from "@/types";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { createRoom } from "../mutations";

type CreateRoomT = {
	room_number: number;
	name: string | undefined;
	room_type: string | undefined;
	price_per_night: number;
	capacity: number;
};
export function CreateRoomDialog({ refetch, close }: any) {
	//	const { mutateAsync: createClosing, isPending } = useCreateClosing();
	const [isLoading, setIsLoading] = useState(false);
	const { data: session } = useSession({ required: true });

	const { toast } = useToast();

	const [state, setState] = useState<CreateRoomT>({
		room_number: 101,
		name: undefined,
		room_type: "Single",
		price_per_night: 100,
		capacity: 1,
	});

	const onNumberChange = useCallback((e) => {
		e.preventDefault();
		setState((prev) => ({
			...prev,
			[e.currentTarget.name]: e.currentTarget.valueAsNumber,
		}));
	}, []);

	const onFieldChange = useCallback((e) => {
		e.preventDefault();
		setState((prev) => ({
			...prev,
			[e.currentTarget.name]: e.currentTarget.value,
		}));
	}, []);

	const onSelectChange = useCallback((value: string) => {
		setState((prev) => ({ ...prev, room_type: value }));
	}, []);

	const handleSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			setIsLoading(true);

			const payload: RoomPayload = {
				name: state.name ?? "",
				price_per_night: state.price_per_night,
				capacity: state.capacity ?? 1,
				room_number: state.room_number ?? null,
				room_type: state.room_type ?? null,
			};
			const data = await createRoom(payload, session?.user?.access_token ?? "");
			if (data?.id) {
				toast({ title: "Camera creata.", variant: "success" });
			} else {
				toast({
					title: "Si è verificato un errore, la camera non è stata creata.",
					variant: "destructive",
				});
			}
			close();
			setIsLoading(false);
			refetch();
		},
		[
			close,
			refetch,
			session?.user?.access_token,
			state.capacity,
			state.name,
			state.price_per_night,
			state.room_number,
			state.room_type,
			toast,
		]
	);

	return (
		<Dialog open={true} onOpenChange={close}>
			{/* DialogTitle is used by screen readers */}
			<DialogTitle>Crea una nuova camera</DialogTitle>
			<DialogContent>
				<h2 className="text-xl font-medium text-slate-800 pb-1">
					Crea una nuova camera
				</h2>
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 gap-6">
						<div className="grid grid-cols-1 gap-2">
							<div>
								<Label htmlFor="room_number">Numero camera</Label>
								<Input
									id="room_number"
									name="room_number"
									type="number"
									value={state.room_number}
									onChange={onNumberChange}
									placeholder="es. 101"
									required
								/>
							</div>
							<div>
								<Label htmlFor="name">Nome camera</Label>
								<Input
									id="name"
									name="name"
									type="text"
									value={state.name}
									onChange={onFieldChange}
									placeholder="es. Camera con vista"
								/>
							</div>
							<div>
								<Label htmlFor="roomType">Tipologia camera</Label>
								<Select
									onValueChange={onSelectChange}
									defaultValue={state.room_type}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Tipologia camera" />
									</SelectTrigger>
									<SelectContent>
										{Object.keys(roomTypes).map((key) => (
											<SelectItem value={key} key={key}>
												{roomTypes[key]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="price_per_night">Prezzo per notte</Label>
								<Input
									id="price_per_night"
									name="price_per_night"
									type="number"
									step={0.05}
									min={0}
									value={state.price_per_night}
									onChange={onNumberChange}
									placeholder="es. 80"
									required
								/>
							</div>
							<div>
								<Label htmlFor="capacity">Capacità</Label>
								<Input
									id="capacity"
									name="capacity"
									type="number"
									min={0}
									max={8}
									value={state.capacity}
									onChange={onNumberChange}
									placeholder="2"
									required
								/>
							</div>
						</div>
						<Button
							onClick={handleSubmit}
							{...(isLoading && {
								disabled: true,
							})}
						>
							{isLoading ? "Salvataggio in corso..." : "Salva"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
