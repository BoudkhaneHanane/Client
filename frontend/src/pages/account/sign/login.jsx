import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './style.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState('');

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
      const response = await axios.post('http://localhost:3002/login', formData);
      console.log(response.data);
      if (response.data.userType === 'admin') {
        // Rediriger vers la page d'administration
        window.location.href = '/adminhome';
      } else {
        // Rediriger vers la page de promotion
        window.location.href = '/promotion';
      }
    } catch (error) {
      console.error('Error:', error.response.data);
      setErrors(error.response.data);
    }
  };

  return (
    <div>
      <div className='loginpage_flex'>
        <div className='formDiv'>
          <form onSubmit={handleSubmit} className='fromGrid'>
          <h2 className='signupformu'> Login page </h2>
            <div className='inputDev'>
              <label htmlFor='email'> Email: </label>
              <span>
                <FaEnvelope className='icon' />
              </span>
              <input
                type='text'
                id='email'
                name='email'
                placeholder='Enter email'
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <br />
            <div className='inputDev'>
              <label htmlFor='password'>Password:</label>
              <span>
                <FaLock className='icon' />
              </span>
              <input
                type='password'
                id='password'
                name='password'
                placeholder='Password'
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            {errors && <p className='error danger'>{errors}</p>}
            <br />
            <button type='submit' className='bottonsignin'>
              <span className='bottonsignin'>Sign In</span>
            </button>
            <br />
            <span className='forgot'>
              Forgot your password? <a  href='/settings'>Click Here</a>
            </span>
          </form>
          <div className='footerDiv_flex'>
            <span className='texte'>Don't have an account?</span>
            <br />
            <Link to={'/sign'}>
              <button className='btn'> Sign Up </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
