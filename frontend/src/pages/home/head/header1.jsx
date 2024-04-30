import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import Logo from "../../../assets/logo.webp";
import Heart from "../../../assets/heart.png";
import Cart from "../../../assets/cart.png";
import User from "../../../assets/user.png";
import Nav from "../head/nav";

function Header() {
  const [isOpenDropdown, setIsOpenDropDown] = useState(false);
  const headerRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      let position = window.pageYOffset;
      if (position > 100) {
        headerRef.current.classList.add("fixed");
      } else {
        headerRef.current.classList.remove("fixed");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="headerWrapper">
      <header ref={headerRef}>
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-sm-2">
              <div className="logo">
                <Link to="/">
                  <img src={Logo} alt="Logo" />
                </Link>
              </div>
            </div>
            <div className="col-sm-5 d-flex align-items-center">
              <Nav />
            </div>

            <div className="col-sm-5 d-flex justify-content-end align-items-center">
              <ul className="list-inline mb-0 headerTabs">
                <li className="list-inline-item">
                  <span>
                    <img src={Heart} alt="Heart" />
                    <span className="badge rounded-circle">3</span>
                  </span>
                </li>
                <li className="list-inline-item">
                  <span>
                    <img src={Cart} alt="Cart" />
                    <span className="badge rounded-circle">3</span>
                  </span>
                </li>
                <li className="list-inline-item">
                  <span onClick={() => setIsOpenDropDown(!isOpenDropdown)}>
                    <img src={User} alt="User" />
                  </span>
                  {isOpenDropdown && (
                    <ul className="dropDownMenu">
                      <li>
                        <button className="align-items-center">
                          My Account
                        </button>
                      </li>
                      <li>
                        <button>History</button>
                      </li>
                      <li>
                        <button>Settings</button>
                      </li>
                      <li>
                        <button>Log Out</button>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
