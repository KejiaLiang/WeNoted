import {Link} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './PrivateNav.css';
import Logo from './Logo'
import { useNavigate } from 'react-router-dom';


function PrivateNav(){

    const navigate = useNavigate();


    const [email, setEmail] = useState(null);
    const [first_name, setFirstName] = useState(null);
    const [last_name, setLastName] = useState(null);

    //runs when loaded. if not authorized user, then will redirect to login
    useEffect(() => {
    getCredentials();
    }, []);

    function toggleMenu(menuId){
        const menu = document.getElementById(menuId);
        
        menu.classList.toggle('active');
    }

    //get email + name
    async function getCredentials(){
        //const ticket= localStorage.getItem('ticket'); ********************
        const ticket= '123';

        try {

        const response = await fetch('/api/auth/getUser', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ticket})
        })

        if (!response.ok){
            navigate('/login');
            return;
        }

        const user = await response.json();

        setEmail(user.email); 
        setFirstName(user.first_name);
        setLastName(user.last_name);
        }catch(error){
            console.error(error);
        }

    }


    async function logout(){

        
        //const ticket= localStorage.getItem('ticket'); ********************
        const ticket= '123';
        try{
            const response = await fetch('/api/auth/logout', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ticket})
        })

            if (!response.ok){
                throw new Error(`Logout failed: ${response.status}`);
            }

            localStorage.removeItem('ticket');

            navigate('/');
        }catch(error){
            console.error(error);
        }
        


    }
    

    return(
        <nav className='navbar'>
            <div className='private-navbar-links'> 
                <Link to='/browse' ><Logo /> </Link> {/* Change to /browse */}

                <div className='private-links-content full-navbar'>
                    <Link to='/browse'>Browse</Link>
                    <Link to='/upload'>Upload </Link>
                    <Link to='/saved-notes'>Saved Notes</Link>
                    <Link to='/my-notes'>My Notes</Link>
                </div>

            
            </div>
            {/*Toggles both menus so that if changing size when menu is opened, will stay opened but with different options*/}

            <div className='profile full-navbar' id='profile' onClick={() => {toggleMenu('profile-menu'); toggleMenu('private-navbar-side-menu');} }> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    </svg>
                    {/*<Link className='log-out-nav' to='/'>Logout</Link>*/}
            </div>

            {/*Mainly to logout */}
            <div className='profile-menu' id='profile-menu'>
            
                <div className='navbar-credentials'>
                    <h2>{first_name} {last_name}</h2>
                    <p>{email}</p>
                </div>
                <hr></hr>
                <Link className='logout-navbar-profile-menu'  to='/'  onClick={(event) => {event.preventDefault(); logout();}}>Log Out</Link>

            </div>

            {/*HAMBURGER*/}
           
            <div className='private-navbar-hamburger' onClick={() => {toggleMenu('profile-menu'); toggleMenu('private-navbar-side-menu');}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>

            </div>
            <div className='private-navbar-side-menu' id='private-navbar-side-menu'>
                <div className='navbar-credentials'>
                    <h2>{first_name} {last_name}</h2>
                    <p>{email}</p>
                </div>
                <hr></hr>
                <Link to='/browse'>Browse</Link>
                <Link to='/upload'>Upload </Link>
                <Link to='/saved-notes'>Saved Notes</Link>
                <Link to='/my-notes'>My Notes</Link>
                <hr></hr>
                               
                <Link className='logout-navbar-side-menu' to='/'  onClick={(event) => {event.preventDefault(); logout();}}>Log Out</Link>
            </div>
            
        
        </nav>
    );
}

export default PrivateNav;