import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import Search from "../../../assets/search.png";
import Nav from "../head/nav";

function Header({ sizeCart, sizeFavoris, isAuthenticated, onLogout }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for search bar
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown menu
  const dropdownRef = useRef();
  const searchInputRef = useRef(); // Ref for search input
  const navigate = useNavigate();

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 0);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    navigate(`/search?q=${searchTerm}`); // Navigate to search results page with the search term
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

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
              <li
                className="list-inline-item search-icon"
                onClick={toggleSearch}
              >
                <span>
                  <img src={Search} alt="Search" />
                </span>
                {isSearchOpen && (
                  <div className="search-bar">
                    <form onSubmit={handleSearchSubmit}>
                      <input
                        type="text"
                        ref={searchInputRef}
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <button type="submit">Search</button>
                    </form>
                  </div>
                )}
              </li>
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
              <li className="list-inline-item">
                {isAuthenticated ? (
                  <div>
                    <span onClick={toggleDropdown}>
                      <img src={User} alt="user" />
                    </span>
                    {isDropdownOpen && (
                      <ul className="dropDownMenu" ref={dropdownRef}>
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
                          <Button onClick={onLogout}>
                            <ExitToApp /> Log Out
                          </Button>
                        </li>
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link to="/login">
                    <span>
                      <img src={User} alt="user" />
                    </span>
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
