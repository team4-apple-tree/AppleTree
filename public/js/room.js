document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('id');
  const groupNameElement = document.getElementById('groupName');
  const TeamRoleElement = document.getElementById('TeamRole');
  const StartDateElement = document.getElementById('startdate');
  const EndDateElement = document.getElementById('enddate');
  const dropbtn = document.getElementById('dropbtn');
  const dropdown = document.querySelector('.dropdown');

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
      //   const date = new Date(groupdate);
      const Startdate = startdate.split('T')[0];
      const Enddate = enddate.split('T')[0];
      //   const year = date.getFullYear();
      //   const month = date.getMonth() + 1;
      //   const day = date.getDate();

      //   console.log(`년: ${year}, 월: ${month}, 일: ${day}`);

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
    } catch (error) {
      console.error('에러지롱:', error);
    }
  }
});
