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

  const toggleEditElements = (show) => {
    const display = show ? 'block' : 'none';
    $('#mdfInput, #mdfTextArea, #groupMdfBtn').css('display', display);
    if (!show) {
      $('#mdfInput, #mdfTextArea').val('');
    }
  };

  if (groupId) {
    try {
      const response = await axios.get(
        `http://52.78.189.158:4444/group/${groupId}`,
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

      let isDropdownVisible = false;
      dropbtn.addEventListener('click', () => {
        isDropdownVisible = !isDropdownVisible;
        dropdown.classList.toggle('show', isDropdownVisible);
      });

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
    inviteDiv.style.display = 'block';
    overlay.style.display = 'block';
    inviteBtn.disabled = true;
    document.getElementById('memberEmailInput').style.display = 'block';
    document.getElementById('checkEmailBtn').style.display = 'block';
    document.getElementById('iniviteMembersBtn').style.display = 'block';
  });

  overlay.addEventListener('click', function () {
    inviteDiv.style.display = 'none';
    overlay.style.display = 'none';
    inviteBtn.disabled = false;
  });

  $(document).on('click', '#mdfBtn', () => {
    const name = $('#groupName').text();
    const desc = $('#TeamRole').text();

    toggleEditElements(true);
    $('#mdfInput').val(name);
    $('#mdfTextArea').val(desc);
  });

  $(document).on('click', '#groupMdfBtn', async () => {
    const name = $('#mdfInput').val();
    const desc = $('#mdfTextArea').val();

    try {
      const response = await axios.put(
        `http://52.78.189.158:4444/group/${groupId}`,
        { name, desc },
        {
          headers: {
            Authorization: getCookie('Authorization'),
          },
        },
      );

      alert('성공');

      $('#groupName').text(response.data.name);
      $('#TeamRole').text(response.data.desc);

      toggleEditElements(false);

      document.getElementById('modifyModalContent').style.display = 'none';
      document.getElementById('modifyModalOverlay').style.display = 'none';
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
      toggleEditElements(false);
    }
  });

  document.getElementById('mdfBtn').addEventListener('click', function () {
    document.getElementById('modifyModalContent').style.display = 'block';
    document.getElementById('modifyModalOverlay').style.display = 'block';
  });

  document
    .getElementById('modifyModalOverlay')
    .addEventListener('click', function () {
      document.getElementById('modifyModalContent').style.display = 'none';
      document.getElementById('modifyModalOverlay').style.display = 'none';
    });
});
