import {Link} from 'react-router-dom';
import './PublicNav.css';
import Logo from './Logo'

function PublicNav() {

    function toggleSideMenu(){
        const menu = document.getElementById('public-navbar-side-menu');
        
        menu.classList.toggle('public-navbar-side-menu');
    }
    return ( 

        <nav className='navbar'>

            <Link to='/' ><Logo /> </Link>

            <div className='navbar-links'> 
                <Link to='/about'>About</Link>
                <a href='/#how-it-works'>How it works</a>
                <div className='auth-links'> 
                    <Link className='login-button' to='/login'>Login</Link>
                    <Link className='sign-up-button-nav' to='/sign-up'>Sign up</Link>
                </div>
            </div>
            
            <div className='public-navbar-hamburger' onClick={toggleSideMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>

            </div>
            <div className='' id='public-navbar-side-menu'>
                <Link class='sign-up-side-menu' to='/sign-up'>Sign up</Link>
                <Link to='/login'>Login</Link>
                
                <Link to='/about'>About</Link>
                <a href='/#how-it-works' onClick={toggleSideMenu}>How it works</a>
            </div>
            
        
        </nav>

    );

}

export default PublicNav;