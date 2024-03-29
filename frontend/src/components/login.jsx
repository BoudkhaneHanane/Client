import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { AiOutlineSwapRight } from 'react-icons/ai';
import './style.css';



const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

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
        } catch (error) {
            console.error('Error:', error.response.data);
            // Afficher les erreurs dans le formulaire
            setErrors(error.response.data);
        }
    };

    return (
        <div>
            <div className='loginpage_flex'>
                <div className='formDiv'>
                    <div className='container_flex'>
                        <h2 className='title'> Login </h2>
                    </div>
                    <form onSubmit={handleSubmit} className='fromGrid'>
                        <div className='inputDev'>
                            <label htmlFor='email'> Email </label>
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
                            {/* Afficher l'erreur si elle existe */}
                            {errors.email && <p className='error'>{errors.email}</p>}
                        </div>
                        <br />
                        <div className='inputDev'>
                            <label htmlFor='password'>Password</label>
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
                            {/* Afficher l'erreur si elle existe */}
                            {errors.password && <p className='error'>{errors.password}</p>}
                        </div>
                        <br />
                        <Link to={'/'}>
                        <button type='submit' className='btnn'>
                            <span>Login</span>
                            <span>
                                <AiOutlineSwapRight className='icon' />
                            </span>
                        </button>
                        </Link>
                        <br />
                        <span className='forgotPassword'>
                            Forgot your password? <a href='/forgotPassword'>Click Here</a>
                        </span>
                    </form>
                    <div className='footerDiv_flex'>
                        <span className='text'>Don't have an account?</span>

                        <br />
                        <Link to={'/signRevendeur'}>
                        <button className='btn'> Sign Up Reseller</button>
                        </Link>

                        <Link to={'/adminhome'}>
                        <button className='btn'> ADMIN</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;