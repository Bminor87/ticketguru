import React from "react";
import { View, Text } from "@react-pdf/renderer";

import { formatDateTime } from "../../util/helperfunctions";

const TicketDetails = ({ ticket, event, venue, ticketType, styles }) => {
  return (
    <View style={styles.detailsSection}>
      <View style={styles.ticketDetails}>
        <Text style={styles.leftColumn}>Event:</Text>
        <Text style={styles.rightColumn}>{event?.name || "Unknown Event"}</Text>
      </View>
      <View style={styles.ticketDetails}>
        <Text style={styles.leftColumn}>Ticket Type:</Text>
        <Text style={styles.rightColumn}>
          {ticketType?.name || "Unknown Ticket Type"}
        </Text>
      </View>
      <View style={styles.ticketDetails}>
        <Text style={styles.leftColumn}>Venue:</Text>
        <Text style={styles.rightColumn}>{venue?.name || "Unknown Venue"}</Text>
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
          {formatDateTime(event?.beginsAt) || "Unknown Time"}
        </Text>
      </View>
    </View>
  );
};

export default TicketDetails;
