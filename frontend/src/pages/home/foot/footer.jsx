import React from "react";
import Logo from "../../../assets/logo.webp";
import { Link } from "react-router-dom";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import { MdOutlineBadge } from "react-icons/md";
import { FaFacebook, FaTiktok, FaLinkedin } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";
import { MdOutlineAttachEmail } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";
import DzCart from "../../../assets/dzcart.jpg";
import Visa from "../../../assets/visa.png";
import Master from "../../../assets/master.png";
import Cip from "../../../assets/cip.png";
import "./footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer">
        <div className="part1">
          <Link to="/">
            <img src={Logo} alt="Company Logo" />
          </Link>
          <label>SARL CH INFORMATIQUE</label>
          <p>
            <LocationOnOutlinedIcon />
            <strong>Address:</strong> Lot Alioua No. 07 - 4th Floor Cheraga
          </p>
          <p>
            <GppGoodOutlinedIcon />
            <strong>N° RC:</strong> 16/00-1002250 B 09
          </p>
          <p>
            <MdOutlineBadge />
            <strong>N° AI:</strong>16520694312- <br /> <strong>N° IF:</strong>{" "}
            000916100225075- <br />
            <strong>NIS:</strong>000916320004168
          </p>
          <p>
            <CreditCardOutlinedIcon />
            <strong>Bank Account:</strong> Al Salam Bank Agency Dely Ibrahim{" "}
            <br />
            <strong>RIB:</strong>03801601320212900118
          </p>
        </div>
        <div className="part2">
          <div className="pages">
            <div className="col">
              <h2>Company</h2>
              <ul className="footer-list mb-sm-5 mb-md-0">
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link to="/terms">Terms and Conditions</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div className="col">
              <h2>Account</h2>
              <ul className="footer-list mb-sm-5 mb-md-0">
                <li>
                  <Link to="/sign">Sign Up/In</Link>
                </li>
                <li>
                  <Link to="/cart">View Cart</Link>
                </li>
                <li>
                  <Link to="/favoris">View Wishlist</Link>
                </li>
                <li>
                  <Link to="/history">Order History</Link>
                </li>
              </ul>
            </div>
            <div className="col">
              <h2>Shop</h2>
              <ul className="footer-list mb-sm-5 mb-md-0">
                <li>
                  <Link to="/shop">All Products</Link>
                </li>
                <li>
                  <Link to="/prebuilt-pc">Pre-Built PC</Link>
                </li>
                <li>
                  <Link to="/build-pc">Build PC</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="part3">
          <div className="contact">
            <label>Email us on:</label>
            <br />
            <p>
              <MdOutlineAttachEmail /> CHINFROMATIQUE@YAHOO.FR
            </p>
            <label>Or Call us on:</label>
            <br />
            <p>
              <FiPhoneCall /> (+213) 023 34 80 86
            </p>
          </div>
          <div className="row d-flex align-items-center media">
            <label>Follow us on:</label>
            <ul className="list list-inline">
              <li className="list-inline-item">
                <a href="https://www.facebook.com/chinformatique">
                  <FaFacebook />
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.instagram.com/chinformatique_/">
                  <GrInstagram />
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.linkedin.com/company/chinformatique/">
                  <FaLinkedin />
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.linkedin.com/company/chinformatique/">
                  <FaTiktok />
                </a>
              </li>
            </ul>
          </div>
          <div className="row">
            <label>Secured Payment Gateways:</label>
            <div className="pay">
              <img src={DzCart} alt="DzCart" />
              <img src={Visa} alt="Visa" />
              <img src={Master} alt="Mastercard" />
              <img src={Cip} alt="Cip" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
