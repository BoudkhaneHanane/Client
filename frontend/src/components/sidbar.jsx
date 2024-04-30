import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { FaChevronDown, FaChevronUp, FaUserPlus, FaLock, FaShoppingCart, FaFolder, FaTag } from 'react-icons/fa';
import { Person as PersonIcon, Store as StoreIcon } from '@mui/icons-material';
import logo from "./photo/logo .jpeg"; // Assurez-vous que le chemin est correct
import './sidbar.css';

const SideBar = () => {
  const [accordionStates, setAccordionStates] = useState({
    users: false,
    commands: false,
    products: false,
    categories: false,
    promotions: false,
    admin: false
  });

  const toggleAccordion = (section) => {
    setAccordionStates({ ...accordionStates, [section]: !accordionStates[section] });
  };

  return (
    <div className="sidebar"> 
        <div className="brand-link">
            <img src={logo} alt="Logo de l'entreprise" className="logo" /> 
            <span className="brand-text">Chinformatique</span>
        </div>
        <div className="accordion-section">
            <div>
                <Link to={'/adminhome'} className="sidebar-link">
                <DashboardIcon className="textes" />
                <span className='textes'>Dashbord</span>
                </Link>
            </div>
          </div>    
      <div className="accordion-section">
        <p className="title" onClick={() => toggleAccordion('users')}>
          Gestion des utilisateurs {accordionStates.users ? <FaChevronUp className='text'/> : <FaChevronDown className='text'/>}
        </p>
        <div className={`accordion-content ${accordionStates.users ? 'open' : ''}`}>
            <div>
                <Link to={'/users'} className="sidebar-link">
                <PersonIcon className="textes" />
                <span className='textes'>Users</span>
                </Link>
            </div>
            <div>
                <Link to={'/account'} className="sidebar-link">
                <FaUserPlus className="textes" />
                <span className='textes'>Requests Account</span>
                </Link>
            </div>
            <div>
                <Link to={'/listebloque'} className="sidebar-link">
                <FaLock className="textes" />
                    <span className='textes'>Block user accounts</span>
                </Link>
            </div>
        </div>
      </div>

      {/* Accordéon Gestion des commandes */}
      <div className="accordion-section">
        <p className="title" onClick={() => toggleAccordion('commands')}>
          Gestion des commandes {accordionStates.commands ? <FaChevronUp className='text'/> : <FaChevronDown className='text'/>}
        </p>
        <div className={`accordion-content ${accordionStates.commands ? 'open' : ''}`}>
          <div>
            <Link to={'/order'} className="sidebar-link">
            <FaShoppingCart className="textes" />
            <span className='textes'>Orders</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Accordéon Gestion des produits */}
      <div className="accordion-section">
        <p className="title" onClick={() => toggleAccordion('products')}>
          Gestion des produits {accordionStates.products ? <FaChevronUp className='text'/> : <FaChevronDown className='text'/>}
        </p>
        <div className={`accordion-content ${accordionStates.products ? 'open' : ''}`}>
          <div>
            <Link to={'/products'} className="sidebar-link">
              <StoreIcon className="textes" />
              <span className='textes'>Products</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Accordéon Gestion des catégories */}
      <div className="accordion-section">
        <p className="title" onClick={() => toggleAccordion('categories')}>
          Gestion des catégories {accordionStates.categories ? <FaChevronUp className='text'/> : <FaChevronDown className='text'/>}
        </p>
        <div className={`accordion-content ${accordionStates.categories ? 'open' : ''}`}>
          <div>
            <Link to={'/categorie'} className="sidebar-link">
              <FaFolder className="textes" />
              <span className='textes'>Catégories</span>
            </Link>
          </div>
          <div>
            <Link to={'/subcategorie'} className="sidebar-link">
              <FaFolder className="textes" />
               <span className='textes'>Sub Catégories</span>
            </Link>
          </div>
          <div>
            <Link to={'/subsubcategorie'} className="sidebar-link">
              <FaFolder className="textes" />
               <span className='textes'>Sub Sub Catégories</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Accordéon Gestion des promotions */}
      <div className="accordion-section">
        <p className="title" onClick={() => toggleAccordion('promotions')}>
          Gestion des promotions {accordionStates.promotions ? <FaChevronUp className='text'/> : <FaChevronDown  className='text'/>}
        </p>
        <div className={`accordion-content ${accordionStates.promotions ? 'open' : ''}`}>
          <div>
            <Link to={'/promotions'} className="sidebar-link">
              <FaTag className="textes" />
              <span className='textes'>Promotion </span>
            </Link>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default SideBar;




