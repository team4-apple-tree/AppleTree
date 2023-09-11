const roomsContainer = document.getElementById('roomsContainer');

// 서버에서 룸 데이터를 가져오는 함수
async function fetchRooms() {
  try {
    const response = await fetch('/room');
    const rooms = await response.json();

    // 가져온 룸 데이터를 이용해 요소를 생성하고 추가합니다.
    rooms.forEach((room) => {
      const roomDiv = document.createElement('div');
      roomDiv.className = 'room';
      console.log(room.image);
      roomDiv.innerHTML = `
         <div class="imagedetail"> <img src="${room.image}" alt="${room.name}" class="room-image"/></div>
          <h3>${room.name}</h3>
          <p>${room.address}</p>`;
      roomDiv.addEventListener('click', function () {
        window.location.href = `seat.html?roomId=${room.roomId}`;
      });
      console.log(room.roomId);
      roomsContainer.appendChild(roomDiv);
    });
  } catch (error) {
    console.error('정상적으로 스터디카페를 불러오지 못했습니다.:', error);
  }
}

// 페이지 로딩이 완료되면 룸 데이터를 가져옵니다.
document.addEventListener('DOMContentLoaded', fetchRooms);
