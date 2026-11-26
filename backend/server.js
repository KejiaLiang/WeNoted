const express = require('express');
const path = require('path');


const app = express(); 
const PORT = 3000; 

app.use(express.json());

//Import routes
const notesRoutes = require('./routes/notes');
const userRoutes = require('./routes/users');

//register routes
app.use('/api/notes', notesRoutes); 
app.use('/api/auth', userRoutes); 


//serve react 
const buildpath = path.join(__dirname, '../frontend/dist');
app.use(express.static(buildpath));

//serve react app to user
app.get("/{*splat}", (req,res) => {
    res.sendFile(path.join(buildpath, "index.html"));
})





//start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
})




