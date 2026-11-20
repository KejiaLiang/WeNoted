import {Link} from 'react-router-dom';

import PublicNav from '../../components/PublicNav'; 
import Footer from '../../components/Footer';
import './Landing.css';


function Landing() {
    return(
        <div className='whole-page'>
            {/*  Navigation bar*/}
            <PublicNav /> 

            {/*Main*/}
            <div className='main-content'>
                <div className='landing-container'>
                    <div className='left-landing-container'> 
                        <h1 className='landing-header'>Share your class notes with other McGill students</h1>
                        <p>Upload your notes as a PDF and find notes for your class and semester all in one place.</p>
                        <p>Note sharing has never been easier.</p>
                        <div className='sign-up-container'>
                            <Link to='/sign-up' className='sign-up-button-main'>Sign up with McGill email</Link>
                            <Link to='/login' className='login-button-main'>Login</Link>
                        </div>
                    </div>
                    <img className='main-image' src='/main_image.png'></img>
            
                    


                </div>
                
                {/*How it works*/}
                <div className='how-it-works-container' id='how-it-works'>
                    <h1>How it works</h1>
                    <div className='how-it-works-components'>

                        <div className='how-it-works-individual-component'>
                            <div className='component-circle'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z"/>
                                </svg>
                            </div>
                            <h3>Upload a PDF</h3>
                            <p>Share your notes with other students with one click.</p>
                        </div>

                        <div className='how-it-works-individual-component'>
                            <div className='component-circle'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                </svg>
                            </div>
                            <h3>Filter by class & semester</h3>
                            <p>Search the notes you need from specific courses and semesters.</p>
                        </div>

                        <div className='how-it-works-individual-component'>
                            <div className='component-circle'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                                </svg>
                            </div>
                            <h3>Like, comment, save</h3>
                            <p>Like helpful notes, ask questions in the comments, and save your favorites.</p>
                        </div>


                    </div>
                    </div>
            </div>

            <Footer/> 
        
        
        </div>
        


    );
}
export default Landing;
