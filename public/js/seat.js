let selectedSeat = null;
const roomId = 1;

let modal,
  closeModal,
  seatNumberEl,
  seatStatusEl,
  seatPriceInput,
  seatTypeSelect,
  updateSeatBtn;

function loadSeats(roomId) {
  fetch(`http://localhost:4444/room-structure/${roomId}`)
    .then((response) => response.json())
    .then((roomData) => {
      const seatShape = JSON.parse(roomData.seatShape);

      return fetch(`http://localhost:4444/seat/${roomId}`)
        .then((response) => response.json())
        .then((seatData) => {
          drawSeats(seatShape, seatData);
        });
    })
    .catch((error) => {
      console.error('Error while fetching seat data:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  modal = document.getElementById('seatModal');
  closeModal = document.querySelector('.close-btn');
  seatNumberEl = document.getElementById('seatNumber');
  seatStatusEl = document.getElementById('seatStatus');
  seatPriceInput = document.getElementById('seatPrice');
  seatTypeSelect = document.getElementById('seatType');
  updateSeatBtn = document.getElementById('updateSeatBtn');

  loadSeats(roomId);

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
      price: parseFloat(seatPriceInput.value),
      type: parseInt(seatTypeSelect.value, 10),
      status: seatStatusEl.value === '예약됨' ? 1 : 0,
    };

    fetch(`http://localhost:4444/seat/${seatId}`, {
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
});

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
        if (seatInfo.reservationStatus) {
          seatElement.className = 'seat reserved';
        } else {
          seatElement.className = 'seat available';
          seatElement.addEventListener('click', function () {
            selectedSeat = seatElement;
            showSeatModal(seatInfo);
          });
        }

        switch (seatInfo.type) {
          case 1:
            seatElement.classList.add('single-seat');
            break;
          case 2:
            seatElement.classList.add('four-seat');
            break;
          case 3:
            seatElement.classList.add('meeting-room');
            break;
        }

        seatElement.dataset.seatId = seatInfo.seatId;
        seatElement.textContent = getSeatName(i, j);
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

  modal.style.display = 'block';
}
