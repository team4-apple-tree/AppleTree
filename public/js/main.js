$(document).ready(async () => {
  await axios
    .get('http://localhost:4444/group/')
    .then((response) => {
      const publicStudies = response.data;
      const studyBody = document.querySelector('.studies-body');

      for (const publicStudy of publicStudies) {
        postingPublicStudies(publicStudy, studyBody);
      }
    })
    .catch((response) => {
      console.log(response);

      alert('실패');
    });
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
