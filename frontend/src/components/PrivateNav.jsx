import {Link} from 'react-router-dom';
import './PrivateNav.css';
import Logo from './Logo'


function PrivateNav(){
    function toggleSideMenu(){
        const menu = document.getElementById('private-navbar-side-menu');
        
        menu.classList.toggle('private-navbar-side-menu');
    }

    return(
        <nav className='navbar'>
            <div className='private-navbar-links'> 
                <Link to='/' ><Logo /> </Link> {/* Change to /browse */}

                <div className='private-links-content full-navbar'>
                    <Link to='/browse'>Browse</Link>
                    <Link to='/upload'>Upload </Link>
                    <Link to='/saved-notes'>Saved Notes</Link>
                    <Link to='/my-notes'>My Notes</Link>
                </div>

            
            </div>
            <div className='profile full-navbar' > 
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    </svg>
                    {/*<Link className='log-out-nav' to='/'>Logout</Link>*/}
            </div>

            {/*HAMBURGER*/}
           
            <div className='private-navbar-hamburger' onClick={toggleSideMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>

            </div>
            <div className='' id='private-navbar-side-menu'>
                <Link to='/browse'>Browse</Link>
                <Link to='/upload'>Upload </Link>
                <Link to='/saved-notes'>Saved Notes</Link>
                <Link to='/my-notes'>My Notes</Link>
                {/*<Link>Profile</Link>*/}
                <Link class='logout-navbar-side-menu' to='/'>Log Out</Link>
            </div>
            
        
        </nav>
    );
}

export default PrivateNav;