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

import { formatDateTime } from "../../util/helperfunctions";

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

const Ticket = ({ tickets }) => {
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
        <Page key={index} size="A4" style={styles.page}>
          {/* Ticket Top Row */}
          <View style={styles.ticketRow}>
            {/* QR Code Section */}
            <View style={styles.qrSection}>
              {ticket.qrCode && (
                <Image style={styles.qrCode} src={ticket.qrCode} />
              )}
            </View>

            {/* Ticket Details Section */}
            <View style={styles.detailsSection}>
              <View style={styles.ticketDetails}>
                <Text style={styles.leftColumn}>Event:</Text>
                <Text style={styles.rightColumn}>
                  {ticket.event?.name || "Unknown Event"}
                </Text>
              </View>
              <View style={styles.ticketDetails}>
                <Text style={styles.leftColumn}>Ticket Type:</Text>
                <Text style={styles.rightColumn}>
                  {ticket.ticketType?.name || "Unknown Ticket Type"}
                </Text>
              </View>
              <View style={styles.ticketDetails}>
                <Text style={styles.leftColumn}>Venue:</Text>
                <Text style={styles.rightColumn}>
                  {ticket.venue?.name || "Unknown Venue"}
                </Text>
              </View>
              <View style={styles.ticketDetails}>
                <Text style={styles.leftColumn}>Price:</Text>
                <Text style={styles.rightColumn}>
                  {ticket.price?.toFixed(2) || "0.00"} €
                </Text>
              </View>
              <View style={styles.ticketDetails}>
                <Text style={styles.leftColumn}>Time:</Text>
                <Text style={styles.rightColumn}>
                  {formatDateTime(ticket.event?.beginsAt || new Date())}
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Row */}
          <View style={styles.bottomRow}>
            <Text style={styles.bottomTitle}>Event Details</Text>
            <View style={styles.bottomParagraph}>
              <Text style={styles.definition}>Event:</Text>
              <Text style={styles.definitionValue}>
                {ticket.event?.name || "Unknown Event"}
              </Text>
            </View>
            <View style={styles.bottomParagraph}>
              <Text style={styles.definition}>Venue:</Text>
              <Text style={styles.definitionValue}>
                {ticket.venue?.name || "Unknown Venue"}
              </Text>
            </View>
            <View style={styles.bottomParagraph}>
              <Text style={styles.definition}>Time:</Text>
              <Text style={styles.definitionValue}>
                {formatDateTime(ticket.event?.beginsAt || new Date())}
              </Text>
            </View>
            <View style={styles.bottomParagraph}>
              <Text style={styles.definition}>Ticket Type:</Text>
              <Text style={styles.definitionValue}>
                {ticket.ticketType?.name || "Unknown Ticket Type"}
              </Text>
            </View>
            <View style={styles.bottomParagraph}>
              <Text style={styles.definition}>Price:</Text>
              <Text style={styles.definitionValue}>
                {ticket.price?.toFixed(2) || "0.00"} €
              </Text>
            </View>
            <View style={styles.bottomParagraph}>
              <Text style={styles.description}>
                {ticket.event?.description || "No description available"}
              </Text>
            </View>
            <View style={styles.bottomParagraph}>
              <Text style={styles.definition}>Terms and Conditions:</Text>
              <Text style={styles.definitionValue}>
                The ticket is non-refundable. For further information, visit{" "}
                <Link src="https://ticketguru.store">ticketguru.store</Link>.
              </Text>
            </View>
            <View style={styles.bottomParagraph}>
              <Text style={styles.definitionValue}>
                The ticket is only valid for the event specified above.
              </Text>
            </View>
            <View style={styles.bottomParagraph}>
              <Text style={styles.definitionValue}>
                Ticket #: {ticket.barcode}
              </Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default Ticket;
