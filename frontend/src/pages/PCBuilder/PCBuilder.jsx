import React, { useState } from "react";
import { Link } from "react-router-dom";
import buildpc from "../../assets/buildPC.webp";
import intel from "../../assets/intel.png";
import AMD from "../../assets/AMD.png";
import "./PCBuilder.css";

function PCBuilder({ onSelectProcessor }) {
  const [selectedProcessor, setSelectedProcessor] = useState("");

  const handleProcessorSelect = (processor) => {
    setSelectedProcessor(processor);
    onSelectProcessor(processor);
  };

  return (
    <div className="home-container">
      <div className="blue-bar"></div>
      <div className="cadre">
        <div className="image-container">
          <img src={buildpc} alt="CPU" />
        </div>
        <h1>You Design It, We'll Build It!</h1>
        <p>{/* Your paragraph text */}</p>
        <div>
          <h1 className="choose">Make Your Choice</h1>
          <div className="choice row">
            <img
              src={intel}
              alt="intel"
              onClick={() => handleProcessorSelect("Intel")}
            />
            <img
              src={AMD}
              alt="AMD"
              onClick={() => handleProcessorSelect("AMD")}
            />
          </div>
          <Link to={`/listbuild/${selectedProcessor}`}>Next</Link>
        </div>
      </div>
    </div>
  );
}

export default PCBuilder;
