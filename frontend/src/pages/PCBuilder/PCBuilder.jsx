import React, { useState } from "react";
import { Link } from "react-router-dom";
import buildpc from "../../assets/buildPC.webp";
import intel from "../../assets/intel.png";
import AMD from "../../assets/AMD.png";
import "./PCBuilder.css"; // Import the CSS file

function PCBuilder() {
  const [choice, setChoice] = useState(null);

  const handleChoice = (chosen) => {
    setChoice(chosen);
  };

  return (
    <div className="home-container">
      <div className="blue-bar"></div>
      <div className="cadre">
        <div className="image-container">
          <img src={buildpc} alt="CPU" />
        </div>
        <h1>You Design It, We'll Build It!</h1>
        <p>
          Having trouble locating the perfect fit among our suggested PC
          selections? Craft your ideal system tailored precisely to your
          specifications through our state-of-the-art PC customizer, and leave
          the rest to us. We'll expertly assemble and rigorously test your
          personalized build, ensuring it meets our stringent quality standards,
          all backed by a comprehensive 3-Year Warranty. Should you desire
          further customization beyond what's available or encounter any hurdles
          in assembling your dream rig, reach out to us at contact
          @www.chinformatique.dz or dial (+213) 023 34 80 86. We're dedicated to
          bringing your vision to life, exactly as you envision it.
        </p>
        <div>
          <h1 className="choose">Make Your Choice</h1>
          <div className="choice row">
            <img
              src={intel}
              alt="intel"
              onClick={() => handleChoice("Intel")}
            />
            <img src={AMD} alt="AMD" onClick={() => handleChoice("AMD")} />
          </div>
          {choice && (
            <Link to={`/nextpage/${choice}`}>
              <button>Next</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default PCBuilder;
