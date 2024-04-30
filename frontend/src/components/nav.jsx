import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { VscAccount } from 'react-icons/vsc';
import { Link } from 'react-router-dom';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DashboardIcon from '@mui/icons-material/Dashboard'; // Ajout de l'icône du tableau de bord
import './navadmin.css';

const NavAdmin = () => {
    return (
        <div className='navbar'>
            <div className='wrapper'>
                <div className='items'>
                    <div className='item'>
                        <NotificationsNoneIcon className='icon' />
                        <div className='counter'>1</div>
                    </div>
                </div>
                <div className='items'>
                    <div className='item'>
                        <ChatBubbleOutlineIcon className='icon' />
                        <div className='counter'>2</div>
                    </div>
                </div>
                <div className='admin'>
                    <div className='admini'>
                        <Link to={'/admin'} className="adminicon">
                            <VscAccount className="counter" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavAdmin;
