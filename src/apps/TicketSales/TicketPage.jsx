import React from "react";
import { Page, View } from "@react-pdf/renderer";
import QRCodeSection from "./QRCodeSection";
import TicketDetails from "./TicketDetails";
import EventDetails from "./EventDetails";

import {
  findEvent,
  findVenue,
  findTicketType,
} from "../../util/helperfunctions";

const TicketPage = ({ ticket, events, venues, ticketTypes, styles }) => {
  const event = findEvent(
    findTicketType(ticket.ticketTypeId, ticketTypes)?.eventId,
    events
  );

  const venue = findVenue(event?.venueId, venues);

  const ticketType = findTicketType(ticket.ticketTypeId, ticketTypes);

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.ticketRow}>
        <QRCodeSection qrCode={ticket.qrCode} />
        <TicketDetails
          ticket={ticket}
          event={event}
          venue={venue}
          ticketType={ticketType}
          styles={styles}
        />
      </View>
      <EventDetails
        ticket={ticket}
        event={event}
        venue={venue}
        styles={styles}
      />
    </Page>
  );
};

export default TicketPage;
