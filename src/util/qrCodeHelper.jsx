import QRCode from "qrcode";

export const generateQRCode = async (text) => {
  try {
    return await QRCode.toDataURL(text, { errorCorrectionLevel: "Q" });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return null;
  }
};
