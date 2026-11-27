const express = require('express');
const path = require('path');
const multer = require('multer'); // to process files!
const db = require('../db');
const router = express.Router();




// Configure where uploaded files are stored
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// UPLOAD NOTES
router.post('/upload', upload.single('file'), async (req, res) => {
    //to do: delete pdf if ticket not valid? 
   
     try{
        //makes sure there is a file
        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded'
            });
        }
        //CHECK TICKET TO GET EMAIL
        const ticket = req.body.ticket; 

        const result = await db.query(
        'SELECT email FROM tickets WHERE ticket =?', [ticket]
    );

        if (result.length === 0) {
            return res.status(404).json({
                error: 'Ticket not found'
            });
        }

        //upload file
        const email=  result[0].email
        const file = req.file;
        const title = req.body.title;
        const course = req.body.course;
        const semester = req.body.semester;
        const description = req.body.description; 

        const uploadResult = await db.query(
            `INSERT INTO notes (title, course_id, semester, publisher_email, filepath, description)
             VALUES (?, ?, ?,  ?, ?,?)`,
              [title, course, semester, email, file.path, description]
        );

        const note_id = uploadResult.insertId.toString(); //get the note_ID from the inserted record

        res.json({
        note_id: note_id, 
        message: 'Successful'
    });
    
    }catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Database error'
        });
    }
    
});

// Get Saved Notes by Email
router.get('/saved-notes', async (req, res) => {
    try {
        const email = req.query.email;

        if (!email) {
            return res.status(400).json({
                error: 'Email Missing'
            });
        }

        const result = await db.query(`
            SELECT 
                n.note_id,
                n.title, 
                n.course_id, 
                n.semester, 
                n.publisher_email, 
                n.publish_time, 
                n.filepath, 
                n.description, 
                n.num_likes,
                s.save_time,
                u.first_name AS publisher_fname,
                u.last_name AS publisher_lname
            FROM notes n 
            INNER JOIN saves s ON n.note_id = s.note_id
            LEFT JOIN users u ON u.email = n.publisher_email
            WHERE s.email = ?
            `, 
            [email]
        );

        res.status(200).json(result);

    }catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Database error'
        });
    }
});








module.exports = router;