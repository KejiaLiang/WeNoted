import {Link} from 'react-router-dom';

import PrivateNav from '../../components/PrivateNav'; 
import Footer from '../../components/Footer';
import './SavedNotes.css';

function SavedNotes(){
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

export default SavedNotes;