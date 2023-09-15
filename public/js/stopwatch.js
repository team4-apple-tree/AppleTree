document.addEventListener('DOMContentLoaded', () => {
  let totalHours = 0;
  let totalMinutes = 0;
  let isRunning = false;
  let intervalId = null;

  const goalText = document.getElementById('goalText');
  const currentTimeDisplay = document.getElementById('currentTimeDisplay');
  const gauge = document.getElementById('gauge');
  const formSettingButton = document.querySelector('.form-setting');

  // 페이지 로드 시 localStorage에서 저장된 값 확인 및 타이머 시작
  const savedTime = localStorage.getItem('remainingTime');
  if (savedTime) {
    startCountdown(parseInt(savedTime));
  }

  formSettingButton.addEventListener('click', () => {
    const userHours = parseInt(
      prompt('목표 시간(시)을 입력하세요:', totalHours),
    );
    const userMinutes = parseInt(
      prompt('목표 시간(분)을 입력하세요:', totalMinutes),
    );

    if (!isNaN(userHours) && !isNaN(userMinutes)) {
      totalHours = userHours;
      totalMinutes = userMinutes;

      goalText.textContent = `목표시간: ${totalHours}시간 ${totalMinutes}분`;
      currentTimeDisplay.textContent = `0시간 0분 0초`;

      const gaugeWidth = ((totalHours * 60 + totalMinutes) / (60 * 24)) * 100; // 하루는 1440분
      gauge.style.width = `${gaugeWidth}%`;

      isRunning = true;
      startCountdown(totalHours * 3600 + totalMinutes * 60);
    } else {
      alert('유효한 숫자를 입력하세요.');
    }
  });

  function startCountdown(totalSeconds) {
    let currentTime = totalSeconds;

    intervalId = setInterval(() => {
      if (currentTime <= 0) {
        clearInterval(intervalId);
        localStorage.removeItem('remainingTime'); // 타이머가 종료되면 저장된 값을 삭제
        alert('목표 시간이 다 되었습니다.');
        return;
      }

      currentTime--;

      // localStorage에 남은 시간 저장
      localStorage.setItem('remainingTime', currentTime);

      const hours = Math.floor(currentTime / 3600);
      const remainingMinutes = Math.floor((currentTime % 3600) / 60);
      const seconds = currentTime % 60;

      currentTimeDisplay.textContent = `${hours}시간 ${remainingMinutes}분 ${seconds}초`;
    }, 1000);
    window.stopTimerAndClearStorage = function () {
      clearInterval(intervalId);
      localStorage.removeItem('remainingTime');
    };
  }
});

// 페이지를 닫거나 새로고침하기 전에 데이터 저장 및 타이머 중지
window.onbeforeunload = function () {
  clearInterval(intervalId);
};
