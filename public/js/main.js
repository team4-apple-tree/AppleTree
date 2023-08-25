$(document).ready(async () => {
  const pageSize = 15; // 한 페이지에 보여줄 데이터 개수
  let currentPage = 1; // 현재 페이지 초기화
  let publicStudies = []; // 모든 데이터를 저장할 배열

  // 페이지에 따라 데이터를 표시하는 함수
  const displayPage = (page) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageData = publicStudies.slice(startIndex, endIndex);

    const studyBody = document.querySelector('.studies-body');

    // 이전 데이터를 비우고 새로운 데이터만 추가하여 표시
    if (page === 1) {
      studyBody.innerHTML = '';
    }

    for (const publicStudy of currentPageData) {
      postingPublicStudies(publicStudy, studyBody);
    }
  };

  // 데이터를 모두 가져와서 배열에 저장
  try {
    const response = await axios.get('http://localhost:4444/group/');
    publicStudies = response.data.reverse(); // 최신 데이터가 맨 앞에 오도록 배열 뒤집기

    // 초기 페이지 로드
    displayPage(currentPage);
  } catch (error) {
    console.log(error);
    alert('실패');
  }

  const loadMoreButton = document.createElement('button');
  loadMoreButton.textContent = ' 더보기 ';
  loadMoreButton.classList.add('load-more-button');
  loadMoreButton.onclick = () => {
    currentPage++; // 다음 페이지로 이동
    displayPage(currentPage); // 다음 페이지 데이터 추가로 표시
  };

  const studiesContent = document.querySelector('.studies-contents');
  studiesContent.appendChild(loadMoreButton);
});

function postingPublicStudies(publicStudy, studyBody) {
  const tempDiv = document.createElement('div');

  tempDiv.className = 'study-item-list flex-wrap';
  tempDiv.innerHTML = `
        <div class="study-item-img-wrap">
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
