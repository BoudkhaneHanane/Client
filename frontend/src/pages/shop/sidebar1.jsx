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

  return (
    <div className="sidebar">
      <div className="card border-0  shadow">
        <h4>Category</h4>
        <div className="catList">
          <div className="catItem d-flex align-items-center">
            <h5 className="mb-0 ml-3 mr-3">Arrivals</h5>
            <span className="d-flex align-items-center justify-content-center rounded-circle ml-auto">
              30
            </span>
          </div>
          <div className="catItem d-flex align-items-center">
            <h5 className="mb-0 ml-3 mr-3">Desktop Computers</h5>
            <span className="d-flex align-items-center justify-content-center rounded-circle ml-auto">
              30
            </span>
          </div>
          <div className="catItem d-flex align-items-center">
            <h5 className="mb-0 ml-3 mr-3">Gaming laptops</h5>
            <span className="d-flex align-items-center justify-content-center rounded-circle ml-auto">
              30
            </span>
          </div>
          <div className="catItem d-flex align-items-center">
            <h5 className="mb-0 ml-3 mr-3">Laptops / Notebooks</h5>
            <span className="d-flex align-items-center justify-content-center rounded-circle ml-auto">
              30
            </span>
          </div>
          <div className="catItem d-flex align-items-center">
            <h5 className="mb-0 ml-3 mr-3">PC Components</h5>
            <span className="d-flex align-items-center justify-content-center rounded-circle ml-auto">
              30
            </span>
          </div>
          <div className="catItem d-flex align-items-center">
            <h5 className="mb-0 ml-3 mr-3">Peripherals</h5>
            <span className="d-flex align-items-center justify-content-center rounded-circle ml-auto">
              30
            </span>
          </div>
          <div className="catItem d-flex align-items-center">
            <h5 className="mb-0 ml-3 mr-3">Portable Systems</h5>
            <span className="d-flex align-items-center justify-content-center rounded-circle ml-auto">
              30
            </span>
          </div>
          <div className="catItem d-flex align-items-center">
            <h5 className="mb-0 ml-3 mr-3">Predesigned Computers</h5>
            <span className="d-flex align-items-center justify-content-center rounded-circle ml-auto">
              30
            </span>
          </div>
          <div className="catItem d-flex align-items-center">
            <h5 className="mb-0 ml-3 mr-3">Server & Workstation Systems</h5>
            <span className="d-flex align-items-center justify-content-center rounded-circle ml-auto">
              30
            </span>
          </div>
          <div className="catItem d-flex align-items-center">
            <h5 className="mb-0 ml-3 mr-3">Server Workstation Systems</h5>
            <span className="d-flex align-items-center justify-content-center rounded-circle ml-auto">
              30
            </span>
          </div>
          <div className="catItem d-flex align-items-center">
            <h5 className="mb-0 ml-3 mr-3">Uncategorized</h5>
            <span className="d-flex align-items-center justify-content-center rounded-circle ml-auto">
              30
            </span>
          </div>
        </div>
      </div>

      <div className="card border-0  shadow">
        <h4>Filter by</h4>
        <Slider
          min={0}
          step={1}
          max={500000}
          getAriaLabel={() => "Temperature range"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          color="secondary"
        />
        <div className="d-flex pt-2 pb-2 priceRange">
          <span>
            From:<strong className="text-success">{value[0]}DA</strong>
          </span>
          <span className="ml-auto">
            From:<strong className="text-success">{value[1]}DA</strong>
          </span>
        </div>
        <div className="filters">
          <h5>Brand</h5>
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
          <Button className="btn btn-g">
            <FiFilter />
            Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
