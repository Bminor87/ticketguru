"use client";

import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { iconMap } from "./util/componentMap"; // Map for icons
import { useSettings } from "./SettingsContext"; // Import useSettings hook

import DarkModeToggle from "./common/DarkModeToggle";

import menuJson from "./menu.json";

const Navigation = () => {
  const menu = menuJson.menu;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useSettings(); // Access dark mode state and toggle function

  return (
    <header className="bg-white shadow-md dark:bg-gray-800">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          >
            TicketGuru
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
          >
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-8">
          {menu.map((section) => (
            <DropdownMenu
              key={section.title}
              title={section.title}
              items={section.sections}
            />
          ))}
        </PopoverGroup>

        {/* Dark Mode Toggle */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <MoonIcon className="h-5 w-5" aria-hidden="true" />
            )}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white dark:bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 dark:text-gray-100"
            >
              TicketGuru
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
            >
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {menu.map((section) => (
                  <DisclosureMenu
                    key={section.title}
                    title={section.title}
                    items={section.sections}
                    onLinkClick={() => setMobileMenuOpen(false)}
                  />
                ))}
              </div>
              <div className="py-6">
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

// DropdownMenu for Desktop
const DropdownMenu = ({ title, items }) => (
  <Popover className="relative">
    <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300">
      {title}
      <ChevronDownIcon
        className="h-5 w-5 text-gray-500 dark:text-gray-300"
        aria-hidden="true"
      />
    </PopoverButton>
    <PopoverPanel className="absolute z-10 mt-3 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="p-2">
        {items.map((item) => {
          const Icon = iconMap[item.icon]; // Resolve icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-start p-2 -m-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {Icon && (
                <Icon className="h-5 w-5 flex-shrink-0 text-gray-600 dark:text-gray-300" />
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </PopoverPanel>
  </Popover>
);

const DisclosureMenu = ({ title, items, onLinkClick }) => (
  <Disclosure>
    {({ open }) => (
      <>
        <DisclosureButton className="flex w-full justify-between rounded-lg px-3 py-2 text-base font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">
          {title}
          <ChevronDownIcon
            className={`h-5 w-5 ${
              open ? "rotate-180 transform" : ""
            } text-gray-500 dark:text-gray-300`}
          />
        </DisclosureButton>
        <DisclosurePanel className="mt-2 space-y-1">
          {items.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="block rounded-lg py-2 pl-6 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={onLinkClick}
            >
              {item.name}
            </Link>
          ))}
        </DisclosurePanel>
      </>
    )}
  </Disclosure>
);

export default Navigation;
