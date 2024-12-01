import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QrCodeScanner = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef(null);
  const scannerInstance = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Initialize the scanner
    scannerInstance.current = new Html5QrcodeScanner(
      scannerRef.current.id,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    const wrappedOnScanSuccess = (decodedText, decodedResult) => {
      if (!isPaused) {
        onScanSuccess(decodedText, decodedResult);
        pauseScanner(); // Pause instead of stopping
      }
    };

    scannerInstance.current.render(wrappedOnScanSuccess, onScanError);

    return () => {
      // Cleanup on component unmount
      if (scannerInstance.current) {
        scannerInstance.current.clear().catch((error) => {
          console.error("Failed to clear scanner:", error);
        });
      }
    };
  }, [onScanSuccess, onScanError, isPaused]);

  const pauseScanner = () => {
    if (scannerInstance.current && !isPaused) {
      scannerInstance.current.pause(true); // Pause the scanner
      setIsPaused(true);
    }
  };

  const resumeScanner = () => {
    if (scannerInstance.current && isPaused) {
      scannerInstance.current.resume(); // Resume the scanner
      setIsPaused(false);
    }
  };

  return (
    <div>
      <div id="qr-scanner" ref={scannerRef} style={{ width: "100%" }} />
      {isPaused && (
        <button
          onClick={resumeScanner}
          className="mt-4 rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white hover:bg-green-600"
        >
          Resume Scanner
        </button>
      )}
    </div>
  );
};

export default QrCodeScanner;
