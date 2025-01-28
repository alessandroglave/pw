import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { LoaderOverlay } from "../loader";

type Props = {
	title: string;
	message: string;
	onConfirm: () => Promise<unknown>;
	onAbort?: () => Promise<unknown>;
};

export const useConfirm = ({
	title,
	message,
	onConfirm,
	onAbort,
}: Props): [() => JSX.Element, () => void] => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const open = () => {
		setIsOpen(true);
		setIsLoading(false);
	};

	const close = () => {
		setIsOpen(false);
		setIsLoading(false);
	};

	const onHandleConfirm = async () => {
		setIsLoading(true);
		await onConfirm();
		setIsLoading(false);
		close();
	};

	const onHandleCancel = async () => {
		if (onAbort) {
			setIsLoading(true);
			await onAbort();
		}
		close();
	};

	const ConfirmationDialog = () => {
		return (
			<Dialog open={isOpen} onOpenChange={close}>
				<DialogContent>
					{isLoading && <LoaderOverlay />}
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{message}</DialogDescription>
					</DialogHeader>
					<DialogFooter className="pt-2">
						<Button onClick={onHandleCancel} variant="outline">
							Annulla
						</Button>
						<Button onClick={onHandleConfirm}>Conferma</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	};

	return [ConfirmationDialog, open];
};
