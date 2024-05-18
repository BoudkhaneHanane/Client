import React from "react";
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import { FiFilter } from "react-icons/fi";
import "./shop.css";

function valuetext(value) {
  return `${value}°C`;
}
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Sidebar = () => {
  const [value, setValue] = React.useState([20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Array of category names
  const categories = [
    "Arrivals",
    "Desktop Computers",
    "Gaming laptops",
    "Laptops / Notebooks",
    "PC Components",
    "Peripherals",
    "Portable Systems",
    "Predesigned Computers",
    "Server & Workstation Systems",
    "Server Workstation Systems",
    "Uncategorized",
  ];

  // Array of values for each category
  const categoryValues = [15, 5, 8, 12, 0, 20, 0, 18, 11, 17, 10];

  return (
    <div className="sidebar">
      <div className="card border-0  shadow">
        <h4>Category</h4>
        <hr />
        <div className="catList">
          {categories.map((category, index) => (
            <div key={index} className="catItem">
              {category}
              <div className="rounded-circle">{categoryValues[index]}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card border-0  shadow">
        <h4>Filter by</h4>
        <hr />
        <h5>Price:</h5>
        <Slider
          className="slider"
          min={0}
          step={1}
          max={50000}
          getAriaLabel={() => "Temperature range"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
        />
        <div className="priceRange">
          <span>
            From:<strong className="text-success">{value[0]}DA</strong>
          </span>
          <span className="ml-auto">
            To:<strong className="text-success">{value[1]}DA</strong>
          </span>
        </div>
        <div className="filters">
          <h5>Brand:</h5>
          <ul>
            <li>
              <Checkbox {...label} />
              ASUS
            </li>
            <li>
              <Checkbox {...label} />
              Lenovo
            </li>
            <li>
              <Checkbox {...label} />
              Acer
            </li>
          </ul>
        </div>
        <button>
          <FiFilter />
          Filter
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
