import React from "react";
import { View, Text, Link } from "@react-pdf/renderer";

import { formatDateTime } from "../../util/helperfunctions";

const EventDetails = ({ event, venue, styles }) => {
  return (
    <View style={styles.bottomRow}>
      <View style={styles.bottomParagraph}>
        <Text style={styles.definition}>Event:</Text>
        <Text style={styles.definitionValue}>
          {event?.name || "Unknown Event"}
        </Text>
      </View>
      <View style={styles.bottomParagraph}>
        <Text style={styles.definition}>Venue:</Text>
        <Text style={styles.definitionValue}>
          {venue?.name || "Unknown Venue"}
        </Text>
      </View>
      <View style={styles.bottomParagraph}>
        <Text style={styles.definitionValue}>
          {venue?.address || "Unknown Address"}
        </Text>
      </View>
      <View style={styles.bottomParagraph}>
        <Text style={styles.definitionValue}>
          {venue?.zipcode || "Unknown Zipcode"} {/** Add City here */}
        </Text>
      </View>
      <View style={styles.bottomParagraph}>
        <Text style={styles.definition}>Time:</Text>
        <Text style={styles.definitionValue}>
          {formatDateTime(event?.beginsAt) || "Unknown Time"}
        </Text>
      </View>
      <View style={styles.bottomParagraph}>
        <Text style={styles.definition}>Terms and Conditions:</Text>
        <Text style={styles.definitionValue}>
          Non-refundable. Visit{" "}
          <Link src="https://ticketguru.store">ticketguru.store</Link>.
        </Text>
      </View>
    </View>
  );
};

export default EventDetails;
