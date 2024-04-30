import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import GridViewIcon from "@mui/icons-material/GridView";
import Sidebar from "./sidebar";
import Product from "../../components/product";
import "./shop.css";

const Shop = () => {
  const [isOpenDropDown, setIsOpenDropdown] = useState(false);
  return (
    <section className="listingPage">
      <div className="container-fluid">
        <div className="breadcrumb flex-column">
          <h1>Shop</h1>
          <ul className="list list-inline mb-0">
            <li className="list-inline-item">
              <Link to={"/"}>Home</Link>
            </li>
            <li className="list-inline-item">
              <Link to={"/shop"}>Shop</Link>
            </li>
            <li className="list-inline-item">
              <Link to={"/"}>PC</Link>
            </li>
          </ul>
        </div>
        <div className="listingData">
          <div className="row">
            <div className="col-md-3 sidebarWrapper">
              <Sidebar />
            </div>

            <div className="col-md-6 rightContent homeproducts pt-0">
              <div className="topStrip d-flex align-items-center">
                <div className="ml-auto d-flex align-items-center">
                  <div className="tab_ mb-2 ml-3 position-relative">
                    <Button
                      className="btn_"
                      onClick={() => setIsOpenDropdown(!isOpenDropDown)}
                    >
                      <GridViewIcon />
                      Sort by: Featured
                    </Button>
                    {isOpenDropDown !== false && (
                      <ul className="dropdownMenu">
                        <li>
                          <Button
                            className="align-items-center"
                            onClick={() => setIsOpenDropdown(false)}
                          >
                            Sort by: popularity
                          </Button>
                        </li>
                        <li>
                          <Button
                            className="align-items-center"
                            onClick={() => setIsOpenDropdown(false)}
                          >
                            Sort by: latest
                          </Button>
                        </li>
                        <li>
                          <Button
                            className="align-items-center"
                            onClick={() => setIsOpenDropdown(false)}
                          >
                            Sort by price: low to high
                          </Button>
                        </li>
                        <li>
                          <Button
                            className="align-items-center"
                            onClick={() => setIsOpenDropdown(false)}
                          >
                            Sort by price: high to low
                          </Button>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="productrow pl-4">
                <div className="item">
                  <Product />
                </div>
                <div className="item">
                  <Product />
                </div>
                <div className="item">
                  <Product />
                </div>
                <div className="item">
                  <Product />
                </div>
                <div className="item">
                  <Product />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;
