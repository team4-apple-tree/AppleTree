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
    publicStudies = response.data.sort((a, b) => a.id - b.id); // 기본은 아이디 낮은 순으로 정렬

    displayPage(publicStudies, currentPage);
  } catch (error) {
    console.log(error);
    alert('실패');
  }
  // 기본 메인페이지 구동 스크립트
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
    publicStudies.sort((a, b) => a.id - b.id); // 아이디 낮은 순으로 정렬
    displayPage(publicStudies, currentPage);

    allButton.classList.add('active');
    newButton.classList.remove('active');
  });

  newButton.addEventListener('click', (event) => {
    event.preventDefault();
    currentPage = 1;
    publicStudies.sort((a, b) => b.id - a.id); // 아이디 높은 순으로 정렬
    displayPage(publicStudies, currentPage);

    allButton.classList.remove('active');
    newButton.classList.add('active');
  });
  // 기본 메인페이지 구동 스크립트

  // 내가 속한 스터디그룹 리스트

  await axios
    .get(`http://localhost:4444/group/my`, {
      headers: {
        Authorization: getCookie(),
      },
    })
    .then((response) => {
      //   const groupData = response.data;
      //   const groupNamePlaceholder = document.getElementById('아이디');
      //   groupNamePlaceholder.innerHTML = '';
      //   groupData.forEach((element) => {
      //     const p = document.createElement('p');
      //     p.innerText = element.name;
      //     groupNamePlaceholder.append(p);
      //   });
      // })
      const groupData = response.data;
      const groupNamePlaceholder = document.getElementById('mystudygroup');
      groupNamePlaceholder.innerHTML = ''; //
      groupData.forEach((element) => {
        const p = document.createElement('div');
        p.innerText = element.name; //
        groupNamePlaceholder.append(p); //
      });
      const p = document.createElement('p');
      p.innerText = groupData[0].name;

      // .catch((error) => {
      //   console.log('데이터를 가져오는 중 오류 발생:', error);
      // });

      $(document).on('click', '#createStudy', async () => {
        await axios
          .get('http://localhost:4444/user/isLogin', {
            headers: {
              Authorization: getCookie(),
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

      // 스터디 클릭 시 이벤트
      $(document).on('click', '.study-item-img-wrap', async (e) => {
        const studyId = e.target.parentNode.id;

        await axios
          .post(`http://localhost:4444/group/${studyId}/enter`, null, {
            headers: {
              Authorization: getCookie(),
            },
          })
          .then(() => {
            window.location.href = `room.html?id=${studyId}`;
          });
      });
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
                <span class="study-item-info-personnel present">7 </span>
                <span class="study-item-info-personnel maximum">/${publicStudy.max}</span>
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

  // 로그아웃 버어트으은

  // 로그아웃 버튼을 클릭했을 때 로그아웃 로직을 추가할 수도 있습니다.
  const logoutButton = document.getElementById('logoutButton');
  logoutButton.addEventListener('click', function () {
    // 로그아웃 처리 로직을 여기에 추가하세요.
    // 예를 들어 로그아웃 API 호출 또는 로컬 스토리지에서 로그인 정보 삭제 등
    // 로그아웃이 완료되면 다시 로그인 버튼과 회원가입 버튼을 표시할 수 있습니다.
  });
  function logoutBtn() {
    // 여기에서 로그인 상태를 확인하고 버튼을 제어하는 로직을 추가합니다.
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');
    const logoutButton = document.getElementById('logoutButton');
    const profileButton = document.getElementById('profileButton');

    // 로그인 상태를 확인하는 로직 (예시: 로그인이 되었다고 가정)

    const isLoggedIn = getCookie();
    if (isLoggedIn) {
      // 로그인한 경우
      loginButton.style.display = 'none'; // 로그인 버튼 숨김
      signupButton.style.display = 'none'; // 회원가입 버튼 숨김
      logoutButton.style.display = 'block'; // 로그아웃 버튼 표시
      profileButton.style.display = 'block';
    } else {
      loginButton.style.display = 'block'; // 로그인 버튼 숨김
      signupButton.style.display = 'block'; // 회원가입 버튼 숨김
      logoutButton.style.display = 'none'; // 로그아웃 버튼 표시
      profileButton.style.display = 'none';
    }
    logoutButton.addEventListener('click', async function () {
      await axios
        .get('http://localhost:4444/user/out')
        .then((response) => {
          alert('로그아웃이 성공적으로 완료 되었을까?', response);
          window.location.reload();
        })
        .catch((error) => {
          alert('로그아웃이 실패 했을까?', error);
        });
    });
  }
});

// 쿠키 값 가져오는 함수
function getCookie() {
  const cookie = decodeURIComponent(document.cookie);
  const [name, value] = cookie.split('=');
  return value;
}
