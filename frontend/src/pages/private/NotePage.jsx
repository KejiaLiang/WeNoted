import {Link} from 'react-router-dom';

import PrivateNav from '../../components/PrivateNav'; 
import Footer from '../../components/Footer';
import './NotePage.css';

function NotePage(){
    return(
        <div className='whole-page'>
            <PrivateNav/>

            <div className='main-content'>
                {/* write here*/}

            </div>

            
            <Footer/>
        </div>
        
    );
}

export default NotePage;