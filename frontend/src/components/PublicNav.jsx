import {Link} from 'react-router-dom';
import './PublicNav.css';
import Logo from './Logo'

function PublicNav() {

    function toggleMenu(menuId){
        const menu = document.getElementById(menuId);
        
        menu.classList.toggle('active');
    }
    return ( 

        <nav className='navbar'>

            <a href='/#landing-page' ><Logo /> </a>

            <div className='navbar-links'> 
                <a className='hover-underline' href='/#how-it-works'>How it works</a>
                <div className='auth-links'> 
                    <Link className='login-button' to='/login'>Login</Link>
                    <Link className='sign-up-button-nav' to='/sign-up'>Sign up</Link>
                </div>
            </div>
            
            <div className='public-navbar-hamburger' onClick={() => toggleMenu('public-navbar-side-menu')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>

            </div>
            <div className='public-navbar-side-menu' id='public-navbar-side-menu'>
                <Link className='sign-up-side-menu' to='/sign-up'>Sign up</Link>
                <Link to='/login'>Login</Link>
                <hr></hr>
                <Link to='/about'>About</Link>
                <a href='/#how-it-works' onClick={() => toggleMenu('public-navbar-side-menu')}>How it works</a>
            </div>
            
        
        </nav>

    );

}

export default PublicNav;