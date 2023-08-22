// 모달 버튼 제어
$(document).ready(function () {
  // "신규 스터디" 버튼을 클릭하면 모달 표시
  $(".studies-tab-btn[data-study-tab='new']").click(function () {
    $('#newStudyModal').css('display', 'block');
  });

  // 닫기 버튼이나 배경을 클릭하면 모달 닫기
  $('.modal-close, .modal').click(function () {
    $('#newStudyModal').css('display', 'none');
  });

  // 모달 내용을 클릭해도 모달이 닫히지 않도록 방지
  $('.modal-content').click(function (event) {
    event.stopPropagation();
  });
});
// 모달 버튼 제어

// 게스트 입장 체크 제어
document.addEventListener('DOMContentLoaded', function () {
  const guestParticipationPossible = document.getElementById(
    'guestParticipationPossible',
  );
  const guestParticipationImpossible = document.getElementById(
    'guestParticipationImpossible',
  );

  guestParticipationPossible.addEventListener('change', function () {
    if (guestParticipationPossible.checked) {
      guestParticipationImpossible.checked = false;
    }
  });

  guestParticipationImpossible.addEventListener('change', function () {
    if (guestParticipationImpossible.checked) {
      guestParticipationPossible.checked = false;
    }
  });
});
// 게스트 입장 체크 제어

// 스터디 생성 미리보기 제어
document.addEventListener('DOMContentLoaded', function () {
  const previewButton = document.getElementById('previewButton');
  const previewSection = document.getElementById('previewSection');
  const previewStudyName = document.getElementById('previewStudyName');
  const previewStudyDuration = document.getElementById('previewStudyDuration');
  const previewStudyVisibility = document.getElementById(
    'previewStudyVisibility',
  );
  const previewStudyImage = document.getElementById('previewStudyImage');
  const previewStudyEtiquette = document.getElementById(
    'previewStudyEtiquette',
  );
  const previewStudyCapacity = document.getElementById('previewStudyCapacity');

  previewButton.addEventListener('click', function (event) {
    event.preventDefault();

    const studyName = document.getElementById('studyName').value;
    const studyDuration = document.getElementById('studyDuration').value;
    const studyVisibility = document.querySelector(
      'input[name="studyVisibility"]:checked',
    ).value;
    const studyImage = document.getElementById('studyImage');
    const studyEtiquette = document.getElementById('studyEtiquette').value;
    const studyCapacity = document.getElementById('studyCapacity').value;

    previewStudyName.textContent = studyName;
    previewStudyDuration.textContent = studyDuration;
    previewStudyVisibility.textContent = studyVisibility;

    if (studyImage.files && studyImage.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewStudyImage.src = e.target.result;
      };
      reader.readAsDataURL(studyImage.files[0]);
    }

    previewStudyEtiquette.textContent = studyEtiquette;
    previewStudyCapacity.textContent = studyCapacity;

    previewSection.style.display = 'block';
  });
});
// 게스트 입장 체크 제어
