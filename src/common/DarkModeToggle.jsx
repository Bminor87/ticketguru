import { useSettings } from "../SettingsContext";

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useSettings();

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
    >
      {darkMode ? <span>🌞 Light Mode</span> : <span>🌙 Dark Mode</span>}
    </button>
  );
}
