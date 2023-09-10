const token = getCookie('Authorization');
const roomId = getQueryParam('id');

let userList = new Set();
let inviteMembers = [];

const inviteDiv = document.querySelector('#invite-div');
const inviteUl = document.querySelector('#invite-ul');
const inviteEmail = document.querySelector('#memberEmailInput');
const mdfBtn = document.querySelector('#mdfBtn');

$(document).ready(async () => {
  const socket = await io({
    extraHeaders: {
      authorization: token,
      roomId,
    },
  });

  // await socket.on('connect', async () => {
  // 스터디그룹에 접속한 멤버 목록
  await socket.on('members', async (members) => {
    console.log('aaa');
    const chatMember = await $('.chatMember');

    await chatMember.empty();

    members.forEach(async (name) => {
      const p = document.createElement('p');

      p.className = 'UserName';
      p.innerText = name;

      await chatMember.append(p);
    });
  });
  // });

  // 스터디 그룹에서 입력받은 모든 채팅 목록 조회
  await axios
    .get(`http://52.78.189.158:4444/chat/${roomId}`)
    .then((response) => {
      const messages = response.data;
      console.log(messages);

      messages.forEach((m) => {
        appendMessage({ userName: m.name, message: m.message });
      });
    })
    .catch((response) => {
      console.log(response);

      alert('오류');
    });

  // 채팅 입력 시 이벤트
  $(document).on('click', '#sendRoomMessage', () => {
    sendRoomMessage();
  });

  // 채팅 입력 시 실행되는 함수
  function sendRoomMessage() {
    const message = $('#messageInput').val();

    if (message.trim() !== '') {
      socket.emit('chatMessage', message);
      $('#messageInput').val('');
    }
  }

  // 사용자가 입력한 채팅 받아오기
  socket.on('chatMessage', (messages) => {
    appendMessage(messages);
  });

  // 채팅 목록 화면에 보여주는 함수
  function appendMessage({ userName, message }) {
    const chatList = document.querySelector('#room-chat-list');
    const chatContainer = document.querySelector('.chat-messages');

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

  // 채팅 입력 시 엔터 눌렀을 때 이벤트
  $(document).on('keyup', '#messageInput', (e) => {
    if (e.key === 'Enter') {
      sendRoomMessage();
    }
  });

  // 멤버 초대 할 수 있게 숨겨진 태그 보이게 하기
  $(document).on('click', '#invite', () => {
    $('#memberEmailInput').css('display', 'block');
    $('#checkEmailBtn').css('display', 'block');
    $('#iniviteMembersBtn').css('display', 'block');
  });

  // 존재하는 사용자인지 확인
  $(document).on('click', '#checkEmailBtn', async () => {
    const email = $('#memberEmailInput').val();

    const data = { email };

    await axios
      .post('http://52.78.189.158:4444/user/checkEmail', data)
      .then((response) => {
        const isExistEmail = response.data;

        if (!isExistEmail) {
          alert('존재하지 않는 이메일입니다.');
        } else {
          const li = document.createElement('li');

          li.innerText = email;

          inviteUl.appendChild(li);

          inviteMembers.push({ email });
        }

        inviteEmail.value = '';
      })
      .catch((response) => {
        console.log(response);

        alert('실패');
      });
  });

  // 존재 여부 확인한 사용자들 초대
  $(document).on('click', '#iniviteMembersBtn', async () => {
    console.log(inviteMembers);
    await axios
      .post(`http://52.78.189.158:4444/group/${roomId}`, inviteMembers)
      .then((response) => {
        alert(response.data.message);

        inviteUl.innerHTML = '';

        inviteMembers = [];

        $('#memberEmailInput').css('display', 'none');
        $('#checkEmailBtn').css('display', 'none');
        $('#iniviteMembersBtn').css('display', 'none');
      })
      .catch((response) => {
        console.log(response);

        alert('실패');
      });
  });
});

// 추방 버튼 클릭 시 이벤트
$(document).on('click', '#kick', () => {});

// 쿠키 값 가져오는 함수
// function getCookie() {
//   const cookie = decodeURIComponent(document.cookie);
//   const [name, value] = cookie.split('=');
//   return value;
// }
function getCookie(name) {
  const value = decodeURIComponent(document.cookie).match(
    '(^|;) ?' + name + '=([^;]*)(;|$)',
  );
  return value ? value[2] : null;
}

// 현재 페이지의 쿼리 스트링 파싱 함수
function getQueryParam(key) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get(key);
}
