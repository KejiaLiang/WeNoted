import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';


function App() {

  return (
       <BrowserRouter>

            <Routes>

                <Route path='/' element={<LandingPage />} />

{/*
                <Route path='/about' element={<About />} />
                <Route path='/login' element={<Login />} />
                
                <Route path='/sign-up' element={<SignUp />} /> 
                
              
                */} 


            </Routes>

        </BrowserRouter>
    
  );
}

export default App;
