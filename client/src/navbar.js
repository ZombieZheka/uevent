import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
<<<<<<< HEAD
import { useNavigate, useParams } from 'react-router';

=======
import { useNavigate } from 'react-router-dom';
 
>>>>>>> main
import { store } from './redux/store.js'
import { logout, reset } from './features/auth/authSlice'; 


import create_btn from './images/create.png'
import logout_btn from './images/logout.png'
import profile_btn from './images/profile.png'
<<<<<<< HEAD
import explore_btn from './images/explore.png'

const Navbar = () => {
    const profileID = store.getState().auth.user.user_id
    console.log(profileID)

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState(null);
    const [rerender, setRerender]  = useState();
    
    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    }

    useEffect(() => {
        fetch(`http://localhost:4000/dash/profile/${profileID}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer: '+ store.getState().auth.user.accessToken},
            body: JSON.stringify({user_id: store.getState().auth.user.user_id})
        }).then(response => {
            response.json().then((body)=>{
                setUserDetails(body.user)
                console.log(body.user)
                console.log(store.getState().auth.user.user_id)
            })
        })
    }, [profileID]); 

=======
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
>>>>>>> main

    return (
        <div className='navbar'>
            <h1>Udemy</h1>
            <div className='links'> 
<<<<<<< HEAD
                <a href='/explore'><div className='links-second'><img src={explore_btn} alt='navbar'></img></div></a>
                {userDetails && userDetails.user_emailConfirmed && (
    <a href='/create'><div className='links-third'><img src={create_btn} alt='navbar'></img></div></a>
)}
=======
                <a href='/'><div className='links-first'><img src={home_btn} alt='navbar'></img></div></a>
                <a href='/explore'><div className='links-second'><img src={explore_btn} alt='navbar'></img></div></a>
                <a href='/create'><div className='links-third'><img src={create_btn} alt='navbar'></img></div></a>
>>>>>>> main
                <a href= {`/profile/${store.getState().auth.user.user_id}`}><div className='links-fifth'><img src={profile_btn} alt='navbar'></img></div></a>
                <div className='links-last'  onClick={onLogout}><button className='logout' onClick={onLogout}><img src={logout_btn} alt='navbar'></img></button></div>

            </div>

            
        </div>
    );
}
 
export default Navbar;