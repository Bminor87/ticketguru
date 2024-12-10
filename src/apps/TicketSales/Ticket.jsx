import React, { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
  Link,
} from "@react-pdf/renderer";
import QRCode from "qrcode";

import {
  formatDateTime,
  findEvent,
  findVenue,
  findTicketType,
} from "../../util/helperfunctions";

import TicketPage from "./TicketPage";

// Font source
const fontNormal =
  "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf";
const fontBold =
  "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf";
const fontItalic =
  "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf";

// Register fonts
Font.register({
  family: "Roboto",
  fonts: [
    { src: fontNormal },
    { src: fontBold, fontWeight: "bold" },
    { src: fontItalic, fontStyle: "italic" },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 10,
    fontFamily: "Roboto",
  },
  ticketRow: {
    flexDirection: "row",
    fontSize: 12,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    borderBottomStyle: "dashed",
    marginBottom: 20,
    paddingBottom: 10,
  },
  qrSection: {
    margin: 10,
    flexGrow: 1,
  },
  detailsSection: {
    marginTop: 30,
    flexGrow: 2,
    paddingHorizontal: 10,
  },
  ticketDetails: {
    flexDirection: "row",
    marginBottom: 5,
  },
  leftColumn: {
    width: 100,
    fontWeight: "bold",
    fontSize: 12,
  },
  rightColumn: {
    flexGrow: 1,
    fontSize: 12,
  },
  bottomRow: {
    marginTop: 20,
    paddingTop: 10,
    fontSize: 10,
    alignItems: "center",
  },
  bottomParagraph: {
    flexDirection: "row",
    marginVertical: 2,
  },
  definition: {
    fontWeight: "bold",
    marginRight: 5,
  },
  definitionValue: {
    flexGrow: 1,
  },
  description: {
    flexGrow: 1,
    fontSize: 10,
    fontStyle: "italic",
    marginTop: 20,
    marginBottom: 20,
  },
  bottomTitle: {
    fontSize: 18,
    color: "#0A74DA", // Adjusted color
    fontWeight: "bold",
    marginBottom: 20,
  },
  qrCode: {
    width: 128,
    height: 128,
    marginBottom: 10,
  },
});

// Generate QR code function
const generateQRCode = async (text) => {
  try {
    return await QRCode.toDataURL(text, { errorCorrectionLevel: "Q" });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return null;
  }
};

const Ticket = ({ tickets, events, venues, ticketTypes }) => {
  const [preparedTickets, setPreparedTickets] = useState(null);

  useEffect(() => {
    const prepareTickets = async () => {
      if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
        console.error("Invalid tickets data");
        return;
      }

      // Generate QR codes for all tickets
      const updatedTickets = await Promise.all(
        tickets.map(async (ticket) => {
          if (!ticket.barcode) {
            console.error("Invalid ticket: Missing barcode", ticket);
            return null;
          }
          const qrCode = await generateQRCode(ticket.barcode);
          return { ...ticket, qrCode };
        })
      );

      // Filter out invalid tickets
      const validTickets = updatedTickets.filter(
        (ticket) => ticket && ticket.qrCode
      );
      setPreparedTickets(validTickets);
    };

    prepareTickets();
  }, [tickets]);

  if (!preparedTickets) {
    return <p className="text-center">Loading tickets...</p>;
  }

  return (
    <Document>
      {preparedTickets.map((ticket, index) => (
        <TicketPage
          key={index}
          ticket={ticket}
          events={events}
          venues={venues}
          ticketTypes={ticketTypes}
          styles={styles}
        />
      ))}
    </Document>
  );
};

export default Ticket;
