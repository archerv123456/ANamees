var socket;
var usernameInput;
var chatIDInput;
var messageInput;
var currentName;
var chatRoom;
var dingSound;
var userSpace;
var messages = [];
var members = [];
var delay = true;
var randomColor = Math.floor(Math.random()*16777215).toString(16);
let result = ' ';

//Starts when the HTML loads
function onload(){
  socket = io();
  usernameInput = document.getElementById("NameInput");
  chatIDInput = document.getElementById("IDInput");
  messageInput = document.getElementById("ComposedMessage");
  currentName = document.getElementById("CurrentName");
  chatRoom = document.getElementById("RoomID");
  dingSound = document.getElementById("Ding");
  userSpace = document.getElementById("User");

  
  //Changes the connected room name to the room and handles adding the user to the users list
  socket.on("join", function(room, username){
    chatRoom.innerHTML = "Connected Room: " + room;
  let ol = document.createElement('ol');

  users.forEach(function (user) {
    let li = document.createElement('li');
    li.innerHTML = user;
    ol.appendChild(li);
  });

  let usersList = document.querySelector('#users');
  usersList.innerHTML = "";
  usersList.appendChild(ol);
  })

//When a message is sent put it in chat
  socket.on("recieve", function(message){
    console.warn(message);
    if (messages.length < 30){
      messages.push(message);
      dingSound.volume = 0.15;
      dingSound.play();
    }
    else{
      messages.shift();
      messages.push(message);
    }
    for (i = 0; i < messages.length; i++){
        document.getElementById("Message"+i).innerHTML = messages[i];
        document.getElementById("Message"+i).style.color = "#ffffff";
    }
  })
//Updates user list
  socket.on('updateUsersList', function (users) {
  let ol = document.createElement('ol');

  users.forEach(function (user) {
    let li = document.createElement('li');
    li.innerHTML = user;
    ol.appendChild(li);
  });

  let usersList = document.querySelector('#users');
  usersList.innerHTML = "";
  usersList.appendChild(ol);
})
}

//Connects a user to the chatroom
function Connect(){
  socket.emit("join", chatIDInput.value, usernameInput.value);
  console.warn("joined");
}

//Disconnects a user from the chatroom
function Disconnect(){
  socket.emit("leave", usernameInput.value, chatIDInput.value);
  console.warn("left");
  chatRoom.innerHTML = "Connected Room: None";

}

//Gives a random name
function RandomName(){
  usernameInput = document.getElementById("NameInput");
  var randomname = ["Guest", "Guest1324", "RandomName", "Bonkers", "Cookies", "Dave", "Bob", "James", "Person", "NotABot1337", "TesterABC", "FunnyMan", "AllSkill", "AmongUs", "IAmSmart", "NotANoob", "SomeName", "Username", "Guy", "Man", "Furry", "Animal", "InsertNameHere", "GuyWithAVan"]
  usernameInput.value = (randomname[Math.floor(Math.random() * randomname.length)])
}

//Sends a message
function Send(){
  if (delay && messageInput.value.replace(/\s/g, "") != ""){
    delay = false;
    setTimeout(delayReset, 1000);
    socket.emit("send", messageInput.value);
    console.warn(messageInput.value);
    messageInput.value = "";
  }
}

function JoinMain1(){
  socket.emit("join", "Main1", usernameInput.value);
}

function JoinMain2(){
  socket.emit("join", "Main2", usernameInput.value);
}

function JoinMain3(){
  socket.emit("join", "Main3", usernameInput.value);
}

//Reset Delay
function delayReset(){
  delay = true;
}

