const token = getCookie();
const roomId = getQueryParam('id');

const socket = io({
  extraHeaders: {
    authorization: token,
    roomId,
  },
});

let userList = new Set();

$(document).on('click', '#sendRoomMessage', () => {
  sendRoomMessage();
});

function sendRoomMessage() {
  const message = $('#messageInput').val();

  if (message.trim() !== '') {
    socket.emit('chatMessage', message);
    $('#messageInput').val('');
  }
}

socket.on('members', (members) => {
  const chatMember = $('.chatMember');

  chatMember.empty();

  members.forEach((name) => {
    const p = document.createElement('p');

    p.className = 'UserName';
    p.innerText = name;

    chatMember.append(p);
  });
});

socket.on('chatMessage', (messages) => {
  appendMessage(messages);
});

function appendMessage({ userName, message }) {
  const chatList = document.querySelector('#room-chat-list');
  const chatContainer = document.querySelector('#room-chat-container');

  const li = document.createElement('li');
  const name = document.createElement('p');
  name.classList.add('myname');
  const chat = document.createElement('p');
  chat.classList.add('chatlog');

  li.className = 'chat-item';
  name.textContent = userName;
  chat.textContent = message;

  li.appendChild(name);
  li.appendChild(chat);
  chatList.appendChild(li);

  // // 스크롤 아래로 이동
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

$(document).on('keyup', '#messageInput', (e) => {
  if (e.key === 'Enter') {
    sendRoomMessage();
  }
});

// 쿠키 값 가져오는 함수
function getCookie() {
  const cookie = decodeURIComponent(document.cookie);
  const [name, value] = cookie.split('=');
  return value;
}

// 현재 페이지의 쿼리 스트링 파싱 함수
function getQueryParam(key) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get(key);
}
