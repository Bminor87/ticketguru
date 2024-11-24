import { useRef, useEffect } from "react";

export default function BarcodeInput({
  barcode,
  handleChange,
  handleKeyPress,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="mt-5 sm:flex sm:items-center">
      <label htmlFor="barcode" className="sr-only">
        Barcode
      </label>
      <input
        ref={inputRef}
        id="barcode"
        type="text"
        placeholder="Enter/Read ticket number here"
        value={barcode}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        autoFocus
        className="block w-full pl-4 rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:max-w-xs"
      />
    </div>
  );
}
