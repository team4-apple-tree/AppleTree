document.addEventListener('DOMContentLoaded', function () {
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
});
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
