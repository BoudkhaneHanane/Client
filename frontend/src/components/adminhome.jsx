import React from 'react';

import SidBar from './sidbar';
import NavAdmin from './navadmin';
import './adminhome.css';

const AdminHome = () => {
    return(
        <div className='home'>
            <SidBar/>
            
            <div className='homecontainer'>
                <NavAdmin/>
               
            </div>


        </div>

    )

}

export default AdminHome