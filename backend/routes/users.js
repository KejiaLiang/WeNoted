const express = require('express');
const db = require('../db');
const router = express.Router();




//get username + email 
router.post('/getUser', async (req, res) => {
    try{
        //CHECK TICKET TO GET EMAIL
        const ticket = req.body.ticket; 

        const result = await db.query(
        'SELECT users.email, first_name, last_name FROM users JOIN tickets ON users.email = tickets.email WHERE tickets.ticket = ?',
        [ticket]
    );

        if (result.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        const email = result[0].email;
        const first_name = result[0].first_name;
        const last_name = result[0].last_name;

        res.send({
            'email': email,
            'first_name': first_name, 
            'last_name': last_name
        })

    }catch(error){
        console.error(error);
        res.status(500).json({
            error: 'Database error'
        });
    }


})









module.exports = router;