/*
Feature owner: Yuqing Zhou
Reused the note-card layout from Leon's Browse.jsx (between <section> and </section>). 
Reused getCredentials() from Kejia's PrivateNav.jsx. 
(reusage was after debugging and/or modifications)
*/
import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {Icon, NoteLayout, Reaction, Status} from '../../notes/NoteUI';
import {dateLabel, useNotes} from '../../notes/useNotes';
import './SavedNotes.css';

function SavedNotes(){
    const [course, setCourse] = useState("all courses");
    const [semester, setSemester] = useState("all semesters");
    const [sort, setSort] = useState("Most Recently Saved");
    const [courseOptions, setCourseOptions] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [actionError, setActionError] = useState('');
    const [email, setEmail] = useState('');

    const [data, setData] = useState([]);
    
    // Set up course and semester options when the page loads
    useEffect(() => {
        async function loadOptions() {
            try {
            const userEmail = await getCredentials();
            getSavedNotes(userEmail);
            updateCourses();
            updateSemesters();
            } catch (error) {
            console.error(error);
            setActionError(error.message);
        }
        }
        loadOptions();
    }, []);

    // Get the user's email
    async function getCredentials(){
        const ticket= '123';

        const response = await fetch('/api/auth/getUser', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ticket})
        })

        if (!response.ok){
            throw new Error(`Auth failed: ${response.status}`);
        }

        const user = await response.json();

        setEmail(user.email);

        return email;
    }

    // Get all saved notes
    async function getSavedNotes(email) {
        const response = await fetch(`/api/notes/saved-notes?email=${encodeURIComponent(email)}`, {
            method: 'GET',
        })

        if (!response.ok){
            throw new Error(`Failed to get saved notes: ${response.status}`);
        }

        const notes = await response.json();

        return notes;
    }

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
        const noSelection = ["All Semesters"];
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

    // Update course options according to the semester selected
    async function updateCourses(){
        const courses = await getCourseOptions();
        setCourseOptions(courses);
    }

    // Update semester options according to the course selected
    async function updateSemesters(){
        const semesters = await getSemesterOptions();
        setSemesterOptions(semesters);
    }

    async function handleCourseChange(course){
        setCourse(course);
        updateSemesters();
    }

    async function handleSemesterChange(semester){
        setSemester(semester);
        updateCourses();
    }

    function onReaction(updated, kind) {
        setActionError('');
        update(updated, kind);
    }

    function onReactionError(error) {
        setActionError(handleError(error));
    }

    const savedNotes = (data || [])
        .filter(note =>
            (course === "all courses" ||
                note.course.toLowerCase() === course_id) &&
            (semester === "all semesters" ||
                note.semester.toLowerCase() === semester)
        )
        .sort((a, b) => {
        if (sort === "Most Recently Saved") {
            return Date.parse(b.save_time) - Date.parse(a.save_time);
        }

        if (sort === "Most Recently Published") {
            return Date.parse(b.publish_time) - Date.parse(a.publish_time);
        }

        return 0;
        });
    
    // TODO: handle likes and comments

    return(
        <div className='whole-page'>
            <NoteLayout>

            <div className='content'>
                <header>
                    <h1>Saved Notes</h1>
                    {data && (
                        <p role="status">
                            {savedNotes.length} {savedNotes.length === 1 ? 'note' : 'notes'} saved:
                        </p>
                    )}
                </header>

                <div className='filters-and-notes'>
                <aside className="saved-notes-filters">
                    <h2>Filters</h2>

                    <div className='field'>
                    <label>Course</label>
                    <select name="course" value={course} onChange={(e) => {handleCourseChange(e.target.value);}}>
                        {listCourses()}
                    </select>
                    </div>
                    <div className='field'>
                    <label>Semester</label>
                    <select name="semester" value={semester} onChange={(e) => {handleSemesterChange(e.target.value);}}>
                        {listSemesters()}
                    </select>
                    </div>
                    <div className='field'>
                    <label>Sort By</label>
                    <select name="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="Most Recently Saved">Most Recently Saved</option>
                        <option value="Most Recently Published">Most Recently Published</option>
                    </select>
                    </div>
                </aside>

                <section aria-label="display-notes" className="display-notes">
                    {actionError && <p role="alert">{actionError}</p>}

                    {!data ? (
                            <Status error={error} retry={retry} />
                        ) : savedNotes.length === 0 ? (
                            <div className="status">
                                <h2>No saved notes found</h2>
                            </div>
                        ) : (
                            <div className='grid'>
                                {savedNotes.map(note => {
                                    const detail = '/note-page?id=' + encodeURIComponent(note.note_id);

                                    return (
                                        <article className="card" key={note.note_id}>
                                            <Link to={detail} className="card-link">
                                                <div className="thumb">
                                                    {note.previewUrl
                                                        ? <img src={note.previewUrl} alt="" />
                                                        : <span>PDF</span> // TODO: fix thumbnail
                                                    }
                                                </div>

                                                <div className="card-body">
                                                    <p className="course">
                                                        {note.course_id} · {note.semester}
                                                    </p>

                                                    <h2>{note.title}</h2>

                                                    <p className="meta">
                                                        {note.publisher_fname} {note.publisher_lname} · {dateLabel(note.publish_time)}
                                                    </p>
                                                </div>
                                            </Link>

                                            <div className="card-actions">
                                                <Reaction
                                                    kind="like"
                                                    compact
                                                    note={note}
                                                    onUpdate={onReaction}
                                                    onError={onReactionError}
                                                />

                                                <Link
                                                    to={detail + '#comments'}
                                                    className="action compact"
                                                    aria-label={'Comments on ' + note.title}
                                                >
                                                    <Icon name="comment" />
                                                </Link>

                                                <Reaction
                                                    kind="save"
                                                    compact
                                                    note={note}
                                                    onUpdate={onReaction}
                                                    onError={onReactionError}
                                                />
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                </section>
                </div>
            </div>

            </NoteLayout>
        </div>
        
    );
}

export default SavedNotes;