const { createServer } = require("http");
const express = require('express');

const { Server } = require("socket.io");
const connect = require('./config/db');
const { authenticate } = require("./middleware");
const { socketConnection } = require("./controllers/socket.controller");
const path = require("path");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"]
    }
});


connect()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
    next()
})
app.use(express.json())

// static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api", require('./routes/login'))



io.use((socket, next) => {
    const token = socket.handshake.query.token;
    let user = authenticate(token)
    if (user) {
        socket.user = user
        next();
    } else {
        socket.emit("invalid_User")
        console.log(user,"haroish")
        new Error('Authentication error')
    }
});

io.on('connection', socketConnection(io));


const PORT = process.env.PORT;
httpServer.listen(PORT, (err) => {
    if (err) console.log("Error in starting app", err);
    else console.log("Server started at", PORT);

});
