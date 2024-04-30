import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
 
import { store } from './redux/store.js'
import { logout, reset } from './features/auth/authSlice'; 


import create_btn from './images/create.png'
import logout_btn from './images/logout.png'
import profile_btn from './images/profile.png'
import explore_btn from './images/explore.png'

const Navbar = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    }

    return (
        <div className='navbar'>
            <h1>Udemy</h1>
            <div className='links'> 
                <a href='/explore'><div className='links-second'><img src={explore_btn} alt='navbar'></img></div></a>
                <a href='/create'><div className='links-third'><img src={create_btn} alt='navbar'></img></div></a>
                <a href= {`/profile/${store.getState().auth.user.user_id}`}><div className='links-fifth'><img src={profile_btn} alt='navbar'></img></div></a>
                <div className='links-last'  onClick={onLogout}><button className='logout' onClick={onLogout}><img src={logout_btn} alt='navbar'></img></button></div>

            </div>

            
        </div>
    );
}
 
export default Navbar;