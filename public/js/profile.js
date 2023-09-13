// 쿠키를 파싱하는 함수
function getCookie(name) {
  const value = decodeURIComponent(document.cookie).match(
    '(^|;) ?' + name + '=([^;]*)(;|$)',
  );
  return value ? value[2] : null;
}

// JWT 토큰에서 사용자 ID를 추출하는 함수
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

// 사용자 프로필 정보를 로드하는 함수
async function loadUserProfile(userId) {
  try {
    const response = await axios.get('/user', {
      headers: {
        Authorization: getCookie('Authorization'),
      },
    });
    const data = response.data;

    // HTML 요소에 데이터 설정
    document.querySelector('.emailAddress-tx').textContent = data.user.email;
    document.querySelector('input[name="userNickname"]').value = data.user.name;
    document.querySelector('.profileTxarea').textContent = data.user.desc;
    if (data.user.profileImage) {
      document.querySelector('#previewImage').src = data.user.profileImage;
    }

    // ... 다른 데이터도 동일한 방식으로 설정
  } catch (error) {
    console.error('사용자 프로필을 가져오는 데 실패했습니다:', error);
  }
}

// 사용자 예약 정보를 로드하는 함수
async function loadUserReservation(userId) {
  try {
    const response = await axios.get(`/user/reservation/${userId}`, {
      headers: {
        Authorization: getCookie('Authorization'),
      },
    });
    const reservations = response.data; // 예약 정보 배열
    // 예약 정보를 표시할 컨테이너 선택
    const container = document.querySelector('.reservation-container');
    // 컨테이너의 모든 자식 요소 제거
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    // 각 예약 정보를 반복하며 HTML에 추가
    reservations.forEach((data, index) => {
      // 예약 정보를 담을 div 요소 생성
      const reservationDiv = document.createElement('div');
      reservationDiv.classList.add('reservation-details');
      // 예약 정보를 설정하여 HTML에 추가
      reservationDiv.innerHTML = `
       <div class = "myreservation"> <p>예약한 스터디룸: ${data.name}</p>
        <p>예약 시간: ${data.timeTable}</p>
        <p>예약 좌석 타입: ${data.type}</p>
        <p>예약 가격: ${data.price}</p>
        <p>스터디룸의 주소: ${data.address}</p></div>
      `;
      // 컨테이너에 예약 정보 추가
      container.appendChild(reservationDiv);
    });
  } catch (error) {
    console.error('사용자 예약 정보를 가져오는 데 실패했습니다:', error);
  }
}
// 예약 정보를 표시할 사용자의 ID (예: 1)를 전달하여 함수 호출
loadUserReservation(1); // 사용자 ID를 원하는 값으로 설정

// 시작할 때 사용자 프로필 로드
function init() {
  const token = getCookie('Authorization').replace('Bearer%20', '');
  if (token) {
    const decodedToken = parseJwt(token);
    const userId = decodedToken.id;
    loadUserProfile(userId);
    loadUserReservation(userId);
  }
}

// 페이지 로드 시 init 함수 실행
window.onload = init;

// 비밀번호 변경 모달
document.querySelector('.pass-chg-btn').addEventListener('click', function () {
  document.getElementById('changeconfirmpasswordmodal').style.display = 'block';
});

document.querySelector('.confirmclose').addEventListener('click', function () {
  document.getElementById('changeconfirmpasswordmodal').style.display = 'none';
});

// '확인' 버튼을 눌렀을 때 '비밀번호 확인 모달'을 닫고 '비밀번호 변경 모달'을 열기
document
  .querySelector('.confirmchange')
  .addEventListener('click', async function () {
    // 여기에서는 비밀번호 확인 로직을 추가할 수 있습니다.
    const password = document.querySelector('.confirmpasswordInput').value;

    const data = { password };

    await axios
      .post('/user/checkPassword', data, {
        headers: {
          Authorization: getCookie('Authorization'),
        },
      })
      .then(() => {
        document.getElementById('confirmpasswordmodal').style.display = 'none';
        document.getElementById('passwordModal').style.display = 'block';
      })
      .catch((response) => {
        alert(response.response.data.message);
      });
  });

// 비밀번호 변경 클릭 이벤트
document
  .querySelector('#changepassword')
  .addEventListener('click', async () => {
    const password = document.querySelector('#changenewpassword').value;
    const confirm = document.querySelector('#changenewpasswordconfirm').value;

    const data = {
      password,
      confirm,
    };

    await axios
      .put('/user/updatePassword', data, {
        headers: {
          Authorization: getCookie('Authorization'),
        },
      })
      .then((response) => {
        alert(response.data.message);

        window.location.reload();
      })
      .catch((response) => {
        alert(response.response.data.message);
      });
  });

document.querySelector('.close').addEventListener('click', function () {
  document.getElementById('passwordModal').style.display = 'none';
});

window.onclick = function (event) {
  if (event.target == document.getElementById('passwordModal')) {
    document.getElementById('passwordModal').style.display = 'none';
  }
};
// 비밀번호 변경 모달

// 프로필 설정완료 비밀번호 확인 모달
document.querySelector('.createRoomBtn').addEventListener('click', function () {
  // 모달 표시
  document.getElementById('confirmpasswordmodal').style.display = 'block';
});

document
  .querySelector('.confirmpasswordmodalclose')
  .addEventListener('click', function () {
    // 모달 숨기기
    document.getElementById('confirmpasswordmodal').style.display = 'none';
  });

window.onclick = function (event) {
  if (event.target == document.getElementById('confirmpasswordmodal')) {
    document.getElementById('confirmpasswordmodal').style.display = 'none';
  }
};

document
  .querySelector('.confirmPasswordBtn')
  .addEventListener('click', async () => {
    const password = document.querySelector('#confirmPassword').value;

    const data = { password };

    await axios
      .post('/user/checkPassword', data, {
        headers: {
          Authorization: getCookie('Authorization'),
        },
      })
      .then(() => {
        updateUserProfile();
      })
      .catch((response) => {
        alert(response.response.data.message);
      });
  });

// 유저 정보 수정
async function updateUserProfile() {
  const name = document.querySelector('.nameInput').value;
  const desc = document.querySelector('.profileTxarea').value;
  const profileImage = document.querySelector('#imageInput').files[0];

  const formData = new FormData();

  formData.append('name', name);
  formData.append('desc', desc);
  if (profileImage) {
    formData.append('profileImage', profileImage);
  }

  await axios
    .put('/user', formData, {
      headers: {
        Authorization: getCookie('Authorization'),
      },
    })
    .then(() => {
      alert('프로필이 수정되었습니다.');

      window.location.reload();
    })
    .catch((response) => {
      console.log(response);
      alert(response.response.data.message);
    });
}

// "회원 탈퇴" 버튼에 이벤트 리스너 추가
document.querySelector('.withdrawalBtn').addEventListener('click', function () {
  const confirmation = confirm('정말 탈퇴하시겠습니까?');
  if (confirmation) {
    // byebyeuser 모달 표시
    document.getElementById('byebyeuser').style.display = 'block';
  }
});

// 모달 닫기 버튼 이벤트 리스너
document
  .querySelector('#byebyeuser .close')
  .addEventListener('click', function () {
    document.getElementById('byebyeuser').style.display = 'none';
  });

// 비밀번호 확인 후 로직 실행 (예: 서버에 탈퇴 요청)
document.querySelector('.byebye').addEventListener('click', async () => {
  const password = document.querySelector('#byebyePassword').value;

  const data = { password };

  // 여기에서 서버에 탈퇴 요청 로직을 추가할 수 있습니다.
  // 예: axios.post('/user/withdrawal', { password }, ...)
  await axios
    .post('/user/checkPassword', data, {
      headers: {
        Authorization: getCookie('Authorization'),
      },
    })
    .then(async () => {
      await deleteUser();
    })
    .catch((response) => {
      alert(response.response.data.message);
    });

  // 후처리: 예를 들면 모달을 닫거나, 성공/실패 메시지를 표시하거나, 페이지를 리디렉션하는 등의 작업
  document.getElementById('byebyeuser').style.display = 'none';
});

// 회원탈퇴 api 요청
async function deleteUser() {
  await axios
    .delete('/user', {
      headers: {
        Authorization: getCookie('Authorization'),
      },
    })
    .then((response) => {
      alert(response.data.message);

      window.location.href = '/';
    })
    .catch((response) => {
      console.log(response);
      alert(response.response.data.message);
    });
}

// 이미지 미리보기
document
  .getElementById('imageInput')
  .addEventListener('change', async function () {
    const file = this.files[0];
    if (file) {
      // 미리보기 이미지 설정
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('previewImage').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

document
  .querySelector('.reservationinfo')
  .addEventListener('click', function () {
    document.getElementById('reservationmodal').style.display = 'block';
  });

window.onclick = function (event) {
  const modal = document.getElementById('reservationmodal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};
