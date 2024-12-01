import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QrCodeScanner = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      scannerRef.current.id,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(onScanSuccess, onScanError);

    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to clear scanner. ", error);
      });
    };
  }, [onScanSuccess, onScanError]);

  return <div id="qr-scanner" ref={scannerRef} style={{ width: "100%" }} />;
};

export default QrCodeScanner;
