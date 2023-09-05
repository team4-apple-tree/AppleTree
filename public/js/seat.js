let selectedSeat = null;
const roomId = 1;

function loadSeats(roomId) {
  fetch(`http://localhost:4444/seat/${roomId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
      }
      return response.json();
    })
    .then(({ seatShape, seatDetail }) => {
      // Destructure the response to get seatShape and seatDetail
      console.log('Seat Shape:', seatShape);
      console.log('Seat Details:', seatDetail);
      drawSeats(seatShape); // Pass the seatShape directly to drawSeats
    })
    .catch((error) => {
      console.error('좌석 데이터를 가져오는 중에 문제가 발생했습니다:', error);
    });
}

function drawSeats(seatsData) {
  console.log('drawSeats', seatsData);
  const seatsGrid = document.getElementById('seatsGrid');
  seatsGrid.innerHTML = ''; // 기존에 표시된 좌석을 초기화합니다.

  for (let i = 0; i < seatsData.length; i++) {
    for (let j = 0; j < seatsData[i].length; j++) {
      const seat = document.createElement('div');
      seat.classList.add('seat');
      if (seatsData[i][j] === 1) {
        seat.classList.add('selected');
      }
      seat.addEventListener('click', function () {
        if (selectedSeat) {
          selectedSeat.classList.remove('selected');
        }
        seat.classList.add('selected');
        selectedSeat = seat;
      });
      seatsGrid.appendChild(seat);
    }
    const breakLine = document.createElement('br');
    seatsGrid.appendChild(breakLine);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  loadSeats(roomId);
});
