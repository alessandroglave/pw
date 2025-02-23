import { User } from "@/types";
import { Roles } from "./constants";

export const isCustomer = (user: User) => user.role === Roles.customer;
export const isStaff = (user: User) => user.role === Roles.staff;
export const isAdmin = (user: User) => user.role === Roles.admin;
export const isManager = (user: User) =>
	[Roles.admin, Roles.staff].includes(user.role as Roles);
