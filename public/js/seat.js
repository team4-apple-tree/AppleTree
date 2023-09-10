function getRoomIdFromURL() {
  const url = new URL(window.location.href);
  const roomId = url.searchParams.get('roomId');
  return roomId;
}
let roomId = getRoomIdFromURL();
let selectedSeat = null;

document.addEventListener('DOMContentLoaded', function () {
  const roomId = getRoomIdFromURL();
  console.log('roomId value:', roomId);

  modal = document.getElementById('seatModal');
  closeModal = document.querySelector('.close-btn');
  seatNumberEl = document.getElementById('seatNumber');
  seatStatusEl = document.getElementById('seatStatus');
  seatPriceInput = document.getElementById('seatPrice');
  seatTypeSelect = document.getElementById('seatType');
  updateSeatBtn = document.getElementById('updateSeatBtn');

  closeModal.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  updateSeatBtn.addEventListener('click', async function () {
    if (!selectedSeat) return;

    const seatId = selectedSeat.dataset.seatId;
    const row = selectedSeat.dataset.row;
    const column = selectedSeat.dataset.column;

    const seatData = {
      row,
      column,
      price: parseFloat(seatPriceInput.textContent),
      type: parseInt(seatTypeSelect.value, 10),
      reservationStatus: seatStatusEl.value === '예약됨',
    };

    fetch(`/seat/${seatId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(seatData),
    })
      .then((response) => response.json())
      .then((data) => {
        modal.style.display = 'none';
        loadSeats(roomId);
      })
      .catch((error) => {
        console.error('Error while updating seat data:', error);
      });
  });

  loadSeats(roomId);
});

function loadSeats(roomId) {
  Promise.all([
    fetch(`room-structure/${roomId}`).then((response) => response.json()),
    fetch(`/seat/room/${roomId}`).then((response) => response.json()),
  ])
    .then(([roomData, seatData]) => {
      const seatShape = JSON.parse(roomData.seatShape);
      drawSeats(seatShape, seatData);
    })
    .catch((error) => {
      console.error('Error while fetching seat data:', error);
    });
}

function getSeatName(row, column) {
  const columnLabel = String.fromCharCode(97 + column);
  return `${columnLabel}${row}`;
}

function drawSeats(seatShape, seatData) {
  const seatsGrid = document.getElementById('seatsGrid');
  seatsGrid.innerHTML = '';

  for (let i = 0; i < seatShape.length; i++) {
    const rowElement = document.createElement('div');
    rowElement.className = 'row';

    for (let j = 0; j < seatShape[i].length; j++) {
      const seatInfo = seatData.seats.find(
        (seat) => seat.row === i && seat.column === j,
      );
      const seatElement = document.createElement('div');
      seatElement.dataset.row = i;
      seatElement.dataset.column = j;

      if (seatInfo) {
        seatElement.addEventListener('click', function () {
          if (seatInfo.reservationStatus) {
            alert('이미 예약이 완료되었습니다.');
            return;
          }

          selectedSeat = seatElement;
          showSeatModal(seatInfo, roomId);
        });

        if (seatInfo.reservationStatus) {
          seatElement.className = 'seat reserved';
        } else {
          seatElement.className = 'seat available';
        }

        switch (seatInfo.type) {
          case 1:
            seatElement.classList.add('single-seat');
            // 타입별로 설명 추가
            const type1Description = document.createElement('p');
            type1Description.textContent = '일인석';
            seatElement.appendChild(type1Description);
            break;
          case 2:
            seatElement.classList.add('four-seat');
            const type2Description = document.createElement('p');
            type2Description.textContent = '사인석';
            seatElement.appendChild(type2Description);
            break;
          case 3:
            seatElement.classList.add('meeting-room');
            const type3Description = document.createElement('p');
            type3Description.textContent = '회의실';
            seatElement.appendChild(type3Description);
            break;
        }
        seatElement.dataset.seatId = seatInfo.seatId;
        const seatNameP = document.createElement('p');
        seatNameP.textContent = getSeatName(i, j); // 좌석 이름을 p태그에 설정
        seatElement.appendChild(seatNameP);
      } else {
        seatElement.className = 'seat unavailable';
      }

      rowElement.appendChild(seatElement);
    }

    seatsGrid.appendChild(rowElement);
  }
}

function showSeatModal(seatInfo) {
  seatNumberEl.textContent = getSeatName(seatInfo.row, seatInfo.column);
  seatStatusEl.value = seatInfo.reservationStatus ? '예약됨' : '예약되지 않음';
  seatPriceInput.value = seatInfo.price || '';
  seatTypeSelect.value = seatInfo.type || '';

  getPriceByType(roomId, seatInfo.type);

  modal.style.display = 'block';
}

async function getPriceByType(roomId, seatType) {
  try {
    const response = await fetch(`/seat-price/room/${roomId}/type/${seatType}`);
    const data = await response.json();
    console.log(data);
    const priceElement = document.getElementById('seatPrice');

    if (data && data.price) {
      priceElement.textContent = data.price;
    } else {
      priceElement.textContent = '가격 정보를 가져오지 못했습니다.';
    }
  } catch (error) {
    console.error('Error fetching price by type:', error);
  }
}
