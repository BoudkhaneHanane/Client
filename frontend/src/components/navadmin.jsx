import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import './navadmin.css';

const NavAdmin = () => {
    return(
        <div  className='navbar'>
            <div className='wrapper'>
                <div className='search'>
                    <input type='text' placeholder='search...' />
                    <SearchIcon className='icon'/>
                </div>
                <div className='items'>
                    <div className='item'>
                       <LanguageIcon className='icon'/>
                       English
                    </div>
                </div>
                <div className='items'>
                    <div className='item'>
                       <DarkModeIcon className='icon'/>
                    </div>
                </div>
                <div className='items'>
                    <div className='item'>
                       <FullscreenIcon className='icon'/>
                    </div>
                </div>
                <div className='items'>
                    <div className='item'>
                       <NotificationsNoneIcon className='icon'/>
                       <div className='counter'>1</div>
                    </div>
                </div>
                <div className='items'>
                    <div className='item'>
                       <ChatBubbleOutlineIcon className='icon'/>
                       <div className='counter'>2</div>
                    </div>
                </div>
                <div className='items'>
                    <div className='item'>
                       <FormatListBulletedIcon className='icon'/>
                    </div>
                </div>
            </div>
        </div>

    )

}

export default NavAdmin