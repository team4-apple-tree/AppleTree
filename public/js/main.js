$(document).ready(async () => {
  const pageSize = 15;
  let currentPage = 1;
  let publicStudies = [];
  logoutBtn();

  const displayPage = (data, page) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageData = data.slice(startIndex, endIndex);

    const studyBody = document.querySelector('.studies-body');

    if (page === 1) {
      studyBody.innerHTML = '';
    }

    for (const publicStudy of currentPageData) {
      postingPublicStudies(publicStudy, studyBody);
    }
  };

  try {
    const response = await axios.get('http://localhost:4444/group/');
    publicStudies = response.data.sort((a, b) => a.id - b.id);
    displayPage(publicStudies, currentPage);
  } catch (error) {
    console.log(error);
    alert('조회 실패');
  }

  const loadMoreButton = document.createElement('button');
  loadMoreButton.textContent = ' 더보기 ';
  loadMoreButton.classList.add('load-more-button');
  loadMoreButton.onclick = () => {
    currentPage++;
    displayPage(publicStudies, currentPage);
  };

  const studiesContent = document.querySelector('.studies-contents');
  studiesContent.appendChild(loadMoreButton);

  const horizontalLine = document.createElement('hr');
  horizontalLine.classList.add('horizontal-line');
  studiesContent.appendChild(horizontalLine);

  const allButton = document.querySelector(
    '.studies-tab-btn[data-study-tab="all"]',
  );
  const newButton = document.querySelector(
    '.studies-tab-btn[data-study-tab="new"]',
  );

  allButton.addEventListener('click', (event) => {
    event.preventDefault();
    currentPage = 1;
    publicStudies.sort((a, b) => a.id - b.id);
    displayPage(publicStudies, currentPage);

    allButton.classList.add('active');
    newButton.classList.remove('active');
  });

  newButton.addEventListener('click', (event) => {
    event.preventDefault();
    currentPage = 1;
    publicStudies.sort((a, b) => b.id - a.id);
    displayPage(publicStudies, currentPage);

    allButton.classList.remove('active');
    newButton.classList.add('active');
  });

  // 내 스터디 조회
  if (getCookie('Authorization')) {
    await axios
      .get(`http://localhost:4444/group/myGroup`, {
        headers: {
          Authorization: getCookie('Authorization'),
        },
      })
      .then((response) => {
        const groups = response.data;
        const groupNamePlaceholder = document.getElementById('mystudygroup');

        if (groups.length) {
          groupNamePlaceholder.innerHTML = '';
        }

        groups.forEach((group) => {
          const div = document.createElement('div');
          div.innerText = group.group.name;
          div.id = group.group.id;
          div.className = 'study-item-img-wrap';
          groupNamePlaceholder.append(div);
        });
      })
      .catch((response) => {
        console.log(response);

        alert('실패');
      });
  }

  $(document).on('click', '#createStudy', async () => {
    await axios
      .get('http://localhost:4444/user/isLogin', {
        headers: {
          Authorization: getCookie('Authorization'),
        },
      })
      .then(() => {
        window.location.href = 'createstudygroup.html';
      })
      .catch((response) => {
        if (response.response.data.error === 'Forbidden') {
          alert('로그인이 필요한 기능입니다.');
        }
      });
  });
  // 기존에 있던 스터디 그룹 클릭 이벤트
  $(document).on('click', '.study-item-img-wrap', async (e) => {
    const studyItem = e.target.closest('.study-item-img-wrap');
    const studyId = studyItem.id;
    const count = studyItem.querySelector('#count').textContent;
    const max = studyItem.querySelector('#max').textContent.slice(1);

    if (count < max) {
      try {
        const isPasswordResponse = await axios.get(
          `http://localhost:4444/group/${studyId}/is-password-protected`,
        );
        if (isPasswordResponse.data.isPassword) {
          // 비밀번호 보호되어 있을 때 팝업 모달 띄우기
          document.getElementById('passwordModal').style.display = 'block';
          document.getElementById('passwordModal').dataset.currentStudyItemId =
            studyId;
        } else {
          window.location.href = `room.html?id=${studyId}`;
        }
      } catch (error) {
        console.error('Error checking if group is password protected:', error);
      }
    } else {
      alert('인원을 초과하여 입장할 수 없습니다.');
    }
  });

  const modal = document.getElementById('passwordModal');
  const closeModal = document.getElementById('closeModal');
  const submitPassword = document.getElementById('submitPassword');

  closeModal.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  submitPassword.addEventListener('click', async function () {
    const currentStudyItemId =
      document.getElementById('passwordModal').dataset.currentStudyItemId;
    const inputPassword = document.getElementById('passwordInput').value;

    try {
      const verifyResponse = await axios.post(
        `http://localhost:4444/group/${currentStudyItemId}/verify-password`,
        {
          password: inputPassword,
        },
      );

      if (verifyResponse.data.success) {
        // 수정된 부분
        window.location.href = `room.html?id=${currentStudyItemId}`;
      } else {
        alert('비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
    }
  });

  function postingPublicStudies(publicStudy, studyBody) {
    const tempDiv = document.createElement('div');
    tempDiv.className = 'study-item-list flex-wrap';
    tempDiv.innerHTML = `
    <div class="study-item-img-wrap" id="${publicStudy.id}">
    <img
    src="${publicStudy.image}"
    alt="study-img"
    class="study-item-img"
    />
    <div class="study-item-info-cover">
    <div class="study-item-info-badge-wrap">
        <!---->
        <!---->
        <!---->
    </div>
    <!---->
    <div class="study-item-info-personnel-wrap">
        <span id="count" class="study-item-info-personnel present">${publicStudy.count} </span>
        <span id="max" class="study-item-info-personnel maximum">/${publicStudy.max}</span>
    </div>
    <div class="room-more-view-btn-area"><!----></div>
    <!---->
    </div>
</div>
<div class="study-item-tx-wrap">
    <em class="study-item-tx title">${publicStudy.name}</em>
    <div class="study-item-tx-hashtag-wrap"></div>
</div>
  `;

    studyBody.appendChild(tempDiv);
  }

  const logoutButton = document.getElementById('logoutButton');
  logoutButton.addEventListener('click', function () {
    // 로그아웃 처리 로직을 여기에 추가하세요.
  });

  function logoutBtn() {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');
    const logoutButton = document.getElementById('logoutButton');
    const profileButton = document.getElementById('profileButton');

    const isLoggedIn = getCookie('Authorization');
    if (isLoggedIn) {
      loginButton.style.display = 'none';
      signupButton.style.display = 'none';
      logoutButton.style.display = 'block';
      profileButton.style.display = 'block';
    } else {
      loginButton.style.display = 'block';
      signupButton.style.display = 'block';
      logoutButton.style.display = 'none';
      profileButton.style.display = 'none';
    }

    logoutButton.addEventListener('click', async function () {
      await axios
        .get('http://localhost:4444/user/out')
        .then((response) => {
          alert('로그아웃이 성공적으로 완료 되었습니다.', response);
          window.location.reload();
        })
        .catch((error) => {
          alert('로그아웃이 실패했습니다.', error);
        });
    });
  }

  // function getCookie() {
  //   const cookie = decodeURIComponent(document.cookie);
  //   const [name, value] = cookie.split(';')[0].split('=');
  //   console.log(cookie);
  //   // console.log(value);
  //   return value;
  // }
  function getCookie(name) {
    const value = decodeURIComponent(document.cookie).match(
      '(^|;) ?' + name + '=([^;]*)(;|$)',
    );
    return value ? value[2] : null;
  }
});
