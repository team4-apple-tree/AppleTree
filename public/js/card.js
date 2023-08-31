$(document).ready(async () => {
  const groupId = getQueryParam('id'); // 파라미터 이름을 전달
  const todo = $('.TODO');
  const inprogress = $('.IN_PROGRESS');
  const completed = $('.COMPLETED');

  await axios
    .get(`http://localhost:4444/card/room/${groupId}`)
    .then((response) => {
      const cards = response.data;

      cards.forEach((card) => {
        const { title, selectToDo } = card;

        const p = document.createElement('h1');

        p.innerText = title;

        p.classList.add('card-title');

        // 클릭 이벤트를 부착
        p.addEventListener('click', () => {
          const modalTitle = document.querySelector('.cardModal-title');
          const modalDescription = document.querySelector(
            '.cardModal-description',
          );
          const cardModal = document.getElementById('cardModal');

          modalTitle.innerText = title;
          modalDescription.innerText = card.desc;
          cardModal.style.display = 'block';

          // 모달 닫기 버튼 클릭 시 모달 닫기
          const closeCardModalBtn =
            document.getElementById('closeCardModalBtn');
          closeCardModalBtn.addEventListener('click', () => {
            const cardModal = document.getElementById('cardModal');
            cardModal.style.display = 'none';
          });
        });

        if (selectToDo === 1) {
          const todo = document.querySelector('.TODO');
          todo.appendChild(p); // Todo 리스트에 카드 추가
        } else if (selectToDo === 2) {
          const inprogress = document.querySelector('.IN_PROGRESS');
          inprogress.appendChild(p); // In Progress 리스트에 카드 추가
        } else {
          const completed = document.querySelector('.COMPLETED');
          completed.appendChild(p); // Completed 리스트에 카드 추가
        }
      });
    })
    .catch((response) => {
      console.error('에러가 났어요오옹~:', error);
    });
});

$(document).on('click', '#createCard', async () => {
  const groupId = getQueryParam('id'); // 파라미터 이름을 전달
  const title = $('#Title').val();
  const desc = $('#Descript').val();

  const data = {
    title,
    desc,
  };

  await axios
    .post(`http://localhost:4444/card/room/${groupId}`, data)
    .then((response) => {
      console.log(response);
      alert('카드 생성 성공');

      modal.style.display = 'none'; // 모달 닫기
    })
    .catch((response) => {
      console.log(response);

      alert('카드 생성 실패');
    });
});

// 모달 열기
const createCardBtn = document.getElementById('addCardBtn');
const modal = document.getElementById('myModal');
createCardBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

// 모달 닫기
const closeBtn = document.querySelector('.close');
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// 카드 추가 버튼 클릭 시
// const addCardBtn = document.getElementById('createCard');
// addCardBtn.addEventListener('click', async () => {
//   const title = document.getElementById('Title').value;
//   const description = document.getElementById('Descript').value;

//   if (title && description) {
//     try {
//       const groupId = getQueryParam('groupId');
//       await axios.post('http://localhost:4444/card/room/${groupId}', {
//         title,
//         desc: description,
//       });

//       // 카드 추가 성공한 경우의 처리
//       modal.style.display = 'none'; // 모달 닫기
//       // 다시 카드 정보를 가져와서 화면에 추가하는 로직
//     } catch (error) {
//       console.error('Error adding card:', error);
//     }
//   }
// });

// 현재 페이지의 쿼리 스트링 파싱 함수
function getQueryParam(key) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get(key);
}
