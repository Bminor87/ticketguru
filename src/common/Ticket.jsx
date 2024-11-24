import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import dayjs from "dayjs";

const Ticket = ({ ticketData, additionalData }) => {
  const [barcodeValue, setBarcodeValue] = useState("");

  useEffect(() => {
    if (ticketData) {
      console.log("Ticket data received:", ticketData);

      // Use the `barcode` property from the ticket data
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
    <section className="isolate overflow-hidden bg-white px-6 lg:px-8">
      <div className="relative mx-auto max-w-2xl py-24 sm:py-32 lg:max-w-4xl">
        <div className="absolute left-1/2 top-0 -z-10 h-[50rem] w-[90rem] -translate-x-1/2 bg-[radial-gradient(50%_100%_at_top,theme(colors.indigo.100),white)] opacity-20 lg:left-36" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-12 w-[150vw] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-20 md:mr-0 lg:right-full lg:-mr-36 lg:origin-center" />

        <figure className="grid grid-cols-1 items-center gap-x-6 gap-y-8 lg:gap-x-10">
          {/* QR Code Component */}
          <div className="col-end-1 w-16 lg:row-span-4 lg:w-72">
            <QRCode
              value={barcodeValue}
              size={200}
              className="rounded-xl bg-indigo-50 lg:rounded-3xl"
            />
          </div>

          {/* Ticket Details */}
          <div className="relative col-span-2 lg:col-start-1 lg:row-start-2">
            <svg
              fill="none"
              viewBox="0 0 162 128"
              aria-hidden="true"
              className="absolute -top-12 left-0 -z-10 h-32 stroke-gray-900/10"
            >
              <path
                d="M5 20 H155 A10 10 0 0 1 165 30 V98 A10 10 0 0 1 155 108 H5 A10 10 0 0 1 -5 98 V30 A10 10 0 0 1 5 20 
                  M20 0 V40 M20 88 V128 M142 0 V40 M142 88 V128"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <blockquote className="text-xl/8 font-semibold text-gray-900 sm:text-2xl/9">
              <p>{eventName}</p>
              <p className="text-gray-500">
                {dayjs(eventTime).format("dddd, MMMM D, YYYY h:mm A")}
              </p>
              <p>Price: {ticketPrice}</p>
            </blockquote>
          </div>

          {/* Ticket Bottom Part */}
          <figcaption className="text-base lg:col-start-1 lg:row-start-3">
            <div className="font-semibold text-gray-900">
              Ticket # <span className="text-gray-500">{ticketNumber}</span>
            </div>
            <div className="font-semibold text-gray-900">
              Status: <span className="text-gray-500">{ticketStatus}</span>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default Ticket;
