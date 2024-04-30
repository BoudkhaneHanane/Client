import React from "react";
import Banner1 from "../assets/pic2.jpg";
import "./banner.css";

function Banner() {
  return (
    <div className="bannerSection">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div className="box">
              <img src={Banner1} className="w-100 transition" />
            </div>
          </div>
          <div className="col">
            <div className="box">
              <img src={Banner1} className="w-100 transition" />
            </div>
          </div>
          <div className="col">
            <div className="box">
              <img src={Banner1} className="w-100 transition" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
