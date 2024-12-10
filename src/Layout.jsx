"use client";

import { useState, useEffect } from "react";
import { useApiService } from "./service/ApiProvider";
import { useSettings } from "./SettingsContext";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  BellIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import menuJson from "./menu.json"; // Import JSON file
import { iconMap } from "./util/componentMap"; // Map icon names to components dynamically
import { Link, Outlet, useLocation } from "react-router-dom"; // Import Link and useLocation for navigation
import DarkModeToggle from "./common/DarkModeToggle";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }) {
  const { logout } = useApiService();

  const { firstName, lastName, role, darkMode } = useSettings();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); // Get the current location

  const [navigation, setNavigation] = useState([]);

  useEffect(() => {
    const filteredMenu = menuJson.menu.map((section) => ({
      title: section.title,
      items: section.sections
        .filter((item) => item.roles?.includes(role))
        .flat(),
    }));

    setNavigation(filteredMenu);
  }, [role]);

  return (
    <>
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>

            {/* Sidebar Content */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <Link
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="text-white text-2xl"
                >
                  <img
                    src="ticketguru-logo-rc2.png"
                    alt="TicketGuru"
                    className="nav-logo"
                  />
                </Link>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  {navigation.map((section) => (
                    <li key={section.title}>
                      <div className="text-xs/6 font-semibold text-gray-400">
                        {section.title}
                      </div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {section.items.map((item) => {
                          const Icon = iconMap[item.icon];
                          const isActive = location.pathname === item.href;
                          return (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={classNames(
                                  isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                )}
                              >
                                {Icon && (
                                  <Icon
                                    aria-hidden="true"
                                    className="size-6 shrink-0"
                                  />
                                )}
                                {item.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link to="/" className="text-white text-2xl">
              <img
                src="ticketguru-logo-rc2.png"
                alt="TicketGuru"
                className="nav-logo"
              />
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              {navigation.map((section) => (
                <li key={section.title}>
                  <div className="text-xs/6 font-semibold text-gray-400">
                    {section.title}
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {section.items.map((item) => {
                      const Icon = iconMap[item.icon];
                      const isActive = location.pathname === item.href;
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className={classNames(
                              isActive
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            )}
                          >
                            {Icon && (
                              <Icon
                                aria-hidden="true"
                                className="size-6 shrink-0"
                              />
                            )}
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-800 bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 dark:text-white lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form
              action="#"
              method="GET"
              className="relative flex flex-1"
            ></form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <DarkModeToggle />

              {/* Separator */}
              <div
                aria-hidden="true"
                className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
              />

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <MenuButton className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full bg-gray-50"
                  />
                  <span className="hidden lg:flex lg:items-center">
                    <span
                      aria-hidden="true"
                      className="ml-4 text-sm/6 font-semibold text-white"
                    >
                      {firstName} {lastName}
                    </span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="ml-2 size-5 text-gray-400"
                    />
                  </span>
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white dark:bg-gray-900 py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem key="profile">
                    <button className="m-4">
                      Role: <span className="text-blue-500">{role}</span>
                    </button>
                  </MenuItem>
                  <MenuItem key="logout">
                    <button
                      onClick={logout}
                      className="block px-3 py-1 text-sm/6 text-gray-900 dark:text-white data-[focus]:bg-gray-50 dark:data-[focus]:bg-gray-600 data-[focus]:outline-none"
                    >
                      Log Out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <main>
          <Outlet />
          {children}
        </main>
      </div>
    </>
  );
}
