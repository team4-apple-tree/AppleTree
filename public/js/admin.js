function createRoom() {
  const roomName = document.getElementById('roomName').value;

  fetch('http://localhost:4444/room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: roomName }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert('Room created!');
      // Fetch rooms again to update the list and select dropdown.
      fetchRooms();
    })
    .catch((error) => console.error('Error:', error));
}

function fetchRooms() {
  fetch('http://localhost:4444/room')
    .then((response) => response.json())
    .then((data) => {
      const roomList = document.getElementById('roomList');
      const roomSelect = document.getElementById('roomSelect');
      roomList.innerHTML = '';
      roomSelect.innerHTML = '';

      data.forEach((room) => {
        // Add to list
        const li = document.createElement('li');
        li.textContent = room.name;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function () {
          deleteRoom(room.roomId);
        };
        li.appendChild(deleteButton);
        roomList.appendChild(li);

        // Add to select dropdown
        const option = document.createElement('option');
        option.value = room.roomId;
        option.textContent = room.name;
        roomSelect.appendChild(option);
      });
    });
}

function deleteRoom(roomId) {
  fetch(`http://localhost:4444/room/${roomId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      alert('Room deleted!');
      fetchRooms();
    })
    .catch((error) => console.error('Error:', error));
}

function fetchSeats() {
  const roomId = document.getElementById('roomSelect').value;

  fetch(`http://localhost:4444/seat/room/${roomId}`)
    .then((response) => response.json())
    .then((data) => {
      const seatsInfo = document.getElementById('seatsInfo');
      seatsInfo.innerHTML = '';

      data.forEach((seat) => {
        const div = document.createElement('div');
        div.textContent = `Seat: ${seat.name} - Price: ${seat.price}`;
        const input = document.createElement('input');
        input.value = seat.price;
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.onclick = function () {
          updateSeatPrice(seat.seatId, input.value);
        };
        div.appendChild(input);
        div.appendChild(updateButton);
        seatsInfo.appendChild(div);
      });
    });
}

function updateSeatPrice(seatId, price) {
  fetch(`http://localhost:4444/seat/${seatId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ price: price }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert('Seat price updated!');
      fetchSeats();
    })
    .catch((error) => console.error('Error:', error));
}

// On page load, fetch all rooms.
document.addEventListener('DOMContentLoaded', fetchRooms);
