const { registerUser, sendPrivateMessage, unregisterUser, getAllMsgs, changeChat } = require("../services/socket.service");


const socketConnection = (io) => (socket) => {

    console.log('A user connected', socket.id);

    socket.on('register', (username) => {
        const { users, currentUser } = registerUser(socket.id, socket.user);
        console.log('emitting register event')
            socket.emit("register", currentUser)
            io.emit('user-list', users);
    });

    socket.on('change-chat', async (id) => {
        const chatDetails = await changeChat(socket.id, id);
        console.log("change chat ", chatDetails)
        socket.emit('change-user-chat', chatDetails);
    });

    socket.on('private-message', ({ recipientId, message }) => {

        console.log("private msg", message)
        console.log("private msg to", recipientId)
        console.log("private msg from", socket.id)
        sendPrivateMessage(socket, recipientId, message);
    });


    socket.on('getAll-messages', () => {
        getAllMsgs(socket);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        const users = unregisterUser(socket.id);
        io.emit('user-list', users);

    });
}

module.exports = { socketConnection };
