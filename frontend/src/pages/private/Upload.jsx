import {Link} from 'react-router-dom';
import {useState} from 'react';
import PrivateNav from '../../components/PrivateNav'; 
import Footer from '../../components/Footer';
import './Upload.css';

function Upload(){

    //right fct set left var
    const [dragOver, setDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);
    const [successfulMessage, setSuccessfulMessage] = useState(null);


    function showAlert(message){
        setAlertMessage(message); 

        setTimeout(() => {
            setAlertMessage(null);
        }, 2000); // reset after 2 sec
    }

    function showSuccessfulMessage(message){
        setSuccessfulMessage(message); 

        setTimeout(() => {
            setSuccessfulMessage(null);
        }, 2000); // reset after 2 sec
    }
    
    function handleDragOver(event){
        event.preventDefault();
        setDragOver(true); 
    }

    function handleDragLeave(event){
        event.preventDefault();
        setDragOver(false);
    }
    
    function handleDrop(event){
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        const maxSize = 10 * 1024 *1024; 

        setDragOver(false);

         //input validation
        if (!file.name.toLowerCase().endsWith('.pdf')){
            showAlert('Please select a PDF file.')
            return;
        }

        if(file.size > maxSize){
            showAlert('The file cannot exceed 10MB.')

            return;
        }
        setSelectedFile(file);
        showSuccessfulMessage('File successfully added');
        
        
    }

    function clickBrowseFile(){
        document.getElementById('input-file').click(); //Have other button click on the actual button. Namely to have control over styling & displaying file when dragging and dropping
    }

    function handleFileChange(event){
        const file = event.target.files[0];
        const maxSize = 10 * 1024 *1024; 
        
        //input validation
        if (!file.name.toLowerCase().endsWith('.pdf')){
            showAlert('Please select a PDF file.')
            return;
        }

        if(file.size > maxSize){
            showAlert('The file cannot exceed 10MB.')

            return;
        }
        
        setSelectedFile(file);
        showSuccessfulMessage('File successfully added');
    }

    function formatFileSize(bytes){
        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + " KB";
        }

        return (bytes / (1024 *1024)).toFixed(3) + " MB";
    }

    //upload
    async function handleUpload(event){
        event.preventDefault();
        if (!selectedFile){
                    showAlert('Missing File');
                    return;
                }

        const formData = new FormData(event.target);

        formData.append("file", selectedFile); //add to form
        // all input will be accessible as  req.body.title, req.body.semester,..etc but file is accessed as: req.file
       
        //send to server
        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData
        })

    }


    return(
        <div className='whole-page'>
            <PrivateNav/>

            <div className='main-content upload-page'>
                <form className='upload-container' onSubmit={handleUpload}>
                    <h2>Upload a note</h2>

                    <label>Title</label>
                    <input name='title' className='upload-title-input' type='text' placeholder='e.g. Comp307 Lecture 5: Flexbox' required/>

                    <div className='upload-academic-data'>
                        <div className='upload-academic-data-component'>
                            <label>Course</label>
                            <select name='course' required>
                                <option value="" disabled selected>Select course</option>
                                <option value="comp307">comp307</option>

                            </select>
                        </div>

                        <div className='upload-academic-data-component'>
                            <label>Semester</label>
                            <select name='semester' required>
                                <option value="" disabled selected>Select semester</option>
                                <option value="fall2026">Fall 2026</option>
                            </select>
                        </div>
                        
                    </div>

                    <label >Description (optional)</label>
                    

                    <textarea className='upload-description-textarea'></textarea>

                    <label>PDF file</label>

                    {/*drop-zone and if dragOver is true, then add drag-over to className, else dont add */}
                    <div className={`drop-zone ${dragOver ? "drag-over" : ""}`} 
                        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                        
                        {/*error message */}
                        {alertMessage && (
                            <div className='upload-file-error'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                                </svg>  {alertMessage}
                            
                           </div>
                        )}

                        {/*Successfully added msg */}
                        {successfulMessage && (
                            <div className='upload-file-success'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                </svg>  {successfulMessage}
                            
                           </div>
                        )}

                        <svg className='upload-svg' xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z"/>
                        </svg>
                        <p>Drag your PDF here or</p>
                        <input className='input-file' id='input-file' type='file' onChange={handleFileChange} accept='.pdf'/>
                        
                        <button type='button' className="browse-file-button" onClick={clickBrowseFile}>Browse Files</button>

                        {/*If there is a selected file then display, else dont display */}
                        {selectedFile && (
                            <div className='selected-file'><p>{selectedFile.name}</p><p>{formatFileSize(selectedFile.size)}</p>  </div>
                        )}

                        {!selectedFile && (
                            <div className='no-selected-file'><p>No File Selected</p></div>
                        ) }
                        
                    </div>

                    
                    <p className='upload-restrictions'>PDF only, maximum 10MB</p>

                    <div className='upload-action-buttons'>
                        <Link to='/browse'><button className='upload-cancel-btn' type='button'>Cancel</button></Link>
                        <button className='upload-btn' type='submit'>Upload</button>
                    </div>

                </form>

            </div>

            
            <Footer/>
        </div>
        
    );
}

export default Upload;