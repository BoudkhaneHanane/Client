import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3002/check-email', { email });
  
      if (response && response.data && response.data.exists) {
        setEmailExists(true);
        setMessage('Check your email');
      } else {
        setMessage('This email does not exist in our records.');
      }
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      const resetResponse = await axios.post('http://localhost:3002/forgot-password', { email, type: 'user' });

      if (resetResponse.data.success) {
        setMessage(resetResponse.data.message);
        setNewPassword('');
      } else {
        setMessage('An error occurred while resetting the password.');
      }
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      {message && <p>{message}</p>}
      {emailExists && message !== 'Check your email' && (
        <>
          <label>
            New Password:
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </label>
          <br />
          <button type="button" onClick={handleResetPassword}>Reset Password</button>
        </>
      )}
      
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ForgotPassword;