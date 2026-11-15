import './Logo.css';
import logo from '../assets/logo.png';

function Logo(){
    return(
        <div className='navbar-logo'>
                <img src={logo}></img>
                <h1>WeNoted</h1>
            </div>
    );
}

export default Logo; 