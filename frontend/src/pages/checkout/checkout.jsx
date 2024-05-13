import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import Facture from "./facture";
import "./checkout.css";

const Alert = ({ message }) => {
  return (
    <div className="alert-container">
      <div className="alert warning">
        <FaExclamationTriangle className="icon" />
        <span className="message">{message}</span>
      </div>
    </div>
  );
};

const Checkout = ({ cart }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Define wilayas and communes data
  const wilayas = [
    {
      name: "Adrar",
      communes: [
        "Adrar",
        "Tamest",
        "Charouine",
        "Reggane",
        "Inzghmir",
        "Tit",
        "Ksar Kaddour",
        "Tsabit",
        "Timimoun",
        "Ouled Saïd",
        "Zaouiet Kounta",
        "Aoulef",
        "Tamokten",
        "Tamantit",
        "Fenoughil",
        "Tinerkouk",
        "Deldoul",
        "Sali",
        "Akabli",
        "Metarfa",
        "Ouled Ahmed Tammi",
        "Bouda",
        "Aougrout",
        "Talmine",
        "Bordj Badji Mokhtar",
        "Sebaa",
        "Ouled Aïssa",
        "Timiaouine",
      ],
    },
    {
      name: "chlef",
      communes: [
        "Abou El Hassane",
        "Tadjena",
        "Talassa",
        "Ain Merane",
        "Herenfa",
        "Beni Haoua",
        "Breira",
        "Oued Goussine",
        "Boukadir",
        "Oued Sly",
        "Sobha",
        "Chlef",
        "Oum Drou",
        "Sendjas",
        "Beni Bouattab",
        "El Karimia",
        "Harchoun",
        "El Marsa",
        "Moussadek",
        "Beni Rached",
        "Oued Fodda",
        "Ouled Abbes",
        "El Hadjadj",
        "Ouled Ben Abdelkader",
        "Chettia",
        "Labiod Medjadja",
        "Ouled Fares",
        "Dahra",
        "Taougrit",
        "Sidi Abderrahmane",
        "Sidi Akkacha",
        "Tenes",
        "Benairia",
        "Bouzeghaia",
        "Zeboudja",
      ],
    },
    {
      name: "laghouat",
      communes: [
        "Aflou",
        "Ain Bekai",
        "Ain Madhi",
        "Ain Sidi Ali",
        "Beidha",
        "Bennana",
        "Brida",
        "El Assafia",
        "El Ghicha",
        "El Houita",
        "Gueltat Sidi Saad",
        "Hadj Mechri",
        "Hassi Delaa",
        "Hassi R'Mel",
        "Hassian Dhib",
        "Kheneg",
        "Ksar el Hirane",
        "Laghouat",
        "Laghouat 1er Novembre",
        "M'hat Essoultane",
        "Mekhareg",
        "Oued M'zi",
        "Oued Morra",
        "Oued Touil",
        "Reg Taounza",
        "Sebgag",
        "Sidi Bouzid",
        "Sidi Hamza",
        "Sidi Makhlouf",
        "Tadjemout",
        "Tadjerouna",
        "Taouiala",
      ],
    },
    {
      name: "oum El Bouaghi",
      communes: [
        "Oum El Bouaghi",
        "Aïn Babouche",
        "Aïn Beïda" /* Add more communes */,
      ],
    },
    {
      name: "Batna",
      communes: ["Batna", "Timgad", "Arris" /* Add more communes */],
    },
    {
      name: "Béjaïa",
      communes: ["Béjaïa", "Akbou", "Barbacha" /* Add more communes */],
    },
    {
      name: "Biskra",
      communes: [
        "Biskra",
        "Ouled Djellal",
        "M'Chedallah" /* Add more communes */,
      ],
    },
    {
      name: "Béchar",
      communes: ["Béchar", "Boudjmorra", "Beni Abbes" /* Add more communes */],
    },
    {
      name: "Blida",
      communes: ["Blida", "Ouled Yaïch", "Mouzaïa" /* Add more communes */],
    },
    {
      name: "Bouira",
      communes: ["Bouira", "M'Chedallah", "Dirrah" /* Add more communes */],
    },
    {
      name: "Tamanrasset",
      communes: ["Tamanrasset", "Tazrouk", "Idlès" /* Add more communes */],
    },
    {
      name: "Tébessa",
      communes: ["Tébessa", "El Ma Labiodh", "El Ogla" /* Add more communes */],
    },
    {
      name: "Tlemcen",
      communes: ["Tlemcen", "Maghnia", "Nedroma" /* Add more communes */],
    },
    {
      name: "Tiaret",
      communes: ["Tiaret", "Medroussa", "Ain El Hadid" /* Add more communes */],
    },
    {
      name: "Tizi Ouzou",
      communes: ["Tizi Ouzou", "Akbil", "Aït Bouaddou" /* Add more communes */],
    },
    {
      name: "Alger",
      communes: [
        "Alger Centre",
        "Hussein Dey",
        "Kouba",
        "Sidi M'Hamed",
        "Reghaia",
        "bouzareah",
        "El Biar",
        "Bordj El Kiffan",
        "Bab Ezzouar",
        "El Harrach",
        "Rouiba",
        "El Marsa",
        "Bordj El Bahri",
      ],
    },
    {
      name: "Djelfa",
      communes: ["Djelfa", "Messaad", "El Guedid" /* Add more communes */],
    },
    {
      name: "Jijel",
      communes: ["Jijel", "El Ancer", "Sidi Maarouf" /* Add more communes */],
    },
    {
      name: "Sétif",
      communes: ["Sétif", "El Eulma", "Aïn Azel" /* Add more communes */],
    },
    {
      name: "Saïda",
      communes: [
        "Saïda",
        "Ain El Hadjar",
        "Ouled Khaled" /* Add more communes */,
      ],
    },
    {
      name: "Skikda",
      communes: ["Skikda", "Azzaba", "El Hadaik" /* Add more communes */],
    },
    {
      name: "Sidi Bel Abbès",
      communes: [
        "Sidi Bel Abbès",
        "Sidi Lahcen",
        "Moulay Slissen" /* Add more communes */,
      ],
    },
  ];
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    phone: "",
    orderNotes: "",
    deliveryOption: "Desktop",
    paymentMethod: "Cash on Delivery",
    wilaya: "",
    commune: "",
    deliveryCost: 0,
    error: "",
  });

  // Define and set state variables for form inputs
  const {
    firstName,
    lastName,
    streetAddress,
    phone,
    orderNotes,
    deliveryOption,
    paymentMethod,
    wilaya,
    commune,
  } = formData;

  const setFirstName = (value) =>
    setFormData({ ...formData, firstName: value });
  const setLastName = (value) => setFormData({ ...formData, lastName: value });
  const setStreetAddress = (value) =>
    setFormData({ ...formData, streetAddress: value });
  const setPhone = (value) => setFormData({ ...formData, phone: value });
  const setOrderNotes = (value) =>
    setFormData({ ...formData, orderNotes: value });
  const setDeliveryOption = (value) =>
    setFormData({ ...formData, deliveryOption: value });
  const setPaymentMethod = (value) =>
    setFormData({ ...formData, paymentMethod: value });
  const setWilaya = (value) => setFormData({ ...formData, wilaya: value });
  const setCommune = (value) => setFormData({ ...formData, commune: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      streetAddress,
      phone,
      wilaya,
      commune,
      orderNotes,
      deliveryOption,
      paymentMethod,
    } = formData;

    if (
      !firstName ||
      !lastName ||
      !streetAddress ||
      !phone ||
      !wilaya ||
      !commune
    ) {
      setErrorMessage("Please fill in all required fields.");
      // Clear error message after 2 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }

    // Prepare data to send
    const orderData = {
      firstName,
      lastName,
      streetAddress,
      phone,
      wilaya,
      commune,
      orderNotes,
      deliveryOption,
      paymentMethod,
      cart, // Assuming cart is already defined in the component
      deliveryCost: formData.deliveryCost,
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/checkout",
        orderData
      );
      console.log(response.data);
      // Update state to indicate order submitted successfully
      setOrderSubmitted(true);
      // Assuming response.data includes the orderId
      setOrderId(response.data.orderId);
    } catch (error) {
      console.error(
        "Error processing order:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage("Error processing order. Please try again.");
      // Clear error message after 2 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  };

  const calculateSubtotal = (quantity, price) => {
    return quantity * price;
  };

  const calculateTotal = () => {
    let total = cart.reduce(
      (total, product) => total + product.quantity * product.price,
      700
    );
    return total + formData.deliveryCost;
  };

  return (
    <div className="checkout-container">
      {!orderSubmitted ? (
        <form onSubmit={handleSubmit}>
          <div className="checktop">
            <hr />
            <p>
              RETURNING CUSTOMER? <Link to="/">CLICK HERE TO LOGIN</Link>
            </p>
            <hr />
          </div>
          <div className="checkcontent row">
            <div className="checkleft">
              <div className="billing-details section">
                <h2>Billing Details</h2>
                <hr />
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <label>Country: Algeria</label>
                <label>Wilaya</label>
                <select
                  value={wilaya}
                  onChange={(e) => {
                    setWilaya(e.target.value);
                    handleWilayaChange(e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Select your Wilaya
                  </option>
                  {wilayas.map((wilaya) => (
                    <option key={wilaya.name} value={wilaya.name}>
                      {wilaya.name}
                    </option>
                  ))}
                </select>
                <label>Commune</label>
                <select
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                >
                  <option value="" disabled>
                    Select your Commune
                  </option>
                  {wilayas
                    .find((w) => w.name === wilaya)
                    ?.communes.map((commune) => (
                      <option key={commune} value={commune}>
                        {commune}
                      </option>
                    ))}
                </select>
                <label>Street Address</label>
                <input
                  placeholder="House number and street name"
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                />
                <label>Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="additional-information section">
                <h2>Additional Information</h2>
                <hr />
                <label>Order Notes (optional)</label>
                <textarea
                  placeholder="Notes about your order, e.g special notes for delivery."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="checkright">
              <div className="order-details section">
                <h2>Order Details</h2>
                <hr />
                <table>
                  <thead>
                    <tr>
                      <th className="title">Product</th>
                      <th className="title">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((product) => (
                      <tr key={product.idProduit}>
                        <td>
                          {product.name} x{product.quantity}
                        </td>
                        <td className="money">
                          {calculateSubtotal(product.quantity, product.price)}{" "}
                          DA
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="title">Subtotal (excluding delivery)</td>
                      <td className="money">{calculateTotal(cart) - 700}DA</td>
                    </tr>
                    <tr>
                      <td className="title">Total</td>
                      <td className="money">{calculateTotal()}DA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="delivery-information section">
                <h2>Delivery Information</h2>
                <hr />
                <div className="delivery-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={deliveryOption === "Desktop"}
                      onChange={() => setDeliveryOption("Desktop")}
                    />
                    To Desktop
                  </label>
                </div>
                <div className="delivery-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={deliveryOption === "Home"}
                      onChange={() => setDeliveryOption("Home")}
                    />
                    To Home
                  </label>
                </div>
                <p>
                  Delivery Cost: {deliveryOption === "Desktop" ? "500" : "700"}
                  DA
                </p>
                <p>
                  Livraison to {wilaya}, {commune}
                </p>
              </div>
              <div className="payment-section section">
                <h2>Payment</h2>
                <hr />
                <div className="payment-method">
                  <label>
                    <input
                      type="checkbox"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={() => setPaymentMethod("Cash on Delivery")}
                    />
                    Cash on Delivery
                  </label>
                </div>
                <div className="payment-method">
                  <label>
                    <input
                      type="checkbox"
                      checked={paymentMethod === "Online"}
                      onChange={() => setPaymentMethod("Online")}
                    />
                    Online
                  </label>
                </div>
                {paymentMethod === "Online" && (
                  <div className="online-payment-form">
                    <p>Online Payment Form Goes Here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="copyRights">
            <p>
              Veiller nous appeler via 0555 58 89 44 / 0555 58 89 45 pour plus
              d’informations
            </p>
            <p>
              Your personal data will be used to process your order, support
              your experience throughout this website, and for other purposes
              described in our privacy policy.
            </p>
            <label>
              <input type="checkbox" />I have read and agree to the website{" "}
              <Link to="/">terms and conditions</Link>
            </label>
          </div>
          {errorMessage && (
            <Alert message={errorMessage} onClose={() => setErrorMessage("")} />
          )}
          <button type="submit" className="place-order-button">
            Place Order
          </button>
        </form>
      ) : (
        <Facture
          orderDetails={{
            orderId: orderId,
            date: new Date().toLocaleDateString(),
            total: calculateTotal(),
            items: cart, // Pass the entire cart array
          }}
        />
      )}
    </div>
  );
};

export default Checkout;
