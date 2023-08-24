const socket = io();

const userNames = ['장시훈', '배찬용', '김태진'];

const randomUserName =
  userNames[Math.floor(Math.random() * userNames.length)] +
  Math.floor(Math.random() * 100).toString();

document.getElementById('UserName').innerHTML = randomUserName;

socket.emit('setUserName', randomUserName);

const roomUsers = {
  room1: document.getElementById('room1Users'),
  room2: document.getElementById('room2Users'),
};
const roomChatList = {
  room1: document.getElementById('room1-chat-list'),
  room2: document.getElementById('room2-chat-list'),
};
const roomChatContainer = {
  room1: document.getElementById('room1-chat-container'),
  room2: document.getElementById('room2-chat-container'),
};
const roomMessageInput = {
  room1: document.getElementById('room1-messageInput'),
  room2: document.getElementById('room2-messageInput'),
};

const inputMessageRoom1 = document.getElementById('room1-messageInput');
const inputMessageRoom2 = document.getElementById('room2-messageInput');

function joinRoom(room) {
  socket.emit('join', room);
}

function exitRoom(room) {
  if (!room) return;

  roomUsers[room].innerHTML = '';
  roomChatList[room].innerHTML = '';
  socket.emit('exit', room);
}

function sendRoomMessage(room) {
  const message = roomMessageInput[room].value;

  if (message.trim() !== '') {
    socket.emit('chatMessage', { message, room });
    roomMessageInput[room].value = '';
  }
}

socket.on('userList', ({ room, userList }) => {
  if (!room) return;

  const usersElement = roomUsers[room];
  usersElement.innerHTML = '';

  console.log({ room, userList });
  userList.forEach((userId) => {
    const p = document.createElement('p');
    p.textContent = userId;
    usersElement.appendChild(p);
  });
});

socket.on('userJoined', ({ userId, room }) => {
  const message = `${userId} joined the room.`;
  appendMessage(room, message);
});

socket.on('userLeft', ({ userId, room }) => {
  const message = `${userId} left the room.`;
  appendMessage(room, message);
});

socket.on('chatMessage', ({ userId, message, room }) => {
  appendMessage(room, `${userId} : ${message}`);
});

function appendMessage(room, message) {
  const chatList = roomChatList[room];
  const li = document.createElement('li');
  li.className = 'chat-item';
  const p = document.createElement('p');
  p.textContent = message;
  li.appendChild(p);
  chatList.appendChild(li);

  // 스크롤 아래로 이동
  roomChatContainer[room].scrollTop = roomChatContainer[room].scrollHeight;
}

inputMessageRoom1.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    sendRoomMessage('room1');
  }
});

inputMessageRoom2.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    sendRoomMessage('room2');
  }
});
