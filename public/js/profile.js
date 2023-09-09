// 쿠키를 파싱하는 함수
function getCookie(name) {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');
  if (parts.length == 2) return parts.pop().split(';').shift();
  return null;
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
    const response = await fetch(`http://localhost:4444/user/${userId}`);
    const data = await response.json();

    // HTML 요소에 데이터 설정
    document.querySelector('.emailAddress-tx').textContent = data.email;
    document.querySelector('input[name="userNickname"]').value = data.name;
    document.querySelector('.profileTxarea').textContent = data.expectation; // 예시로 추가한 내 각오 데이터

    // ... 다른 데이터도 동일한 방식으로 설정
  } catch (error) {
    console.error('사용자 프로필을 가져오는 데 실패했습니다:', error);
  }
}

// 시작할 때 사용자 프로필 로드
function init() {
  const token = getCookie('Authorization').replace('Bearer%20', '');
  if (token) {
    const decodedToken = parseJwt(token);
    const userId = decodedToken.id;
    loadUserProfile(userId);
  }
}

// 페이지 로드 시 init 함수 실행
window.onload = init;

async function updateUser(userId, data) {
  try {
    const response = await fetch(`http://localhost:4444/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ' + getCookie('Authorization').replace('Bearer%20', ''),
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      alert('정보가 업데이트되었습니다.');
      return result;
    } else {
      alert('정보 업데이트에 실패했습니다.');
      throw new Error('Update failed');
    }
  } catch (error) {
    console.error('사용자 정보 업데이트 중 오류:', error);
  }
}

// 사용자 삭제 함수
async function deleteUser(userId, password) {
  try {
    const response = await fetch(`http://localhost:4444/user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ' + getCookie('Authorization').replace('Bearer%20', ''),
      },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      const result = await response.json();
      alert('사용자가 삭제되었습니다.');
      window.location.href = 'http://localhost:4444/'; // 삭제 후 메인 페이지로 리디렉션
      return result;
    } else {
      alert('사용자 삭제에 실패했습니다.');
      throw new Error('Deletion failed');
    }
  } catch (error) {
    console.error('사용자 삭제 중 오류:', error);
  }
}

// 이벤트 핸들러 설정
document.querySelector('.createRoomBtn').addEventListener('click', async () => {
  const userId = parseJwt(
    getCookie('Authorization').replace('Bearer%20', ''),
  ).id;

  // const currentPassword = document.getElementById('password').value;
  // const newPassword = document.getElementById('newPassword').value;
  // const role = document.getElementById('role').value;
  const desc = document.getElementById('profileTxarea').value;

  const data = {
    //  password: '',
    // role: '',
    desc: desc,
    // newPassword: '',
  };
  await updateUser(userId, data);
});

document.querySelector('.withdrawalBtn').addEventListener('click', async () => {
  const userId = parseJwt(
    getCookie('Authorization').replace('Bearer%20', ''),
  ).id;
  const password = ''; // TODO: 비밀번호 입력 받기
  if (confirm('정말로 탈퇴하시겠습니까?')) {
    await deleteUser(userId, password);
  }
});
