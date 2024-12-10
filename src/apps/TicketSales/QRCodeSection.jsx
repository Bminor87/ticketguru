import React from "react";
import { View, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  qrSection: {
    margin: 10,
    flexGrow: 1,
  },
  qrCode: {
    width: 128,
    height: 128,
    marginBottom: 10,
  },
});

const QRCodeSection = ({ qrCode }) => {
  return (
    <View style={styles.qrSection}>
      {qrCode && <Image style={styles.qrCode} src={qrCode} />}
    </View>
  );
};

export default QRCodeSection;
