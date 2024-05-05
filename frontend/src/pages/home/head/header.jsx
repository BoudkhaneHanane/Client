import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { Button } from "@mui/material";
import {
  AccountCircle,
  History,
  Settings,
  ExitToApp,
} from "@mui/icons-material";
import Logo from "../../../assets/logo.webp";
import Heart from "../../../assets/heart.png";
import Cart from "../../../assets/cart.png";
import User from "../../../assets/user.png";
import Nav from "../head/nav";

function Header({ sizeCart, sizeFavoris, isAuthenticated }) {
  const [isOpenDropdown, setIsOpenDropDown] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => {
    setIsOpenDropDown(!isOpenDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpenDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpenDropDown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpenDropdown]);

  return (
    <div className="headerWrapper">
      <header>
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <img src={Logo} alt="Logo" />
            </Link>
          </div>
          <Nav />
          <div className="header-actions">
            <ul className="list-inline mb-0 headerTabs">
              <li className="list-inline-item">
                <Link to="/favoris">
                  <span>
                    <img src={Heart} alt="Heart" />
                    <span className="badge rounded-circle">{sizeFavoris}</span>
                  </span>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/cart">
                  <span>
                    <img src={Cart} alt="Cart" />
                    <span className="badge rounded-circle">{sizeCart}</span>
                  </span>
                </Link>
              </li>
              {isAuthenticated ? (
                <li className="list-inline-item" ref={dropdownRef}>
                  <span onClick={toggleDropdown}>
                    <img src={User} alt="User" />
                  </span>
                  {isOpenDropdown && (
                    <ul className="dropDownMenu">
                      <li>
                        <Link to="">
                          <Button className="align-items-center">
                            <AccountCircle /> My Account
                          </Button>
                        </Link>
                      </li>
                      <li>
                        <Link to="/history">
                          <Button>
                            <History /> History
                          </Button>
                        </Link>
                      </li>
                      <li>
                        <Link to="">
                          <Button>
                            <Settings /> Settings
                          </Button>
                        </Link>
                      </li>
                      <li>
                        <Link to="/">
                          <Button>
                            <ExitToApp /> Log Out
                          </Button>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              ) : (
                <li className="list-inline-item">
                  <Link to="/login">
                    <span>
                      <img src={User} alt="User" />
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
