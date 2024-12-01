import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QrCodeScanner = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef(null);
  const scannerInstance = useRef(null); // Keep track of the scanner instance

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
      // Call the provided callback
      onScanSuccess(decodedText, decodedResult);

      // Shut down the scanner
      if (scannerInstance.current) {
        scannerInstance.current.clear().catch((error) => {
          console.error("Failed to clear scanner:", error);
        });
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
  }, [onScanSuccess, onScanError]);

  return <div id="qr-scanner" ref={scannerRef} style={{ width: "100%" }} />;
};

export default QrCodeScanner;
