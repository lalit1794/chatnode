const users = [];

function addUser(id, username, room){
    const user = {id, username, room};

    users.push(user);

    return user;
}

function currentUser(id){
    return users.find(user => user.id === id);
}

function removeUser(id){
    const idx = users.findIndex(user => user.id === id);

    if(idx != -1){
        return users.splice(idx, 1);
    }
}

function fetchRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    addUser,
    currentUser,
    removeUser,
    fetchRoomUsers
};