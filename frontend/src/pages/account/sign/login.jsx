import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./log.css";

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        formData
      );
      console.log(response.data);
      if (response.data.userType === "admin") {
        // Navigate to the admin page
        navigate("/adminhome");
      } else {
        // Pass nom and prenom upon successful login
        onLoginSuccess(response.data.nom, response.data.prenom);
        // Navigate to the home page
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      // Check if error response exists and set errors accordingly
      const errorMsg = error.response?.data || "An error occurred";
      setErrors(errorMsg);
    }
  };

  return (
    <div className="loginpage_flex">
      <div className="formDiv">
        <div className="containers">
          <h1>Sign In</h1>
          <hr />
        </div>
        <form onSubmit={handleSubmit} className="fromGrid">
          <div className="inputDev">
            <label htmlFor="email">Email</label>
            <span>
              <FaEnvelope className="icon" />
            </span>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <br />
          <div className="inputDev">
            <label htmlFor="password">Password</label>
            <span>
              <FaLock className="icon" />
            </span>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          {errors && <p className="error danger">{errors}</p>}
          <br />
          <button type="submit">Sign In</button>
          <br />
        </form>
        <div>
          Forgot your password? <Link to="/settings">Click here.</Link>
        </div>
        <div>
          Don't have an account?
          <Link to="/sign"> Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
