import {Link} from 'react-router-dom';
import './PublicNav.css';
import Logo from './Logo'

function PublicNav() {
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
            
            
        
        </nav>

    );

}

export default PublicNav;