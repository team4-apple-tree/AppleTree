const myFace = document.querySelector('#myFace');
const camerasSelect = document.querySelector('#cameras');
const peerFace = document.querySelector('.user-list');

// const roomId = getQueryParam('id');
let myStream;
let myPeerConnection;

$(document).ready(async () => {
  await initcall();
  socket.emit('join_room', roomId);
});

async function initcall() {
  await getMedia();
  makeConnection();
}

async function getMedia(deviceId) {
  const initialConstrains = {
    audio: true,
    video: { facingMode: 'user' },
  };
  const cameraConstrains = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstrains : initialConstrains,
    );
    myFace.srcObject = myStream;

    if (!deviceId) {
      await getCamera();
    }
  } catch (error) {
    console.log(error);
  }
}

async function getCamera() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    const currentCamera = myStream.getVideoTracks()[0];

    cameras.forEach((camera) => {
      const option = document.createElement('option');

      option.value = camera.deviceId;
      option.innerText = camera.label;

      if (currentCamera.label !== camera.label) {
        option.selected = true;
      }

      camerasSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}

// SOCKET

socket.on('welcome', async () => {
  const offer = await myPeerConnection.createOffer();

  console.log('a');

  myPeerConnection.setLocalDescription(offer);

  socket.emit('offer', { offer, roomId });
});

socket.on('offer', async (offer) => {
  myPeerConnection.setRemoteDescription(offer);

  const answer = await myPeerConnection.createAnswer();

  myPeerConnection.setLocalDescription(answer);

  console.log('bb');

  socket.emit('answer', { answer, roomId });
});

socket.on('answer', (answer) => {
  myPeerConnection.setRemoteDescription(answer);
});

socket.on('ice', (ice) => {
  myPeerConnection.addIceCandidate(ice);
});

// RTC

function makeConnection() {
  console.log('aaa');
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
        ],
      },
    ],
  });
  myPeerConnection.addEventListener('icecandidate', handleIce);
  myPeerConnection.addEventListener('track', handleAddStream);

  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data) {
  socket.emit('ice', { ice: data.candidate, roomId });
}

function handleAddStream(data) {
  //     const tempHtml = `
  //     <li>
  //     <video
  //       id="myFace"
  //       src=""
  //       autoplay
  //       playsinline
  //       width="400"
  //       height="400"
  //     ></video>
  //   </li>`
  //   console.log('bbb');
  const li = document.createElement('li');
  const video = document.createElement('video');
  const peerFace = document.querySelector('#peerFace');

  peerFace.srcObject = data.streams[0];

  //   console.log(data.streams[0]);

  //   video.srcObject = data.streams[0];
  //   video.setAttribute('autoplay', '');
  //   video.setAttribute('playsinline', '');
  //   video.setAttribute('width', '400');
  //   video.setAttribute('height', '400');

  //   li.appendChild(video);
  //   console.log(li);
  //   li.innerText = 'abc';
  //   peerFace.appendChild(li);
}

// 현재 페이지의 쿼리 스트링 파싱 함수
function getQueryParam(key) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get(key);
}
