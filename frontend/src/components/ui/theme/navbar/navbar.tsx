"use client";

import {
  customerItems,
  notcustomerItems,
  restrictedNavbarItems,
} from "@/constants";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { canManage } from "@/domain/auth/functions";

export function useNavbarItems() {
  const { data, status } = useSession();
  if (!data?.user || status !== "authenticated") return notcustomerItems;
  if (canManage(data.user)) return restrictedNavbarItems;
  return customerItems;
}

export default function Navbar() {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const navbarItems = useNavbarItems();

  return (
    <header
      role="banner"
      className="w-full grid grid-cols-12 justify-between items-center p-4"
    >
      <div className="col-span-8 sm:col-span-5 lg:col-span-3">
        <Link href="/">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-full max-w-[200px] h-auto md:w-auto md:h-[50px]"
          />
        </Link>
      </div>

      <div className="flex justify-end col-span-4 sm:col-span-7 lg:hidden">
        <button
          className="navbar-burger flex items-center text-blue-600 p-3 lg:hidden"
          type="button"
          onClick={() => setMobileMenuIsOpen((prev) => !prev)}
        >
          <span className="sr-only">
            {mobileMenuIsOpen ? "close" : "open"} menu
          </span>
          <svg
            className="block h-4 w-4 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Mobile menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </button>
      </div>

      <nav
        role="navigation"
        aria-label="Navigation menu"
        className={`${
          mobileMenuIsOpen
            ? "absolute px-2 top-12 left-0 right-0 bg-white w-full lg:relative lg:top-0 lg:px-0 shadow-md"
            : "hidden"
        } col-span-12 lg:col-span-9 lg:flex lg:w-full lg:items-center lg:gap-3`}
      >
        <ul
          role="menubar"
          className="w-full flex flex-col lg:flex-row lg:gap-3 lg:justify-end lg:items-center"
        >
          {navbarItems.map(({ href, label, className }) => (
            <li key={href} role="none">
              <Link
                href={href}
                role="menuitem"
                className={`${
                  className ??
                  "block rounded-lg px-3 py-1.5 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50 lg:flex"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
