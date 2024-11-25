import { useRef, useEffect } from "react";
import { Input } from "@mui/material";

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
    <div className="mt-5 sm:flex sm:items-center col-span-2">
      <Input
        ref={inputRef}
        id="barcode"
        style={{ width: "100%" }}
        value={barcode}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        placeholder="Enter/Read ticket number here"
        autoFocus
      />
    </div>
  );
}
