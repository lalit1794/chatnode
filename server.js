const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {addUser, currentUser, fetchRoomUsers, removeUser} = require('./utils/users');

const app = express();
const PORT = 3000 || process.env.PORT;
const server = http.createServer(app);
const io = socketio(server);
const botName = 'ChatNode Bot';

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// initiate new socket
io.on('connection', socket => {
    // console.log("new socket connection initiated");

    

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user){
            io.to(user[0].room).emit('message', formatMessage(botName,`${user[0].username} has left the chat`));

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: fetchRoomUsers(user.room)
            });
        }
        
    });

    socket.on('chatMessage', (msgObj) => {
        // console.log(message);
        const user = currentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msgObj.message));
    });

    socket.on('joinRoom', (obj) => {
        const user = addUser(socket.id, obj.username, obj.room);

        socket.join(user.room);

        socket.emit('message', formatMessage(botName, 'Welcome to chatnode'));

        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${obj.username} joined room ${obj.room}`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: fetchRoomUsers(user.room)
        });

    });
});

server.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));