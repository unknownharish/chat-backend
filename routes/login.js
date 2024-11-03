const express = require('express')
const userChatController = require('../controllers/userChat.controller')
const { uploadFile } = require('../utils')
const app = express()


// create
app.post('/register', userChatController.Register)

// login
app.post('/login', userChatController.Login)


// multer uploads
app.post('/upload', uploadFile.single('file'), (req, res) => {
    if (req.file) {
        res.json({ filePath: `/uploads/${req.file.filename}` }); 
    } else {
        res.status(400).send('No file uploaded.');
    }
});

module.exports = app