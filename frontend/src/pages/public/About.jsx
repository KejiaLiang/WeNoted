import {Link} from 'react-router-dom';
import './About.css'
import PublicNav from '../../components/PublicNav'; 
import Footer from '../../components/Footer';

function About(){

    return(
        <div className='whole-page'>
            <PublicNav/>

            <div className='main-content'>
                {/* write here*/}
            
            </div>

            
            <Footer/>
        </div>
    );
}


export default About;