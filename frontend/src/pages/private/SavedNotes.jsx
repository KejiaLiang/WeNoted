// Feature owner: Yuqing Zhou
// No AI used
import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import PrivateNav from '../../components/PrivateNav'; 
import Footer from '../../components/Footer';
import './SavedNotes.css';

function SavedNotes(){
    const [course, setCourse] = useState("All Courses");
    const [semester, setSemester] = useState("All Semesters");
    const [sort, setSort] = useState("Most Recently Saved");
    const [courseOptions, setCourseOptions] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    
    // Set up course and semester options when the page loads
    useEffect(() => {
        async function loadOptions() {
            const courses = await getCourseOptions();
            const semesters = await getSemesterOptions();
            
            setCourseOptions(courses);
            setSemesterOptions(semesters);
        }
        loadOptions();
    }, []);

    // Get from the database the courses that the saved notes have
    //  + an "all courses" option. 
    // Subjected to selected semester. 
    function getCourseOptions(){
        // TODO: call db
        const courses = ["Comp307"];
        const noSelection = ["All Courses"];
        return [...noSelection, ...courses];
    }

    // Get from the database the semesters that the saved notes have
    //  + an "all semesters" option.
    // Subjected to selected course.
    function getSemesterOptions(){
        // TODO: call db
        const semesters = ["Fall2026"];
        const noSelection = ["All Courses"];
        return [...noSelection, ...semesters];
    }

    // Create course options in html
    function listCourses(){
        const options = [];
        for (const course of courseOptions) {
            options.push(<option value={course.trim().toLowerCase()}>{course}</option>);
        }
        return options;
    }

    // Create semester options in html
    function listSemesters(){
        const options = [];
        for (const semester of semesterOptions) {
            options.push(<option value={semester.trim().toLowerCase()}>{semester}</option>);
        }
        return options;
    }

    return(
        <div className='whole-page'>
            <PrivateNav/>

            <div className='main-content'>
                <header>Saved Notes</header>
                <aside className="saved-notes-filters">
                    <h2>Filters</h2>
                    <label>Course</label>
                    <select name="course">
                        {listCourses()}
                    </select>
                    <br></br>
                    <label>Semester</label>
                    <select name="semester">
                        {listSemesters()}
                    </select>
                    <br></br>
                    <label>Sort By</label>
                    <select name="sort">
                        <option value="Most Recently Saved">Most Recently Saved</option>
                        <option value="Most Recently Published">Most Recently Published</option>
                    </select>
                </aside>
                {/*TODO*/}
            </div>

            
            <Footer/>
        </div>
        
    );
}

export default SavedNotes;