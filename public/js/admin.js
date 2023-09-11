// 방 생성 함수
function createRoom() {
  const roomName = document.getElementById('room-name').value;
  const roomAddress = document.getElementById('room-address').value;
  const image = document.getElementById('room-image-url').value;
  fetch('/room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: roomName,
      address: roomAddress,
      image: image,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Log:', data);
      listRooms();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
// 방 목록 보여주기
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
        const seatViewButton = document.createElement('button');
        seatViewButton.textContent = 'seatView';
        seatViewButton.onclick = () => viewSeats(room.roomId);
        listItem.appendChild(seatViewButton);
        roomList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
function loadSeats(roomId) {
  Promise.all([
    fetch(`/room-structure/${roomId}`).then((response) => response.json()),
    fetch(`/seat/room/${roomId}`).then((response) => response.json()),
  ])
    .then(([roomData, seatData]) => {
      console.log(roomData);
      console.log(seatData);
      const seatShape = JSON.parse(roomData.seatShape);
      drawSeats(seatShape, seatData);
    })
    .catch((error) => {
      console.error('좌석 데이터 가져오는 중 오류:', error);
    });
}
function viewSeats(roomId) {
  Promise.all([
    fetch(`/room-structure/${roomId}`).then((response) => response.json()),
    fetch(`/seat/room/${roomId}`).then((response) => response.json()),
  ])
    .then(([roomData, seatData]) => {
      const seatStructureDiv = document.getElementById('seatStructure');
      seatStructureDiv.innerHTML = ''; // 초기화
      let seatIndex = 0; // seatData의 인덱스를 추적
      for (let i = 0; i < roomData.rows; i++) {
        for (let j = 0; j < roomData.columns; j++) {
          const seatDiv = document.createElement('div');
          // 이렇게 클로저를 사용하여 seatIndex의 현재 값을 고정시킵니다.
          const currentSeatIndex = seatIndex;
          if (seatData.seats[currentSeatIndex]) {
            seatDiv.textContent = seatData.seats[currentSeatIndex].seatId;
            seatDiv.className = 'seat';
            seatDiv.onclick = () => {
              if (seatData.seats[currentSeatIndex]) {
                openSeatInfoModal(seatData.seats[currentSeatIndex].seatId);
              }
            };
            seatStructureDiv.appendChild(seatDiv);
            seatIndex++;
          } else {
            break;
          }
        }
        seatStructureDiv.appendChild(document.createElement('br'));
      }
      // 모달 열기
      const modal = document.getElementById('seatStructureModal');
      modal.style.display = 'block';
    })
    .catch((error) => console.error('Error:', error));
}
function closeModal() {
  const modal = document.getElementById('seatStructureModal');
  modal.style.display = 'none';
}
// 방 정보 수정 함수
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
// 방 삭제 함수
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
// 방 구조 생성 함수
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
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
// 좌석 정보 수정 함수
async function updateSeatInfo(seatId, seatData) {
  try {
    const response = await fetch(`/seat/${seatId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(seatData),
    });
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      console.log(data.message); // '좌석 정보가 수정되었습니다.' 메시지를 콘솔에 출력
      closeSeatInfoModal(); // 모달 닫기
      listRooms(); // 방 목록 다시 로드
    } else {
      alert('좌석 정보 수정에 실패하였습니다.'); // 실패 메시지
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
function openSeatInfoModal(seatId) {
  const modal = document.getElementById('seatInfoModal');
  const updateBtn = document.getElementById('updateSeatBtn');
  document.getElementById('seatNumber').textContent = seatId;
  // 버튼 클릭 이벤트 설정
  updateBtn.onclick = function () {
    const seatStatusValue = document.getElementById('seatStatus');
    const seatPrice = document.getElementById('seatPrice').textContent;
    const seatType = parseInt(document.getElementById('seatType').value);
    const seatData = {
      reservationStatus: seatStatusValue.value === '예약됨',
      type: seatType,
    };
    updateSeatInfo(seatId, seatData); // seatId를 바로 사용하였습니다.
    console.log(seatData);
  };
  modal.style.display = 'block';
}
function closeSeatInfoModal() {
  const modal = document.getElementById('seatInfoModal');
  modal.style.display = 'none';
}
function closeSeatStructureModal() {
  const modal = document.getElementById('seatStructureModal');
  modal.style.display = 'none';
}
async function submitSeatPriceForm(event) {
  event.preventDefault();
  const roomId = document.getElementById('roomIdPrice').value;
  const seatType = document.getElementById('seatTypePrice').value;
  const seatPrice = parseFloat(document.getElementById('seatPriceInput').value);
  // 해당 데이터를 서버에 POST 요청으로 보내는 부분
  fetch(`/seat-price/room/${roomId}/type/${seatType}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ price: seatPrice }),
  }).then((response) => {
    const contentType = response.headers.get('Content-Type');
    if (
      response.ok &&
      contentType &&
      contentType.includes('application/json')
    ) {
      return response.json();
    }
    throw new Error('Not a JSON response');
  });
}
// 이벤트 리스너에 함수를 연결
document
  .getElementById('set-seat-price-form')
  .addEventListener('submit', submitSeatPriceForm);
//페이지 로드 시 실행될 초기화 함수
window.onload = function () {
  listRooms();
  document
    .getElementById('room-structure-form')
    .addEventListener('submit', createRoomStructure);
};

// 룸 타임 테이블 설정
$(document).on('submit', '#room-time-form', async (e) => {
  e.preventDefault();

  const roomId = $('#timeRoomId').val();
  const startTime = $('#startTime').val();
  const endTime = $('#endTime').val();

  data = {
    startTime,
    endTime,
  };

  await axios.post(`/time-table/create/${roomId}`, data);
});
