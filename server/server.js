const path = require('path');
const http = require('http')
const express = require('express');
const SocketIO = require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utils/message.js');
const {isRealString,validateSelectedRoom,toLowerCase} = require('./utils/validation.js');
const {Users} = require('./utils/users.js');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = SocketIO(server);
let users = new Users();


//on(event, callback function) listen for an event
//example 'connection' is an event
io.on('connection',(socket) =>{
    console.log("New user connected");

    //EXAMPLE
    //emit => creates an event
    //specifies the same event name that is in client side
    //pass data to client using an object
    // socket.emit('newEmail',{
    //     from:" kristimita@gmail.com",
    //     text:"hello",
    //     createdAt: 123
    // });
    //here we specifie another event.this one listen for the client to call the event
    //the client will pass the data that will be in the newEmail object below
    // socket.on("createEmail", (newEmail) =>{
    //     console.log("Create Email",newEmail);
    // });

    socket.on('disconnect',() =>{ //disconnect is the event
        console.log("Client Disconnected");
        let user = users.removeUser(socket.id);
        let roomList = users.getAllRooms();
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit("newMessage",generateMessage("Admin",`${user.name} has left.`));
            //when a client is disconected we update the room list in the index.html
            // this is done because it can be the last client on a room
            // and it need to remove the room name from the select box
            io.emit("sendRooms",roomList);
        }
    });


    //Chat APP EVENT (Server creates the event,send to client)
    socket.on('join',(params,callback) =>{
        //convert room names to lowerstring
        let room = toLowerCase(params.room);
        let selectedRoom = toLowerCase(params.roomList);
        let username = params.name;
        if(!isRealString(username)){
            return callback("Name is required");
        }
        if(!isRealString(room)){
            if(!validateSelectedRoom(selectedRoom)){
                return callback("Please enter a room or select one.The entered room has priority over the selected room");
            }
            else{
                room = selectedRoom;
            }
        }
        if(users.checkUsername(username,room)){
            return callback("This username already exists for this room");
        }
        //when the user joins the room,remove if it has been previous
        users.removeUser(socket.id);
        //add the user to the users array
        users.addUser(socket.id,username,room);
        //the client will join a specifik room
        socket.join(room);//socket.leave(room name) => leaves a room

        //io.emit() => send the message to all connected clients
        //socket.broadcast.emit => send the message to all users expect the one who send it
        //socket.emit() => emits an event to a specific users
        io.to(room).emit("updateUserList",users.getUserList(room));
        socket.emit("newMessage",generateMessage("Admin","Welcome to Chat App"));
        socket.broadcast.to(room).emit("newMessage",generateMessage("Admin",`${username} has joined.`));
        callback();
    });

    socket.on("createMessage",(message,callback) => {
        //get the currenct user by socket id
        let user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
        }
        callback();
    });

    socket.on('createLocationMessage',(coords)=>{
        let user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longtitude));
        }
    });

    // get the name of all room available in chat
    // it is used for the dropdown in index.html
    // socket.on("getRooms",(callback) => {
    //     let roomList = users.getAllRooms();
    //     if(roomList.length > 0){
    //         callback(false,roomList);
    //     }
    //     else{
    //         callback("No Rooms Found",false);
    //     }
    // });
    socket.on("getRooms",()=>{
        let roomList = users.getAllRooms();
        socket.emit("sendRooms",roomList);
    });
    
});

app.use(express.static(publicPath));//app.use => per te perdorur middleware

server.listen(port,() =>{
    console.log(`Server is up at port ${port}`);
});
