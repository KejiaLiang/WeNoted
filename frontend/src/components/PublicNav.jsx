import {Link} from 'react-router-dom';
import './PublicNav.css';
import Logo from './Logo'

function PublicNav() {
    return ( 

        <nav className='navbar'>

            <Logo /> 

            <div className='navbar-links'> 
                <Link to='/about'>About</Link>
                <Link>How it works</Link>
                <div className='auth-links'> 
                    <Link className='login-button' to='/login'>Login</Link>
                    <Link className='sign-up-button-nav' to='/sign-up'>Sign up</Link>
                </div>
            </div>
            
            
        
        </nav>

    );

}

export default PublicNav;