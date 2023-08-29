$(document).ready(async () => {
  const pageSize = 15;
  let currentPage = 1;
  let publicStudies = [];

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

    console.log(getCookie());

    await axios
      .post(`http://localhost:4444/group/enter/${studyId}`, null, {
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

// 쿠키 값 가져오는 함수
function getCookie() {
  const cookie = decodeURIComponent(document.cookie);
  const [name, value] = cookie.split('=');
  return value;
}
