import React from 'react';
import './sidbar.css';
import { Link } from 'react-router-dom'; 
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaChartLine } from 'react-icons/fa';
import { FaTag } from 'react-icons/fa';
import { FaFolder } from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa';

const SidBar = () => {
    return(
       <div className="sidbar">
            <div className='top'>
                <span className='logo'>Chinformatique</span>
            </div>
            <div className='center'>
    <ul>
        <p className='title'>Main</p>
        <div>
            <li>
                <DashboardIcon className='icon'/>
                <span>  Dashboard</span>
            </li>
            <li>
                <div>
                    <Link to={'/users'}>
                        <PersonIcon className='icon'/>
                        <span>  Users</span>
                    </Link>
                </div>
            </li>
        </div>
        <p className='title'>Lists</p>
        <div>
            <li>
                <div>
                    <Link to={'/account'}>
                        <FaUserPlus className='icon'/>
                        <span>  requests account</span>
                    </Link>
                </div>
            </li>
            <li>
                <FaShoppingCart className='icon'/>
                <span>  Orders</span>
            </li>
            <li>
                <LocalShippingIcon className='icon'/>
                <span>Delivery</span>
            </li>
            <li>
                <div>
                    <Link to={'/products'}>
                        <StoreIcon className='icon'/>
                        <span>Products</span>
                    </Link>
                </div>
            </li>
            <li>
                <div>
                    <Link to={'/categorie'}>
                        <FaFolder className='icon'/>
                        <span>Catégories</span>
                    </Link>
                </div>
            </li>
            <li>
                <div>
                    <Link to={'/subcategorie'}>
                        <FaFolder className='icon'/>
                        <span>Sub Catégories</span>
                    </Link>
                </div>
            </li>
            <li>
                <FaTag className='icon'/>
                <span>  Promotion</span>
            </li>
            <li>
                <FaChartLine className='icon'/>
                <span>  Stats</span>
            </li>
            <li>
                <FaSignOutAlt className='icon'/>
                <span>  Logout</span>
            </li>
        </div>
    </ul>
</div>
            <div className="buttom" >
                <div className='colorOption'></div>
                <div className='colorOption'></div>
            </div>
        </div>
    );

};

export default SidBar