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
import "./facture.jsx";

const Facture = ({
  orderDetails,
  firstName,
  lastName,
  streetAddress,
  phone,
  wilaya,
  commune,
  orderNotes,
  deliveryOption,
  paymentMethod,
}) => {
  const MyDocument = () => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <Text style={styles.companyName}>Ch Informatique</Text>
          <Text style={styles.date}>{orderDetails.date}</Text>
        </View>
        <View style={styles.billingInformation}>
          <Text style={styles.sectionTitle}>Billed To</Text>
          <Text style={styles.infoText}>
            Customer: {lastName} {firstName}
          </Text>
          <Text style={styles.infoText}>
            Address: {streetAddress}, {commune}, {wilaya}
          </Text>
          <Text style={styles.infoText}>Phone: {phone}</Text>
          <Text style={styles.infoText}>Order Notes: {orderNotes}</Text>
        </View>
        <View style={styles.shippingInformation}>
          <Text style={styles.sectionTitle}>Payment & Shipping</Text>
          <Text style={styles.infoText}>Delivery Option: {deliveryOption}</Text>
          <Text style={styles.infoText}>Payment Method: {paymentMethod}</Text>
        </View>
        <View style={styles.productServices}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Product</Text>
              <Text style={styles.tableHeader}>Quantity</Text>
              <Text style={styles.tableHeader}>Unit Price</Text>
              <Text style={styles.tableHeader}>Total</Text>
            </View>
            {orderDetails.items.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{item.name}</Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>
                  {item.price ? item.price.toFixed(2) : "N/A"} DA
                </Text>
                <Text style={styles.tableCell}>
                  {item.price && item.quantity
                    ? (item.price * item.quantity).toFixed(2)
                    : "N/A"}{" "}
                  DA
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.total}>
          <Text style={styles.totalAmount}>
            Total:<Text style={styles.price}>{orderDetails.total} DA</Text>
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.thankText}>Thank you for your order!</Text>
          <Text style={styles.footerText}>
            If you have questions about your order, you can email us at
            <Text style={styles.contact}> contact@chinformatique.dz</Text> or
            call us on{" "}
            <Text style={styles.contact}>(+213) 0555588944/45/55</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );

  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#ffffff",
      padding: 40,
      fontFamily: "Helvetica",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 30,
    },
    logo: {
      width: 60,
      height: 55,
      marginRight: 5,
    },
    companyName: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#000",
      marginRight: "auto",
    },
    date: {
      fontSize: 14,
      fontWeight: 700,
      color: "#333",
    },
    billingInformation: {
      color: "#000",
      marginBottom: 20,
    },
    shippingInformation: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 600,
      marginBottom: 10,
      color: "#333",
    },
    infoText: {
      fontSize: 18,
      marginBottom: 5,
      color: "#34495E",
    },
    table: {
      borderWidth: 1,
      borderColor: "#111678",
      borderStyle: "solid",
      marginBottom: 30,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 0.5,
      borderBottomColor: "#CCCCCC",
      borderBottomStyle: "solid",
    },
    tableHeader: {
      width: "35%",
      padding: 5,
      textAlign: "center",
      fontWeight: "bold",
      backgroundColor: "#111678",
      color: "#fff",
    },
    tableCell: {
      fontSize: 15,
      width: "25%",
      padding: 5,
      textAlign: "center",
      color: "#34495E",
    },
    total: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#000",
      marginRight: "auto",
    },
    price: {
      fontWeight: 900,
      color: "#111678",
    },
    footer: {
      marginBottom: 150,
      alignItems: "center",
    },
    footerText: {
      fontSize: 13,
      color: "#666666",
      textAlign: "center",
    },
    thankText: {
      fontWeight: 900,
    },
    contact: {
      fontWeight: "bold",
      color: "#111678",
    },
  });

  return (
    <div className="thank-you-page">
      <div className="save-container">
        <h1 className="thank-you-header">
          Thank you for your purchase! Your order is being processed.
        </h1>{" "}
        <div className="save">
          <PDFViewer width={700} height={700}>
            <MyDocument />
          </PDFViewer>
        </div>
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
