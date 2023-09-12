function getRoomIdFromURL() {
  const url = new URL(window.location.href);
  const roomId = url.searchParams.get('roomId');
  return roomId;
}

let roomId = getRoomIdFromURL();
let selectedSeat = null;
let selectedInfo = [];

document.addEventListener('DOMContentLoaded', function () {
  const roomId = getRoomIdFromURL();
  console.log('roomId 값:', roomId);

  // 모달 및 관련 요소들 설정
  const modal = document.getElementById('seatModal');
  const closeModal = document.querySelector('.close-btn');
  const seatNumberEl = document.getElementById('seatNumber');
  const seatStatusEl = document.getElementById('seatStatus');
  const seatPriceInput = document.getElementById('seatPrice');
  const seatTypeSelect = document.getElementById('seatType');
  // const updateSeatBtn = document.getElementById('updateSeatBtn');

  closeModal.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  // updateSeatBtn.addEventListener('click', async function () {
  //   if (!selectedSeat) return;

  //   const seatId = selectedSeat.dataset.seatId;
  //   const row = selectedSeat.dataset.row;
  //   const column = selectedSeat.dataset.column;

  //   const seatData = {
  //     row,
  //     column,
  //     price: parseFloat(seatPriceInput.textContent),
  //     type: parseInt(seatTypeSelect.value, 10),
  //     reservationStatus: seatStatusEl.value === '예약됨',
  //   };

  //   fetch(`/seat/${seatId}`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(seatData),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       modal.style.display = 'none';
  //       loadSeats(roomId);
  //     })
  //     .catch((error) => {
  //       console.error('좌석 데이터 업데이트 중 오류:', error);
  //     });
  // });

  // 좌석을 로드하고 방 이미지도 가져옵니다.
  loadSeats(roomId);
  fetchImage();
});

function fetchImage() {
  fetch(`/room/${roomId}/image`)
    .then((response) => response.json())
    .then((data) => {
      const cafeImage = document.getElementById('cafeimage');
      cafeImage.src = data.path;
    })
    .catch((error) => console.error('이미지를 가져오는 중 오류:', error));
}

function loadSeats(roomId) {
  Promise.all([
    fetch(`/room-structure/${roomId}`).then((response) => response.json()),
    fetch(`/seat/room/${roomId}`).then((response) => response.json()),
  ])
    .then(([roomData, seatData]) => {
      const seatShape = JSON.parse(roomData.seatShape);
      drawSeats(seatShape, seatData);
    })
    .catch((error) => {
      console.error('좌석 데이터 가져오는 중 오류:', error);
    });
}

function getSeatName(row, column) {
  const columnLabel = String.fromCharCode(97 + column);
  return `${columnLabel}${row}`;
}

function getSeatType(type) {
  switch (type) {
    case 1:
      return '1인석';
    case 2:
      return '4인석';
    case 3:
      return '회의실';
  }
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
      seatElement.onclick = function () {
        seatElement.classList.toggle('selected');
        const arr = Array.from(seatElement.classList);

        if (arr.includes('selected')) {
          selectedInfo.push(seatInfo);
        } else {
          const index = selectedInfo.indexOf(seatInfo);

          selectedInfo.splice(index, 1);
        }
      };

      if (seatInfo) {
        seatElement.addEventListener('click', function () {
          if (seatInfo.reservationStatus) {
            alert('이미 예약이 완료되었습니다.');
            return;
          }

          selectedSeat = seatElement;
          // showSeatModal(seatInfo, roomId);
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
        seatNameP.textContent = getSeatName(i, j);
        seatElement.appendChild(seatNameP);
      } else {
        seatElement.className = 'seat unavailable';
      }

      rowElement.appendChild(seatElement);
    }

    seatsGrid.appendChild(rowElement);
  }
}

async function fetchReservedTimes(seatId) {
  const response = await fetch(`/time-table/reserved-times/${seatId}`);

  // 오류 처리: 응답 상태가 200 OK가 아닐 경우
  if (!response.ok) {
    console.error(`seatId에 대해 예약된 시간을 가져오지 못했습니다: ${seatId}`);
    return [];
  }

  const data = await response.json();
  return data;
}

async function showSeatModal(seatInfos) {
  const response = await axios.get(`/time-table/${roomId}`);
  const timeTables = response.data;
  const modal = document.getElementById('seatModal');
  const reservationList = document.getElementById('reservationList');
  const totalPrice = document.getElementById('totalPrice');
  let total = 0;

  reservationList.innerHTML = '';

  seatInfos.forEach(async (seatInfo) => {
    const seatName = getSeatName(seatInfo.row, seatInfo.column);
    const seatType = getSeatType(seatInfo.type);
    const seatPrice = await getPriceByType(roomId, seatInfo.type);
    const reservedTimes = await fetchReservedTimes(seatInfo.seatId);
    console.log('asd', reservedTimes);

    total += seatPrice;

    const li = document.createElement('li');
    const startSelect = document.createElement('select');
    const endSelect = document.createElement('select');
    startSelect.className = 'startTime';
    endSelect.className = 'endTime';

    timeTables.forEach((time, i) => {
      const startOption = document.createElement('option');

      startOption.value = time.timeTableId;
      startOption.text = time.timeSlot;

      if (i > 0) {
        const endOption = document.createElement('option');

        endOption.value = time.timeTableId;
        endOption.text = time.timeSlot;

        endSelect.appendChild(endOption);
      }

      startSelect.appendChild(startOption);
    });

    const startSelectHtml = startSelect.outerHTML;
    const endSelectHtml = endSelect.outerHTML;
    const tempHtml = `
      <div class="seat-div" id="${seatInfo.seatId}">
      <label for="seatName">좌석: </label>
        <span class="seatName">
          ${seatName}
        </span><br>
        <label for="seatPrice">가격: </label>
        <span class="seatPrice">
          ${seatPrice}
        </span><br>
        <label for="seatType">종류: </label>
        <span class="seatType">
          ${seatType}
        </span><br>
        <span>이용시간: </span>
        ${startSelectHtml}
        <span> ~ </span>
        ${endSelectHtml}
      </div>
      <br>
    `;

    li.innerHTML = tempHtml;
    reservationList.appendChild(li);
    totalPrice.innerText = total;
  });

  modal.style.display = 'block';
}

async function getPriceByType(roomId, seatType) {
  try {
    const response = await fetch(`/seat-price/room/${roomId}/type/${seatType}`);
    const data = await response.json();
    const priceElement = document.getElementById('seatPrice');
    if (data && data.price) {
      return data.price;
    } else {
      return '가격 정보를 가져오지 못했습니다.';
    }
  } catch (error) {
    console.error('타입별 가격을 가져오는 중 오류:', error);
  }
}

// 예약하기 버튼 클릭 시 이벤트
$(document).on('click', '#reservationBtn', () => {
  const selectedList = document.querySelectorAll('.selected');

  selectedInfo.sort((a, b) => a.seatId - b.seatId);

  showSeatModal(selectedInfo);
});

let errorBreak = false;
let successBreak = true;
// 결제하기 버튼 클릭 시 이벤트
$(document).on('click', '#paymentBtn', async () => {
  const seats = $('.seat-div');

  for (const seat of seats) {
    const startTimeId = +seat.querySelector('.startTime').value;
    const endTimeId = +seat.querySelector('.endTime').value;

    const seatId = [seat.id];
    const timeTableIds = Array.from(
      { length: endTimeId - startTimeId },
      (_, index) => startTimeId + index,
    );

    const data = {
      seatIds: seatId,
      timeTableIds,
    };

    await axios
      .post('/time-table/reservation', data, {
        headers: {
          Authorization: getCookie('Authorization'),
        },
      })
      .then(() => {})
      .catch((response) => {
        console.log(response);

        alert(response.response.data.message);

        errorBreak = true;
        successBreak = false;
      });

    if (errorBreak) {
      break;
    }
  }
  if (successBreak) {
    alert('결제 완료');
  }
  window.location.reload();
});

// 쿠키 값 가지고 오는 함수
function getCookie(name) {
  const value = decodeURIComponent(document.cookie).match(
    '(^|;) ?' + name + '=([^;]*)(;|$)',
  );
  return value ? value[2] : null;
}
