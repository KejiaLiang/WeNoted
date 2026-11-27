/*
Feature owner: Yuqing Zhou
This file reuses the note-card layout from Leon's Browse.jsx (between <section> and </section>). 
*/
import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import { Icon, NoteLayout, Reaction, Status } from '../../notes/NoteUI';
import { dateLabel, useNotes } from '../../notes/useNotes';
import './MyNotes.css';

function MyNotes(){
    const [course, setCourse] = useState("all courses");
    const [semester, setSemester] = useState("all semesters");
    const [sort, setSort] = useState("Most Recently Published");
    const [courseOptions, setCourseOptions] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [actionError, setActionError] = useState('');

    // TODO: replace this with a db call
    const {data, error, retry, update, handleError} = useNotes();
    
    // Set up course and semester options when the page loads
    useEffect(() => {
        async function loadOptions() {
            updateCourses();
            updateSemesters();
        }
        loadOptions();
    }, []);

    // Get from the database the courses that my notes have
    //  + an "all courses" option. 
    // Subjected to selected semester. 
    function getCourseOptions(){
        // TODO: call db
        const courses = ["Comp307"];
        const noSelection = ["All Courses"];
        return [...noSelection, ...courses];
    }

    // Get from the database the semesters that my notes have
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

    const myNotes = (data || [])
        .filter(note =>
            (course === "all courses" ||
                note.course.toLowerCase() === course) &&
            (semester === "all semesters" ||
                note.semester.toLowerCase() === semester)
        )
        .sort((a, b) => {
            // TODO: split this into 2 cases based on input
            return Date.parse(b.published) - Date.parse(a.published);
        });

    return(
        <div className='whole-page'>
            <NoteLayout>

            <div className='content'>
                <header>
                    <h1>My Notes</h1>
                    {data && (
                        <p role="status">
                            You have published {myNotes.length} {myNotes.length === 1 ? 'note' : 'notes'}:
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

                    {!data ? (
                            <Status error={error} retry={retry} />
                        ) : myNotes.length === 0 ? (
                            <div className="status">
                                <h2>No notes found</h2>
                            </div>
                        ) : (
                            <div className='grid'>
                                {myNotes.map(note => {
                                    const detail = '/note-page?id=' + encodeURIComponent(note.id);

                                    return (
                                        <article className="card" key={note.id}>
                                            <Link to={detail} className="card-link">
                                                <div className="thumb">
                                                    {note.previewUrl
                                                        ? <img src={note.previewUrl} alt="" />
                                                        : <span>PDF</span>
                                                    }
                                                </div>

                                                <div className="card-body">
                                                    <p className="course">
                                                        {note.course} · {note.semester}
                                                        {note.section && ' · ' + note.section}
                                                    </p>

                                                    <h2>{note.title}</h2>

                                                    <p className="meta">
                                                        {note.author} · {dateLabel(note.published)}
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
                                                    aria-label={note.commentCount + ' comments on ' + note.title}
                                                >
                                                    <Icon name="comment" />
                                                    {note.commentCount}
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