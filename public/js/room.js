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
  const tooltip = document.getElementById('tooltip');
  const remaindate = document.getElementById('remaindate');
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
      const Startdate = startdate.split('T')[0];
      const Enddate = enddate.split('T')[0];
      const StartDate = new Date(startdate);
      const EndDate = new Date(enddate);
      const currentDate = new Date();
      const remainingTime = Math.max(EndDate - currentDate, 0); // 음수 값 방지

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
      console.error('에러지롱:', error);
    }
  }
});
RemainingDaysElement.addEventListener('click', () => {
  startdate.style.display = 'block';
});
