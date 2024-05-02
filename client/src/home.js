<<<<<<< HEAD
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
const Home = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector((state)=> state.auth)

    const handleClick = () => {
        navigate('/signup')
    }

    return ( 
            <div className='homebody' id='homebody'>
                <div className='content'>
                    <h3>{`Are you bored at home?)`}</h3>
                    <h4>{`Do you want to have an interesting evening?)`}</h4>
                    <br></br>
                    <h1>So let's get started!</h1>
                    <button onClick={handleClick} className='get-started'> Sign Up!</button>
                    
                </div>
            </div>
            
    );
}
=======
import React from 'react';
import HomeTop from './home_top';

const Home = () => {

    return (  
        <div className="home">
            <HomeTop /> 
        </div>
    );
}

 
>>>>>>> main
export default Home;