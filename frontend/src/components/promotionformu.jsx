import React, { useState } from 'react';
import axios from 'axios';
import './promotion.css';
import SidBar from './sidbar';
import Nav from './nav';

const PromotionForm = () => {
  const [promotionDetails, setPromotionDetails] = useState({
    Produit: 'ASUS X543UA', // Valeur fixe définie ici
    PrixNormal: '',
    PrixPromotion: '',
    Reduction: '',
    DateFinPromotion: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3002/add-promotion', promotionDetails);
      setPromotionDetails({
        Produit: 'ASUS X543UA', // Réinitialiser la valeur du produit à 'ASUS X543UA' après la soumission
        PrixNormal: '',
        PrixPromotion: '',
        Reduction: '',
        DateFinPromotion: ''
      });
    } catch (error) {
      console.error('Error adding promotion:', error);
    }
    console.log('Promotion Details:', promotionDetails);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotionDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  return (
    <div>
      <div className='home'>
        <SidBar />
        <div className='promotionformu'>
          <Nav />
          <div className='formupromotion'>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="Produit">Produit:</label>
                <input
                  type="text"
                  id="Produit"
                  name="Produit"
                  value={promotionDetails.Produit}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="PrixNormal">Prix Normal:</label>
                <input
                  type="number"
                  id="PrixNormal"
                  name="PrixNormal"
                  value={promotionDetails.PrixNormal}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="PrixPromotion">Prix Promotion:</label>
                <input
                  type="number"
                  id="PrixPromotion"
                  name="PrixPromotion"
                  value={promotionDetails.PrixPromotion}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="Reduction">Réduction:</label>
                <input
                  type="number"
                  id="Reduction"
                  name="Reduction"
                  value={promotionDetails.Reduction}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="DateFinPromotion">Fin Promotion:</label>
                <input
                  type="date"
                  id="DateFinPromotion"
                  name="DateFinPromotion"
                  value={promotionDetails.DateFinPromotion}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">Add Promotion</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionForm;
