// Create Room function
function createRoom() {
  const roomName = document.getElementById('room-name').value;
  const roomAddress = document.getElementById('room-address').value;

  fetch('/room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: roomName, address: roomAddress }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('방 생성됨:', data);
      listRooms();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// List all rooms function
function listRooms() {
  fetch('/room')
    .then((response) => response.json())
    .then((data) => {
      const roomList = document.getElementById('room-list-ul');
      roomList.innerHTML = '';
      data.forEach((room) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${room.name} - ${room.address}`;
        roomList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Initialize room list on page load
window.onload = listRooms;

// Update Room function
function updateRoom(id) {
  const newName = prompt('새로운 스터디카페의 이름을 입력하세요:');
  const newAddress = prompt('Enter the new room address:');

  if (newName && newAddress) {
    fetch(`/room/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newName, address: newAddress }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Room updated:', data);
        listRooms();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

// Delete Room function
function deleteRoom(id) {
  if (confirm('Are you sure you want to delete this room?')) {
    fetch(`/room/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        console.log('Room deleted');
        listRooms();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

// List all rooms function
function listRooms() {
  fetch('/room')
    .then((response) => response.json())
    .then((data) => {
      const roomList = document.getElementById('room-list-ul');
      roomList.innerHTML = '';
      data.forEach((room) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${room.name} - ${room.address}`;

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.onclick = () => updateRoom(room.roomId);
        listItem.appendChild(updateButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteRoom(room.roomId);
        listItem.appendChild(deleteButton);

        roomList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Create Room Structure function
function createRoomStructure(event) {
  event.preventDefault();

  const roomId = parseInt(document.getElementById('roomId').value, 10);
  const rows = parseInt(document.getElementById('rows').value, 10);
  const columns = parseInt(document.getElementById('columns').value, 10);

  if (
    isNaN(roomId) ||
    isNaN(rows) ||
    isNaN(columns) ||
    rows < 1 ||
    rows > 100 ||
    columns < 1 ||
    columns > 100
  ) {
    alert(
      'Invalid input. Please ensure rows and columns are between 1 and 100.',
    );
    return;
  }

  fetch(`/room-structure/${roomId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rows: rows,
      columns: columns,
    }),
  })
    .then((response) => {
      console.log('Response status:', response.status);
      return response.json();
    })
    .then((data) => {
      if (data.statusCode === 400) {
        alert(data.message.join('\n'));
      } else {
        console.log('Room structure created:', data);
        // 필요하다면 여기에서 추가로 실행할 코드를 작성합니다
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// 페이지가 로드될 때 실행될 초기화 함수
window.onload = function () {
  // 처음에 방 목록 로드
  listRooms();

  // room-structure-form의 submit 이벤트에 대한 핸들러 연결
  document
    .getElementById('room-structure-form')
    .addEventListener('submit', createRoomStructure);
};
