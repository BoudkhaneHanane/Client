import React, { useState } from 'react';
import axios from 'axios';
import './forgot.css';
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
      } else {
        setMessage('This email does not exist in our records.');
      }
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      // Vérifier si newPassword est vide
      if (!newPassword) {
        setMessage('Veuillez entrer un nouveau mot de passe.');
        return;
      }
  
      const resetResponse = await axios.post('http://localhost:3002/forgot-password', { email, newPassword, type: 'user' });
  
      if (resetResponse.data.success) {
        setMessage(resetResponse.data.message);
        setNewPassword('');
      } else {
        setMessage('Une erreur est survenue lors de la réinitialisation du mot de passe.');
      }
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };
  

  return (
    <form className='formu' onSubmit={handleSubmit}>
      <h2>Forgot password</h2>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      {message && <p>{message}</p>}
      {emailExists  && (
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