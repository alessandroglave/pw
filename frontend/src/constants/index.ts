type NavbarItem = {
	label: string;
	href: string;
	className?: string;
};

export const baseNavbarItems: NavbarItem[] = [
	{ label: "Homepage", href: "/" },
	{ label: "Camere", href: "/camere" },
	{ label: "Prenota", href: "/ricerca-disponibilita" },
];

export const notcustomerItems: NavbarItem[] = [
	...baseNavbarItems,
	{
		label: "Login",
		href: "/login",
	},
	{
		label: "Registrati",
		href: "/signup",
		className:
			"block rounded-lg px-3 py-1.5 text-base font-medium leading-7 text-white bg-primary-700 hover:bg-primary-600 lg:flex",
	},
];
export const customerItems: NavbarItem[] = [
	...baseNavbarItems,
	{
		label: "Account",
		href: "/account",
	},
];
export const restrictedNavbarItems: NavbarItem[] = [
	...customerItems,
	{
		label: "Gestione",
		href: "/backoffice",
	},
];

export const backendDateFormat = "yyyy-MM-dd";
export const presentationDateFormat = "EEEE dd MMMM yyyy";
export const presentationShortDateFormat = "dd/MM/yyyy";

export const checkInFrom = "11:00";
export const checkOutFrom = "10:00";
