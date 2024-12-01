import { useEffect, useRef, useState } from "react";
import QrCodeScanner from "./QrCodeScanner";

export default function BarcodeInput({
  barcode,
  setBarcode,
  handleChange,
  handleSubmit,
  barcodeLoading,
}) {
  const inputRef = useRef(null);
  const formRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleScanSuccess = (decodedText, decodedResult) => {
    console.log(`Scan result: ${decodedText}`, decodedResult);
    setCameraOpen(false);
    setBarcode(decodedText);
    handleSubmit({ preventDefault: () => {}, barcode: decodedText });
  };

  const handleScanError = (errorMessage) => {
    // Do nothing because the scanner will keep spitting messages as long as it can't read a QR code
  };

  return (
    <div className="barcode-input-container mt-5">
      {cameraOpen ? (
        <QrCodeScanner
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
        />
      ) : (
        <button
          onClick={() => setCameraOpen(true)}
          className="my-4 inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Open Camera
        </button>
      )}

      <form
        ref={formRef}
        className="sm:flex sm:items-center"
        onSubmit={handleSubmit}
      >
        <div className="w-full">
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
        <div className="mt-3 sm:ml-3 sm:mt-0 sm:flex sm:items-center gap-3">
          <button
            type="submit"
            style={{ height: "4.5rem" }}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {barcodeLoading ? "Loading..." : "Fetch Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}
