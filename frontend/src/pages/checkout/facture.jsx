import React from "react";
import { Link } from "react-router-dom";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import logo from "../../../Logo.jpg"; // Import your company logo image here

const Facture = ({ orderDetails }) => {
  const MyDocument = () => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.logoContainer}>
          <Image src={logo} style={styles.logo} />
        </View>
        {/* Order details */}
        <View style={styles.section}>
          <Text>Date: {orderDetails.date}</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Product</Text>
              <Text style={styles.tableHeader}>Price</Text>
              <Text style={styles.tableHeader}>Quantity</Text>
              <Text style={styles.tableHeader}>Total</Text>
            </View>
            {orderDetails.items.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text>{item.name}</Text>
                <Text>{item.price ? item.price.toFixed(2) : "N/A"}DA</Text>
                <Text>{item.quantity}</Text>
                <Text>
                  {item.price && item.quantity
                    ? (item.price * item.quantity).toFixed(2)
                    : "N/A"}
                  DA
                </Text>
              </View>
            ))}
          </View>
        </View>
        {/* Contact information */}
        <View style={styles.contactInfo}>
          <Text>Contact us:</Text>
          <Text>Email: example@example.com</Text>
          <Text>Phone: 123-456-7890</Text>
          <Text>Address: 123 Main St, City, Country</Text>
        </View>
      </Page>
    </Document>
  );

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#bfbfbf",
      marginTop: 10,
    },
    tableRow: {
      flexDirection: "row",
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: "#bfbfbf",
    },
    tableHeader: {
      width: "25%",
      padding: 5,
      textAlign: "center",
      fontWeight: "bold",
      backgroundColor: "#f2f2f2", // Background color for table headers
    },
    tableCell: {
      width: "25%",
      padding: 5,
      textAlign: "center",
    },
    logoContainer: {
      alignItems: "center",
      marginTop: 20,
    },
    logo: {
      width: 50,
      height: 50,
    },
    contactInfo: {
      position: "absolute",
      bottom: 10,
      left: 10,
    },
  });

  return (
    <div className="thank-you-page">
      <h1>Thank You for Your Order!</h1>
      <div>
        <PDFViewer width={600} height={500}>
          <MyDocument />
        </PDFViewer>
      </div>
      <div>
        {/* PDFDownloadLink for downloading the PDF */}
        <PDFDownloadLink document={<MyDocument />} fileName="order_details.pdf">
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Download PDF"
          }
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default Facture;
