import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function BarcodeInput({
  barcode,
  handleChange,
  handleSubmit,
  barcodeLoading,
}) {
  const inputRef = useRef(null);
  const scannerRef = useRef(null); // Ref for the QR scanner container
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const startQrScanner = () => {
    console.log("Starting QR scanner...", scannerRef.current);
    if (!scannerRef.current) return;

    const html5QrCode = new Html5Qrcode(scannerRef.current.id);
    html5QrCode
      .start(
        { facingMode: "environment" }, // Use back camera
        {
          fps: 10, // Frames per second
          qrbox: { width: 250, height: 250 }, // Scanner box size
        },
        (decodedText) => {
          handleChange({ target: { value: decodedText } });
          stopQrScanner(html5QrCode);
        },
        (errorMessage) => {
          console.log("QR Scanner error:", errorMessage);
        }
      )
      .catch((err) => {
        console.error("QR Scanner initialization error:", err);
      });

    setIsCameraActive(true);
  };

  const stopQrScanner = (html5QrCode) => {
    html5QrCode.stop().then(() => {
      html5QrCode.clear();
      setIsCameraActive(false);
    });
  };

  return (
    <div className="barcode-input-container mt-5">
      {isCameraActive ? (
        <div className="relative w-full">
          <div ref={scannerRef} id="qr-scanner" className="w-full h-64"></div>
          <button
            onClick={() =>
              stopQrScanner(new Html5Qrcode(scannerRef.current.id))
            }
            className="mt-2 rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Close Scanner
          </button>
        </div>
      ) : (
        <form className="sm:flex sm:items-center" onSubmit={handleSubmit}>
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
            <button
              type="button"
              onClick={startQrScanner}
              style={{ height: "4.5rem" }}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
            >
              Open Camera
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
