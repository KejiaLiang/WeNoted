import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import SignUp from './pages/public/SignUp';
import About from './pages/public/About';

import Browse from './pages/private/Browse';
import MyNotes from './pages/private/MyNotes';
import NotePage from './pages/private/NotePage';
import SavedNotes from './pages/private/SavedNotes';
import Upload from './pages/private/Upload';




function App() {

  return (
       <BrowserRouter>

            <Routes>

            {/* PUBLIC PAGES */} 

                <Route path='/' element={<Landing />} />
                <Route path='/login' element={<Login />} />
                <Route path='/sign-up' element={<SignUp />} /> 
                <Route path='/about' element={<About />} />
          
          
            {/* PRIVATE PAGES */} 
                <Route path='/upload' element={<Upload />} />
                <Route path='/browse' element={<Browse />} />
                <Route path='/my-notes' element={<MyNotes />} /> 
                <Route path='/saved-notes' element={<SavedNotes />} />
                <Route path='/note-page' element={<NotePage />} />


            </Routes>

        </BrowserRouter>
    
  );
}

export default App;
