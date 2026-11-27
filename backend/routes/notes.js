const express = require('express');
const path = require('path');
const multer = require('multer'); // to process files!
const db = require('../db');
const router = express.Router();
const fs = require('fs');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB


// Configure where uploaded files are stored
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    }
});

//handle multer errors 
function handleUpload(req, res, next) {
    upload.single('file')(req, res, (err) => {

        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    error: 'File must be 10 MB or smaller'
                });
            }

            return res.status(400).json({
                error: 'File upload error'
            });
        }

        if (err) {
            return res.status(500).json({
                error: 'Upload failed'
            });
        }

        next();
    });
}

async function deleteUploadedFile(filePath) {
    if (filePath) {
        try {
            await fs.promises.unlink(filePath);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error('Could not delete uploaded file:', error);
            }
        }
    }
}

// UPLOAD NOTES
router.post('/upload', handleUpload, async (req, res) => {
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
            await deleteUploadedFile(req.file?.path); // ticket invalid, delete file

            return res.status(401).json({
                error: 'Unauthorized'
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

        // Delete uploaded file if something went wrong
        await deleteUploadedFile(req.file?.path);

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

// Get My Notes by Email
router.get('/my-notes', async (req, res) => {
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
                u.first_name AS publisher_fname,
                u.last_name AS publisher_lname
            FROM notes n
            INNER JOIN users u ON u.email = n.publisher_email
            WHERE u.email = ?
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