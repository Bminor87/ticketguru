import { useRef, useEffect } from "react";

export default function BarcodeInput({ barcode, handleChange, handleSubmit }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <form className="mt-5 sm:flex sm:items-center" onSubmit={handleSubmit}>
      <div className="w-full">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          ref={inputRef}
          id="barcode"
          style={{ width: "100%", height: "4.5rem" }}
          value={barcode}
          onChange={handleChange}
          placeholder="Enter/Read ticket number here"
          autoFocus
          className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
        />
      </div>
      <button
        type="submit"
        style={{ height: "4.5rem" }}
        className="mt-3 inline-flex w-full sm:w-2/3 items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
      >
        Fetch Ticket
      </button>
    </form>
  );
}
