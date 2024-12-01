import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import dayjs from "dayjs";

const Ticket = ({ ticketData, additionalData }) => {
  const [barcodeValue, setBarcodeValue] = useState("");

  useEffect(() => {
    if (ticketData) {
      console.log("Ticket data received:", ticketData);
      console.log("Additional data received:", additionalData);
      const barcode = ticketData?.barcode;

      console.log("Barcode to set:", barcode); // Log the barcode being set
      setBarcodeValue(barcode || "No barcode available");
    } else {
      console.error("Ticket data is missing!");
      setBarcodeValue("No barcode available");
    }
  }, [ticketData]);

  const ticketNumber = ticketData?.barcode || "No Ticket Number";
  const eventName = additionalData.event?.name || "Event Name";
  const eventTime =
    additionalData.event?.time ||
    ticketData.event?.beginsAt ||
    "Event Date & Time";
  const ticketStatus =
    ticketData?.usedTimestamp || ticketData?.usedAt ? "Used" : "Not used";
  const ticketPrice = ticketData?.price || "N/A";

  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Your Ticket
          </h2>
          <p className="mt-6 text-lg/8 text-gray-400">
            Below are the details of your ticket. Show the QR code at the event
            entrance.
          </p>
        </div>
        <div className="mx-auto mt-20 max-w-md rounded-2xl bg-gray-800 px-8 py-10">
          <div className="flex justify-center">
            <QRCode
              value={barcodeValue}
              size={120}
              className="rounded-xl bg-indigo-50"
            />
          </div>
          <h3 className="mt-6 text-base/7 font-semibold tracking-tight text-white">
            {eventName}
          </h3>
          <p className="text-sm/6 text-gray-400">
            {dayjs(eventTime).format("dddd, MMMM D, YYYY h:mm A")}
          </p>
          <p className="text-sm/6 text-gray-400">Price: {ticketPrice}</p>
          <p className="text-sm/6 text-gray-400">Status: {ticketStatus}</p>
          <div className="mt-6">
            <p className="text-sm/6 font-semibold text-gray-400">
              Ticket Number:
              <span className="ml-1 text-white">{ticketNumber}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
