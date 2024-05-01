import React from "react";
import "./nav.css";
import Button from "@mui/material/Button";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <div className="nav">
      <div className="container-fluid ">
        <div className="menu">
          <nav>
            <ul className="list list-inline">
              <li className="list-inline-item">
                <Button>
                  <Link to="/">Home</Link>
                </Button>
              </li>
              <li className="list-inline-item">
                <Button>
                  <Link>About</Link>
                </Button>
              </li>
              <li className="list-inline-item">
                <Button>
                  <Link>Contact</Link>
                </Button>
              </li>
              <li className="list-inline-item">
                <Button>
                  <Link to="/Shop">
                    Shop
                    <KeyboardArrowDownOutlinedIcon />
                  </Link>
                </Button>
                <div className="dropdown_menu">
                  <ul>
                    <li>
                      <Button>
                        <Link to="/">Pc Components</Link>
                        <KeyboardArrowRightOutlinedIcon />
                      </Button>
                      <div className="second_menu">
                        <ul>
                          <li>
                            <Button>
                              <Link to="/">Computer Cases</Link>
                            </Button>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">CPU's / Processors</Link>
                              <KeyboardArrowRightOutlinedIcon />
                            </Button>
                            <div className="third_menu">
                              <ul>
                                <li>
                                  <Button>
                                    <Link to="/">Intel CPUs</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">AMD CPUs</Link>
                                  </Button>
                                </li>
                              </ul>
                            </div>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">Memory</Link>
                              <KeyboardArrowRightOutlinedIcon />
                            </Button>
                            <div className="third_menu">
                              <ul>
                                <li>
                                  <Button>
                                    <Link to="/">DDR3</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">DDR4</Link>
                                  </Button>
                                </li>
                              </ul>
                            </div>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">Moterboards</Link>
                              <KeyboardArrowRightOutlinedIcon />
                            </Button>
                            <div className="third_menu">
                              <ul>
                                <li>
                                  <Button>
                                    <Link to="/">Intel Mtherboards</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">AMD Motherboards</Link>
                                  </Button>
                                </li>
                              </ul>
                            </div>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">Optical Drives</Link>
                              <KeyboardArrowRightOutlinedIcon />
                            </Button>
                            <div className="third_menu">
                              <ul>
                                <li>
                                  <Button>
                                    <Link to="/">CD / DVD Drives</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">Blu-Ray Burners</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">External Drives</Link>
                                  </Button>
                                </li>
                              </ul>
                            </div>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">PC Cooling</Link>
                              <KeyboardArrowRightOutlinedIcon />
                            </Button>
                            <div className="third_menu">
                              <ul>
                                <li>
                                  <Button>
                                    <Link to="/">Case Fans</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">CPU Air Coolers</Link>
                                  </Button>
                                </li>
                              </ul>
                            </div>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">Power Supplies</Link>
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li>
                      <Button>
                        <Link to="/">Desktop Computers</Link>
                      </Button>
                    </li>
                    <li>
                      <Button>
                        <Link to="/">Portable systems</Link>
                        <KeyboardArrowRightOutlinedIcon />
                      </Button>
                      <div className="second_menu">
                        <ul>
                          <li>
                            <Button>
                              <Link to="/">Gaming Laptops</Link>
                            </Button>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">Laptops / Notebooks</Link>
                            </Button>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">Mobile Workstations</Link>
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li>
                      <Button>
                        <Link to="/">Server & Workstation Systems</Link>
                      </Button>
                    </li>
                    <li>
                      <Button>
                        <Link to="/">Peripherals</Link>
                        <KeyboardArrowRightOutlinedIcon />
                      </Button>
                      <div className="second_menu">
                        <ul>
                          <li>
                            <Button>
                              <Link to="/">Gaming Accessories</Link>
                            </Button>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">
                                Headsets, Speakers & SoundCards
                              </Link>
                            </Button>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">Keyboards & Mice</Link>
                              <KeyboardArrowRightOutlinedIcon />
                            </Button>
                            <div className="third_menu">
                              <ul>
                                <li>
                                  <Button>
                                    <Link to="/">Gaming Keyboards</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">Gaming Mice</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">Keyboards</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">Mice</Link>
                                  </Button>
                                </li>
                              </ul>
                            </div>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">Monitors</Link>
                              <KeyboardArrowRightOutlinedIcon />
                            </Button>
                            <div className="third_menu">
                              <ul>
                                <li>
                                  <Button>
                                    <Link to="/">Gaming Monitors</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">LCD / LED Monitors</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">Touch Screen Monitors</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">Monitor Accesories</Link>
                                  </Button>
                                </li>
                              </ul>
                            </div>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">Power Protection</Link>
                              <KeyboardArrowRightOutlinedIcon />
                            </Button>
                            <div className="third_menu">
                              <ul>
                                <li>
                                  <Button>
                                    <Link to="/">Power Distribution Unit</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">power Inverters</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">UPS</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">UPS Accesories</Link>
                                  </Button>
                                </li>
                              </ul>
                            </div>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">Printers / Scanners & Supplies</Link>
                              <KeyboardArrowRightOutlinedIcon />
                            </Button>
                            <div className="third_menu">
                              <ul>
                                <li>
                                  <Button>
                                    <Link to="/">Barcode Scanner</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">Inkjet Printers</Link>
                                  </Button>
                                </li>
                                <li>
                                  <Button>
                                    <Link to="/">Laser Printers</Link>
                                  </Button>
                                </li>
                              </ul>
                            </div>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">Printer Ink & Toner</Link>
                            </Button>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">Projectors</Link>
                            </Button>
                          </li>
                          <li>
                            <Button>
                              <Link to="/">Webcams</Link>
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="list-inline-item">
                <Button>
                  <Link>
                    Build PC
                    <KeyboardArrowDownOutlinedIcon />
                  </Link>
                </Button>
                <div className="dropdown_menu">
                  <ul>
                    <li>
                      <Button>
                        <Link to="/">INTEL Configurator</Link>
                      </Button>
                    </li>
                    <li>
                      <Button>
                        <Link to="/">AMD Configurator</Link>
                      </Button>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="list-inline-item">
                <Button>
                  <Link>Pre-Built PC</Link>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
export default Nav;
