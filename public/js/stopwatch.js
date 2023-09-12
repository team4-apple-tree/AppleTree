document.addEventListener('DOMContentLoaded', () => {
  let totalHours = 0;
  let totalMinutes = 0;
  let isRunning = false;
  let intervalId = null;
  let pausedTime = 0;

  const goalText = document.getElementById('goalText');
  const currentTimeDisplay = document.getElementById('currentTimeDisplay');
  const gauge = document.getElementById('gauge');
  const formSettingButton = document.querySelector('.form-setting');

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
      startCountdown(totalHours * 3600 + totalMinutes * 60 - pausedTime);
    } else {
      alert('유효한 숫자를 입력하세요.');
    }
  });

  function startCountdown(totalSeconds) {
    let currentTime = totalSeconds;
    intervalId = setInterval(() => {
      if (currentTime <= 0) {
        clearInterval(intervalId);
        alert('목표 시간이 다 되었습니다.');
        return;
      }

      currentTime--;

      const hours = Math.floor(currentTime / 3600);
      const remainingMinutes = Math.floor((currentTime % 3600) / 60);
      const seconds = currentTime % 60;

      currentTimeDisplay.textContent = `${hours}시간 ${remainingMinutes}분 ${seconds}초`;
    }, 1000);
  }
});
