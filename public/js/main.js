const chatForm = document.getElementById('chat-form');
const chatMessagesDiv = document.querySelector('.chat-messages');
const roomName  = document.getElementById('room-name');
const usersList  = document.getElementById('users');

const socket = io();
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('joinRoom', {username, room});

socket.on('message', message => {
    console.log(message);
    displayMessage(message);

    // scroll down
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
});

socket.on('roomUsers', info => {
    displayRoomName(info.room);
    displayUsers(info.users);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.msg.value;

    // console.log(message);
    socket.emit('chatMessage', {message, username});

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

function displayMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    chatMessagesDiv.appendChild(div);
}

function displayRoomName(room){
    roomName.innerText = room;
}

function displayUsers(usersArr){
    usersList.innerHTML = `
        ${usersArr.map(user => `<li>${user.username}</li>`).join('')}
    `;

}