"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import menuJson from "./menu.json"; // Import JSON file
import { iconMap } from "./util/componentMap"; // Map icon names to components dynamically
import { Link, Outlet } from "react-router-dom"; // Import Link for navigation

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = menuJson.menu.map((section) => ({
    title: section.title,
    items: section.sections.flat(),
  }));

  return (
    <>
      <div>
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
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>

              {/* Sidebar Content */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                <div className="flex h-16 shrink-0 items-center">
                  <Link to="/" onClick={() => setSidebarOpen(false)}>
                    <img
                      alt="Your Company"
                      src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                      className="h-8 w-auto"
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
                            return (
                              <li key={item.name}>
                                <Link
                                  to={item.href} // Use Link for navigation
                                  onClick={() => setSidebarOpen(false)} // Close menu on click
                                  className={classNames(
                                    item.current
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
              <Link to="/">
                <img
                  alt="Your Company"
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
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
                        return (
                          <li key={item.name}>
                            <Link
                              to={item.href} // Use Link for navigation
                              className={classNames(
                                item.current
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
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form action="#" method="GET" className="relative flex flex-1">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                />
                <input
                  id="search-field"
                  name="search"
                  type="search"
                  placeholder="Search..."
                  className="block size-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                />
              </form>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <Outlet />
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
