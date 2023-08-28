$(document).ready(function () {
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const dateNotice = document.getElementById('dateNotice');
  let endDatePicker;
  flatpickr(startDateInput, {
    minDate: 'today',
    dateFormat: 'Y-m-d',
    defaultDate: 'today',
    onChange: function (selectedDates, dateStr, instance) {
      if (selectedDates.length > 0) {
        const startDate = selectedDates[0];
        endDatePicker = flatpickr(endDateInput, {
          minDate: startDate,
          dateFormat: 'Y-m-d',
          defaultDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
          onClose: function (selectedEndDate) {
            if (selectedEndDate.length > 0) {
              const endDate = selectedEndDate[0];
              const diffInDays = Math.floor(
                (endDate - startDate) / (24 * 60 * 60 * 1000),
              );
              dateNotice.textContent = `${diffInDays}일 동안 스터디가 유지됩니다.`;
            }
          },
        });
        startDateInput.addEventListener('input', function () {
          endDatePicker.setDate('');
          dateNotice.textContent = '';
        });
        endDateInput.addEventListener('click', function () {
          endDatePicker.setDate('');
          dateNotice.textContent = '';
        });
      }
    },
  });
  // 스터디 에티켓
  const studyEtiquetteInput = document.getElementById('studyEtiquette');
  const etiquetteLengthNotice = document.querySelector('.limit-length');
  studyEtiquetteInput.addEventListener('input', function () {
    const textLength = studyEtiquetteInput.value.length;
    etiquetteLengthNotice.textContent = `(${textLength} / 1000)`;
  });
  // 스터디 에티켓
  // 비밀번호 설정
  const passwordToggle = document.getElementById('passwordToggle');
  const passwordInput = document.querySelector('.password-input');
  passwordToggle.addEventListener('change', function () {
    if (passwordToggle.checked) {
      passwordInput.removeAttribute('disabled');
    } else {
      passwordInput.setAttribute('disabled', 'disabled');
    }
  });
  // 스터디 만들기 버튼 클릭 시 미리보기 모달 열기
  $('.createRoomBtn').click(function () {
    // 미리보기 컨텐츠 생성
    var previewContent = createPreviewContent();
    // 모달에 미리보기 컨텐츠 추가
    $('#previewContent').html(previewContent);
    // 이미지 미리보기 업데이트
    var selectedImage = document.getElementById('roomImage');
    var previewImage = document.getElementById('previewImage');
    previewImage.src = selectedImage.src;
    // 모달 열기
    $('#previewModal').show();
  });
  // 모달 닫기 버튼 클릭 시 모달 닫기
  $('#closeModal').click(function () {
    $('#previewModal').hide();
  });
  // 스터디 생성 버튼 클릭 이벤트
  $(document).on('click', '#createStudyBtn', async () => {
    const isPublic = $(`input[name='publicOption']:checked`).val();
    const max = $('#max').val();
    const name = $("input[name='title']").val();
    const image = $('#imageUpload')[0].files[0];
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();
    const isPassword = $('#passwordToggle').prop('checked');
    const password = $("input[name='password']").val();
    const desc = $('#studyEtiquette').val();
    if (!isPublic) {
      alert('공개 여부를 선택해주세요.');
      $('#previewModal').hide();
    } else if (!max) {
      alert('최대 인원수를 선택해주세요.');
      $('#previewModal').hide();
    } else if (!name) {
      alert('스터디 이름을 입력해주세요.');
      $('#previewModal').hide();
    } else if (!image) {
      alert('대표 이미지를 삽입해주세요.');
      $('#previewModal').hide();
    } else if (!startDate || !endDate) {
      alert('스터디 이용 기간을 선택해주세요.');
      $('#previewModal').hide();
    } else if (isPassword && !password) {
      alert('비밀번호를 입력해주세요.');
      $('#previewModal').hide();
    } else if (!desc) {
      alert('스터디 에티켓을 입력해주세요.');
      $('#previewModal').hide();
    } else {
      const formData = new FormData();
      formData.append('isPublic', isPublic);
      formData.append('max', max);
      formData.append('name', name);
      formData.append('image', image);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('isPassword', isPassword);
      formData.append('desc', desc);
      if (isPassword) {
        formData.append('password', password);
      }
      await axios
        .post('http://localhost:4444/group', formData, {
          headers: {
            Authorization: getCookie(),
          },
        })
        .then(() => {
          alert('스터디가 생성되었습니다.');
          window.location.href = 'index.html';
        })
        .catch((response) => {
          if (response.response.data.error === 'Forbidden') {
            // alert('로그인이 필요한 기능입니다.');
            console.log(response);
            alert(response.response.data.message);
            // window.location.href = 'login.html';
          } else if (response.response.data.error === 'Internal Server Error') {
            alert('서버 오류');
            window.location.href = 'index.html';
          } else {
            alert('스터디 생성에 실패하였습니다.');
            window.location.href = 'index.html';
          }
        });
    }
  });
});
// 대표 이미지
document
  .getElementById('imageUpload')
  .addEventListener('change', function (event) {
    const selectedImage = event.target.files[0];
    const roomImage = document.getElementById('roomImage');
    const noImageText = document.getElementById('noImageText'); // 추가된 부분
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = function () {
        roomImage.src = reader.result;
        roomImage.style.display = 'inline'; // 이미지가 있을 경우 이미지 표시
        noImageText.style.display = 'none'; // 이미지가 있을 경우 문구 숨기기
      };
      reader.readAsDataURL(selectedImage);
    }
  });
// 이미지를 클릭했을 때도 파일 선택 창을 띄우도록 설정
document.getElementById('roomImage').addEventListener('click', function () {
  document.getElementById('imageUpload').click();
});
// 미리보기 컨텐츠 생성하는 함수
function createPreviewContent() {
  var publicOption =
    $("input[name='publicOption']:checked").val() === 'true'
      ? '공개 스터디'
      : '비공개 스터디';
  var title = $("input[name='title']").val();
  var startDate = $('#startDate').val();
  var endDate = $('#endDate').val();
  var password = $("input[name='password']").val();
  var studyEtiquette = $('#studyEtiquette').val();
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const diffInDays = Math.floor(
    (endDateObj - startDateObj) / (24 * 60 * 60 * 1000),
  );
  var content = `
    <h1>${title}</h1>
    <div><strong>스터디 유형</strong>
    <p>${publicOption}</p></div>
    <div> <strong>스터디 기간 <p class ="day">총${diffInDays}일</p></strong>
    <p>${startDate} ~ ${endDate}</p></div>
    <div class="confirm">스터디를 생성하시겠습니까?</div>
  `;
  return content;
}
// 쿠키 값 가져오는 함수
function getCookie() {
  const cookie = decodeURIComponent(document.cookie);
  const [name, value] = cookie.split('=');
  return value;
}
