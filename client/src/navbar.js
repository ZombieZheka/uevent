import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
 
import { store } from './redux/store.js'
import { logout, reset } from './features/auth/authSlice'; 


import create_btn from './images/create.png'
import logout_btn from './images/logout.png'
import profile_btn from './images/profile.png'
import home_btn from './images/home.png'
import explore_btn from './images/explore.png'

const Navbar = (props) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }


    const [notifPopup, setNotifPopup] = useState(false);
    const {user} = useSelector((state)=> state.auth)


    useEffect(()=>{
        if(notifPopup){
            fetch(`http://localhost:4000/dash/user/notif/${user.user_id}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer: '+ store.getState().auth.user.accessToken}
            }).then((response)=>{
                response.json().then((body)=>{
                    console.log(body)
                })
            })
        }
    }, [notifPopup])

    const handleRedirect = (e) => {
        console.log(e.target.getAttribute('id'))
        setNotifPopup(false)
        if(props.handleRerender){
            props?.handleRerender(true);
        }
        navigate(`/profile/${e.target.getAttribute('id')}`)
    }

    const handleClear = () => {
        fetch(`http://localhost:4000/dash/user/notif/${user.user_id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer: '+ store.getState().auth.user.accessToken},
            body: JSON.stringify({id: user.user_id})
        }).then(()=>{
            setNotifPopup(false)
        })
    }

    return (
        <div className='navbar'>
            <h1>Udemy</h1>
            <div className='links'> 
                <a href='/'><div className='links-first'><img src={home_btn} alt='navbar'></img></div></a>
                <a href='/explore'><div className='links-second'><img src={explore_btn} alt='navbar'></img></div></a>
                <a href='/create'><div className='links-third'><img src={create_btn} alt='navbar'></img></div></a>
                <a href= {`/profile/${store.getState().auth.user.user_id}`}><div className='links-fifth'><img src={profile_btn} alt='navbar'></img></div></a>
                <div className='links-last'  onClick={onLogout}><button className='logout' onClick={onLogout}><img src={logout_btn} alt='navbar'></img></button></div>

            </div>

            
        </div>
    );
}
 
export default Navbar;