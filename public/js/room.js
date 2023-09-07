document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('id');
  const groupNameElement = document.getElementById('groupName');
  const TeamRoleElement = document.getElementById('TeamRole');
  const StartDateElement = document.getElementById('startdate');
  const EndDateElement = document.getElementById('enddate');
  const dropbtn = document.getElementById('dropbtn');
  const dropdown = document.querySelector('.dropdown');
  const RemainingDaysElement = document.getElementById('remainingDays');
  const iframeElement = document.getElementById('dailyIframe');

  if (groupId) {
    try {
      const response = await axios.get(
        `http://localhost:4444/group/${groupId}`,
      );
      const groupData = response.data;
      const groupName = groupData.name;
      const TeamRole = groupData.desc;
      const startdate = groupData.startDate;
      const enddate = groupData.endDate;
      const videoChatURL = groupData.videoChatURL;

      const Startdate = startdate.split('T')[0];
      const Enddate = enddate.split('T')[0];
      const StartDate = new Date(startdate);
      const EndDate = new Date(enddate);
      const currentDate = new Date();
      const remainingTime = Math.max(EndDate - currentDate, 0);

      if (remainingTime > 0) {
        const days = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
        RemainingDaysElement.innerText = `남은 기간: ${days}일`;
      } else {
        RemainingDaysElement.innerText = '기간이 종료되었습니다.';
      }

      groupNameElement.innerText = groupName;
      TeamRoleElement.innerText = TeamRole;
      StartDateElement.innerText = Startdate;
      EndDateElement.innerText = Enddate;

      iframeElement.src = videoChatURL;

      // 드롭다운 메뉴 클릭 이벤트 처리
      let isDropdownVisible = false;
      dropbtn.addEventListener('click', () => {
        isDropdownVisible = !isDropdownVisible;
        dropdown.classList.toggle('show', isDropdownVisible);
      });

      // 바깥 영역 클릭 시 드롭다운 메뉴 닫기
      document.addEventListener('click', (event) => {
        if (!dropdown.contains(event.target) && isDropdownVisible) {
          dropdown.classList.remove('show');
          isDropdownVisible = false;
        }
      });
    } catch (error) {
      console.error('에러발생:', error);
    }
  }

  const inviteBtn = document.getElementById('invite');
  const inviteDiv = document.getElementById('invite-div');
  const overlay = document.getElementById('overlay');

  inviteBtn.addEventListener('click', function () {
    // 모달 및 오버레이 활성화
    inviteDiv.style.display = 'block';
    overlay.style.display = 'block';

    // 초대 버튼 비활성화
    inviteBtn.disabled = true;

    // 나머지 요소들 보이게 설정
    document.getElementById('memberEmailInput').style.display = 'block';
    document.getElementById('checkEmailBtn').style.display = 'block';
    document.getElementById('iniviteMembersBtn').style.display = 'block';
  });

  // 오버레이 클릭 시 모달 및 오버레이 비활성화
  overlay.addEventListener('click', function () {
    inviteDiv.style.display = 'none';
    overlay.style.display = 'none';

    // 초대 버튼 활성화
    inviteBtn.disabled = false;
  });
});
