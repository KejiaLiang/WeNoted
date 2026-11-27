/*
Feature owner: Yuqing Zhou
This file reuses the note-card layout from Leon's Browse.jsx (between <section> and </section>). 
*/
import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {Icon, NoteLayout, Reaction, Status} from '../../notes/NoteUI';
import {dateLabel, useNotes} from '../../notes/useNotes';
import './MyNotes.css';

function MyNotes(){
    const [course, setCourse] = useState("all courses");
    const [semester, setSemester] = useState("all semesters");
    const [sort, setSort] = useState("Most Recently Published");
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
            await getMyNotes(userEmail);
            await updateCourses(userEmail, "all semesters");
            await updateSemesters(userEmail, "all courses");
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

        return user.email;
    }

    // Get all my notes
    async function getMyNotes(email) {
        const response = await fetch(`/api/notes/my-notes?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            cache: 'no-store'
        })

        if (!response.ok){
            throw new Error(`Failed to get my notes: ${response.status}`);
        }

        const notes = await response.json();

        setData(notes);

        return notes;
    }

    // Get from the database the courses that my notes have
    //  + an "all courses" option. 
    // Subjected to selected semester. 
    async function getCourseOptions(email, semester){
        const response = await fetch(`/api/courses-and-semesters/getCoursesForMyNotes?email=${encodeURIComponent(email)}&semester=${encodeURIComponent(semester)}`, {
            method: 'GET',
            cache: 'no-store'
        })

        if (!response.ok){
            throw new Error(`Failed to get course options: ${response.status}`);
        }

        const courses = await response.json();

        const noSelection = ["All Courses"];

        return [
        ...noSelection,
        ...courses.map(item => item.course_id)
        ];
    }

    // Get from the database the semesters that my notes have
    //  + an "all semesters" option.
    // Subjected to selected course.
    async function getSemesterOptions(email, course){
        const response = await fetch(`/api/courses-and-semesters/getSemestersForMyNotes?email=${encodeURIComponent(email)}&course=${encodeURIComponent(course)}`, {
            method: 'GET',
            cache: 'no-store'
        })

        if (!response.ok){
            throw new Error(`Failed to get course options: ${response.status}`);
        }

        const semesters = await response.json();

        const noSelection = ["All Semesters"];

        return [
        ...noSelection,
        ...semesters.map(item => item.semester)
        ];
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
    async function updateCourses(email, semester){
        try {
            const courses = await getCourseOptions(email, semester);
            setCourseOptions(courses);
        } catch (error) {
            setActionError(error.message);
        }
    }

    // Update semester options according to the course selected
    async function updateSemesters(email, course){
        try {
            const semesters = await getSemesterOptions(email, course);
            setSemesterOptions(semesters);
        } catch (error) {
            setActionError(error.message);
        }
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

    const myNotes = (data || [])
        .filter(note =>
            (course.toLowerCase() === "all courses" ||
                note.course_id.toLowerCase() === course.toLowerCase()) &&
            (semester.toLowerCase() === "all semesters" ||
                note.semester.toLowerCase() === semester.toLowerCase())
        )
        .sort((a, b) => {
        if (sort === "Most Liked") {
            return b.num_likes - a.num_likes;
        }

        if (sort === "Most Recently Published") {
            return Date.parse(b.publish_time) - Date.parse(a.publish_time);
        }

        return 0;
        });

    // TODO: handle likes and comments
    // TODO: page numbers and other formatting issues

    return(
        <div className='whole-page'>
            <NoteLayout>

            <div className='content'>
                <header>
                    <h1>My Notes</h1>
                    {data && (
                        <p role="status">
                            You have published {myNotes.length} {myNotes.length === 1 ? 'note' : 'notes'}
                        </p>
                    )}
                </header>

                <div className='filters-and-notes'>
                <aside className="my-notes-filters">
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
                        <option value="Most Recently Published">Most Recently Published</option>
                        <option value="Most Liked">Most Liked</option>
                    </select>
                    </div>
                </aside>

                <section aria-label="display-notes" className="display-notes">
                    {actionError && <p role="alert">{actionError}</p>}

                    {myNotes.length === 0 ? (
                            <div className="status">
                                <h2>No notes found</h2>
                            </div>
                        ) : (
                            <div className='grid'>
                                {myNotes.map(note => {
                                    const detail = '/note-page?id=' + encodeURIComponent(note.id);

                                    return (
                                        <article className="card" key={note_id}>
                                            <Link to={detail} className="card-link">
                                                <div className="thumb">
                                                    {note.previewUrl
                                                        ? <img src={note.previewUrl} alt="" />
                                                        : <span>PDF</span> // TODO: fix thumbnail
                                                    }
                                                </div>

                                                <div className="card-body">
                                                    <p className="course">
                                                        {note.course} · {note.semester}
                                                        {note.section && ' · ' + note.section}
                                                    </p>

                                                    <h2>{note.title}</h2>

                                                    <p className="meta">
                                                        {note.author} · {dateLabel(note.publish_time)}
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

export default MyNotes;