// 쿠키를 파싱하는 함수
function getCookie(name) {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');
  if (parts.length == 2) return parts.pop().split(';').shift();
  return null;
}
// JWT 토큰에서 사용자 ID와 이메일을 추출하는 함수
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
    const response = await fetch(`/user/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('사용자 프로필을 가져오는 데 실패했습니다:', error);
    throw error; // 오류를 호출자에게 전파
  }
}
var IMP = window.IMP;
var today = new Date();
var hours = today.getHours(); // 시
var minutes = today.getMinutes(); // 분
var seconds = today.getSeconds(); // 초
var milliseconds = today.getMilliseconds();
var makeMerchantUid =
  `${hours}` + `${minutes}` + `${seconds}` + `${milliseconds}`;
async function loadProfileAndOpenPayment() {
  try {
    const token = getCookie('Authorization').replace('Bearer%20', '');
    if (token) {
      const decodedToken = parseJwt(token);
      const userId = decodedToken.id;
      const user_email = decodedToken.email;
      const data = await loadUserProfile(userId);
      // 'kakaoPay' 버튼 클릭 이벤트 핸들러를 정의
      const buyButton = document.getElementById('kakaoPay');
      buyButton.addEventListener('click', async function () {
        // 포인트 선택 창 표시
        console.log('버튼클릭');
        const pointOptions = document.getElementById('pointOptions');
        const selectedOption = pointOptions.options[pointOptions.selectedIndex];
        const selectedPoint = parseFloat(selectedOption.value); // 직접 변환
        console.log(selectedPoint);
        // 사용자가 선택한 포인트 값을 'kakaoPay' 함수로 전달합니다.
        kakaoPay(user_email, userId, data.name, selectedPoint);
      });
    }
  } catch (error) {
    console.error('사용자 프로필을 가져오는 데 실패했습니다:', error);
  }
}
function kakaoPay(useremail, userId, username, selectedPoint) {
  if (getCookie('Authorization')) {
    // 쿠키에서 로그인 정보를 확인
    const emoticonName = '상품명'; // 이 부분을 실제 상품명으로 수정해야 합니다.
    IMP.init('imp35145035'); // 가맹점 식별코드
    IMP.request_pay(
      {
        pg: 'kakaopay.TC0ONETIME', // PG사 코드표에서 선택
        pay_method: 'card', // 결제 방식
        merchant_uid: 'IMP' + makeMerchantUid, // 결제 고유 번호
        name: emoticonName, // 제품명을 상품명으로 설정
        amount: selectedPoint, // 가격
        // 구매자 정보 ↓
        buyer_email: `${useremail}`,
        buyer_name: `${username}`,
      },
      async function (rsp) {
        // callback
        if (rsp.success) {
          // 결제 성공시
          console.log(rsp);
          // 결제 완료시 포인트 생성 요청 보내기
          if (rsp.status == 'paid') {
            // 결제 완료시
            alert('결제 완료!');
            // 포인트 생성 요청 보내기
            try {
              const pointResponse = await fetch('/payments', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId: userId,
                  points: selectedPoint, // 선택한 포인트 값으로 변경
                }),
              });
              console.log('서버 응답 상태 코드:', pointResponse.status);
              if (pointResponse.ok) {
                // 응답이 성공적일 때만 처리
                if (pointResponse.status === 204) {
                  console.log('포인트 생성 요청이 성공적으로 처리되었습니다.');
                  alert('포인트 생성 요청이 성공적으로 처리되었습니다.');
                  window.location.reload();
                } else if (pointResponse.status === 201) {
                  // 응답이 비어있지 않은 경우에만 JSON 파싱을 시도
                  const contentType = pointResponse.headers.get('content-type');
                  if (contentType && contentType.includes('application/json')) {
                    const pointData = await pointResponse.json();
                    console.log('포인트 생성 결과:', pointData);
                    alert('포인트가 생성되었습니다.');
                    window.location.reload();
                  } else {
                    alert('포인트 생성에 성공했습니다.');
                  }
                } else {
                  console.error(
                    '포인트 생성 실패. 상태 코드:',
                    pointResponse.status,
                  );
                  alert('포인트 생성에 실패했습니다.');
                }
              } else {
                console.error('포인트 생성 요청이 실패했습니다.');
                alert('포인트 생성에 실패했습니다.');
              }
            } catch (pointError) {
              console.error('포인트 생성 요청 실패:', pointError);
              alert('포인트 생성에 실패했습니다.');
            }
            // DB저장 실패시 status에 따라 추가적인 작업 가능성
          }
        } else if (rsp.success == false) {
          // 결제 실패시
          alert(rsp.error_msg);
        }
      },
    );
  } else {
    // 쿠키에 로그인 정보가 없을 경우
    alert('로그인이 필요합니다!');
  }
}
// 페이지 로드 시 loadProfileAndOpenPayment 함수 실행
window.onload = function () {
  loadProfileAndOpenPayment();
};
