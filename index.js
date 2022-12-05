//consts
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver);

const {Users} = require('./users');
let users = new Users();
const gamedirectory = path.join(__dirname, "html");

//Tells the app to use the main html (index.html)
app.use(express.static(gamedirectory));

//list of rooms and usernames
var rooms = [];
var usernames = [];

//sets the server to listen to port 3000
httpserver.listen(3000);


//When a person connects to the website
io.on('connection', function(socket){
  


//Tells console and chat when someone joins, also lets a person connect to a room
  socket.on("join", function(room, username){
    if (username != "" && room != "" && username != " " && username != "  " && username != "   " && username != "    "){
      rooms[socket.id] = room;
      usernames[socket.id] = username;
      
      var randomgreetingmessage = ["Welcome " + username + " to " + room + "!", "Say 'Hi!' to " + username + ".", username + " hopped in!", "Hope " + username + " brought pizza!", username + " wanted to join " + room + " ...and did!", " A user named " + username + " joined!", username + " walked into " + room + " on accident.", username + " checked into the wrong room with the name " + room + ".", username + " thought they were going to see a play, but all they got to see was " + room + ".", "Please don't die " + username + " because you are required to be in " + room + " for a while."]
      socket.leaveAll();
      socket.join(room);
      io.in(room).emit("recieve", "Server: " + randomgreetingmessage[Math.floor(Math.random() * randomgreetingmessage.length)]);
      socket.emit("join", room);
      console.warn(username + " Joined: " + room)
    }
    users.removeUser(socket.id);
    users.addUser(socket.id, username, room);
      
      io.to(room).emit('updateUsersList', users.getUserList(room));
    console.warn(users);
    console.warn(rooms);
  })

  //When someone sends a message emit recieve
  socket.on("send", function(message){
    io.in(rooms[socket.id]).emit("recieve", usernames[socket.id] +" : " + message);

    
    
  })

  //Puts the mess that was sent in chat
  socket.on("recieve", function(message){
    socket.emit("recieve", message);
  })

//Tell console and chat when someone leaves with the disconnected button, also disconnects a person from a server
socket.on("leave", function(room, username) {
    
var randomleftmessages = [usernames[socket.id] + " left.", usernames[socket.id] + " walked out of " + rooms[socket.id] + ".", usernames[socket.id] + " didn't want to be in " + rooms[socket.id] + ".", "The user " + usernames[socket.id] + " for some reason wanted to leave " + rooms[socket.id] + ".", "We are all sad to see " + usernames[socket.id] + " leave " + rooms[socket.id] + "."]
 io.in(rooms[socket.id]).emit("recieve", "Server: " + randomleftmessages[Math.floor(Math.random() * randomleftmessages.length)]); 
      console.warn(usernames[socket.id] + " Left: " + rooms[socket.id])
    users.removeUser(socket.id);
    io.to(rooms[socket.id]).emit('updateUsersList', users.getUserList(rooms[socket.id]));
        rooms[socket.id] = room;
        usernames[socket.id] = username;
    
    socket.leaveAll();
    
            
     io.to(rooms[socket.id]).emit('updateUsersList', users.getUserList(rooms[socket.id]));
    
  });

  
})


//Tell console and chat when someone disconnects
io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    var randomdisconnectedmessages = [usernames[socket.id] + " Disconnected.", usernames[socket.id] + "'s internet went out.", usernames[socket.id] + " closed the window.", usernames[socket.id] + " refreshed themself.", usernames[socket.id] + " didn't have a good enough connection to be here today."]
    console.warn(usernames[socket.id] + " disconnected from " + rooms[socket.id])
    io.in(rooms[socket.id]).emit("recieve", "Server: " + randomdisconnectedmessages[Math.floor(Math.random() * randomdisconnectedmessages.length)]); 
    users.removeUser(socket.id);
    io.to(rooms[socket.id]).emit('updateUsersList', users.getUserList(rooms[socket.id]));
  });
});

