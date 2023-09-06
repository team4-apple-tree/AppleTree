let selectedSeat = null;
const roomId = 6;
let modal,
  closeModal,
  seatNumberEl,
  seatStatusEl,
  seatPriceInput,
  seatTypeSelect,
  updateSeatBtn; // 전역 변수로 선언

function loadSeats(roomId) {
  fetch(`http://localhost:4444/room-structure/${roomId}`)
    .then((response) => response.json())
    .then((roomData) => {
      const seatShape = JSON.parse(roomData.seatShape);
      drawSeats(seatShape);
    })
    .catch((error) => {
      console.error('좌석 데이터를 가져오는 중에 문제가 발생했습니다:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  modal = document.getElementById('seatModal');
  closeModal = document.querySelector('.close-btn');
  seatNumberEl = document.getElementById('seatNumber');
  seatStatusEl = document.getElementById('seatStatus');
  seatPriceInput = document.getElementById('seatPrice'); // 가격 입력 필드 추가
  seatTypeSelect = document.getElementById('seatType'); // 좌석 유형 선택 추가
  updateSeatBtn = document.getElementById('updateSeatBtn');

  loadSeats(roomId);

  closeModal.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  updateSeatBtn.addEventListener('click', function () {
    if (!selectedSeat) return;

    const row = selectedSeat.dataset.row;
    const column = selectedSeat.dataset.column;

    const seatData = {
      row,
      column,
      price: parseFloat(seatPriceInput.value),
      type: seatTypeSelect.value,
      status: seatStatusEl.value === '예약됨' ? 1 : 0,
    };

    fetch(`http://localhost:4444/seat/${roomId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(seatData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        modal.style.display = 'none';
        loadSeats(roomId); // 좌석 데이터를 다시 로드하여 변경 사항을 반영합니다.
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
});

function drawSeats(seatShape) {
  const seatsGrid = document.getElementById('seatsGrid');
  seatsGrid.innerHTML = '';

  for (let i = 0; i < seatShape.length; i++) {
    for (let j = 0; j < seatShape[i].length; j++) {
      const seat = document.createElement('div');
      seat.dataset.row = i;
      seat.dataset.column = j;
      seat.classList.add('seat');
      if (seatShape[i][j] === 1) {
        seat.classList.add('selected');
      }
      seat.addEventListener('click', function () {
        if (selectedSeat) {
          selectedSeat.classList.remove('selected');
        }
        seat.classList.add('selected');
        selectedSeat = seat;

        // 좌석 정보 표시
        seatNumberEl.textContent = `${i}-${j}`;
        seatStatusEl.value = seatsData[i][j] === 1 ? '예약됨' : '예약되지 않음';

        modal.style.display = 'block';
      });
      seatsGrid.appendChild(seat);
    }
    const breakLine = document.createElement('br');
    seatsGrid.appendChild(breakLine);
  }
}
