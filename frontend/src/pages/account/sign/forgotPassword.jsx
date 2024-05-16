import React, { useState } from 'react';
import axios from 'axios';
import './forgot.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3002/check-email', { email });

      if (response.data.exists) {
        setEmailExists(true);
      } else {
        setEmailExists(false);
        setMessage('Cet e-mail n\'existe pas dans nos enregistrements.');
      }
    } catch (error) {
      setMessage('Erreur lors de la vérification de l\'e-mail.');
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!newPassword) {
        setMessage('Veuillez entrer un nouveau mot de passe.');
        return;
      }

      const resetResponse = await axios.post('http://localhost:3002/forgot-password', { email, newPassword });

      if (resetResponse.data.success) {
        setSuccessMessage('Mot de passe réinitialisé avec succès.');
        setMessage('');
        setNewPassword('');
      } else {
        setMessage('Erreur lors de la réinitialisation du mot de passe.');
      }
    } catch (error) {
      setMessage('Erreur lors de la réinitialisation du mot de passe.');
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
      {message && <p className="danger-alert">{message}</p>}
      {successMessage && <div className="success-alert">{successMessage}</div>}
      {emailExists && (
        <>
          <label>
            New Password:
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </label>
          <br />
          <button type="button" onClick={handleResetPassword}>Réinitialiser le mot de passe</button>
        </>
      )}
    </form>
  );
};

export default ForgotPassword;
