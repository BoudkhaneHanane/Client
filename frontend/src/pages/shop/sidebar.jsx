import React from "react";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import { FiFilter } from "react-icons/fi";

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

  return (
    <div className="sidebar">
      <div className="card border-0  shadow">
        <h4>Category</h4>
        <div className="catList">
          {/* Mapping through categories to render each category item */}
          {categories.map((category, index) => (
            <div key={index} className="catItem">
              <h5>{category}</h5>
              <span className="rounded-circle">30</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-0  shadow">
        <h4>Filter by</h4>
        <h5>Price:</h5>
        <Slider
          className="slider"
          min={0}
          step={1}
          max={500000}
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
            From:<strong className="text-success">{value[1]}DA</strong>
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
        <div className="d-flex">
          <button>
            <FiFilter />
            Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
