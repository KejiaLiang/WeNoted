const express = require('express');
const db = require('../db');
const router = express.Router();

// Get course options for saved notes by email and selected semester
router.get('/getCoursesForSavedNotes', async (req, res) => {
    try {
        const email = req.query.email;
        const semester = req.query.semester;

        if (!email) {
            return res.status(400).json({
                error: 'Email Missing'
            });
        }

        if (!semester) {
            return res.status(400).json({
                error: 'Semester Missing'
            });
        }

        let result;

        if (semester === "all semesters") {
            result = await db.query(`
            SELECT DISTINCT n.course_id
            FROM notes n
            INNER JOIN saves s ON n.note_id = s.note_id
            WHERE s.email = ?
            `, 
            [email]
        );
        } else {
            result = await db.query(`
            SELECT DISTINCT n.course_id
            FROM notes n
            INNER JOIN saves s ON n.note_id = s.note_id
            WHERE s.email = ? AND n.semester = ?
            `, 
            [email, semester]
        );
        }

        res.status(200).json(result);

    }catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Database error'
        });
    }
});

// Get semester options for saved notes by email and selected course
router.get('/getSemestersForSavedNotes', async (req, res) => {
    try {
        const email = req.query.email;
        const course = req.query.course;

        if (!email) {
            return res.status(400).json({
                error: 'Email Missing'
            });
        }

        if (!course) {
            return res.status(400).json({
                error: 'Course Missing'
            });
        }

        let result;

        if (course === "all courses") {
            result = await db.query(`
            SELECT DISTINCT n.semester
            FROM notes n
            INNER JOIN saves s ON n.note_id = s.note_id
            WHERE s.email = ?
            `, 
            [email]
        );
        } else {
            result = await db.query(`
            SELECT DISTINCT n.semester
            FROM notes n
            INNER JOIN saves s ON n.note_id = s.note_id
            WHERE s.email = ? AND n.course_id = ?
            `, 
            [email, course]
        );
        }

        res.status(200).json(result);

    }catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Database error'
        });
    }
});

module.exports = router;