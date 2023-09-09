$(document).ready(async () => {
  const groupId = getQueryParam('id');
  loadCards(groupId);
});

function clearModalData() {
  $('#Title').val('');
  $('#Descript').val('');
}

async function loadCards(groupId) {
  await axios
    .get(`http://localhost:4444/card/room/${groupId}`)
    .then((response) => {
      const cards = response.data;
      renderCards(cards);
    })
    .catch((error) => {
      console.error('에러가 발생했습니다:', error);
    });
}

function renderCards(cards) {
  cards.forEach((card) => {
    const { title, selectToDo, cardId, desc } = card; // card.desc도 추가해주었습니다.
    const p = createCardElement(title, selectToDo, cardId, desc);
    appendCardToColumn(p, selectToDo);
  });
}

function createCardElement(title, selectToDo, cardId, desc) {
  const p = document.createElement('h1');
  p.innerText = title;
  p.classList.add('card-title');
  p.setAttribute('id', cardId);
  p.addEventListener('click', () => {
    const modalTitle = document.querySelector('.cardModal-title');
    const modalDescription = document.querySelector('.cardModal-description');
    const cardModal = document.getElementById('cardModal');
    const cardModalButton = document.querySelector('.cardModal-buttons');

    modalTitle.value = title;
    modalDescription.innerText = desc;
    cardModal.style.display = 'block';
    cardModalButton.id = cardId;

    const closeCardModalBtn = document.getElementById('closeCardModalBtn');
    closeCardModalBtn.addEventListener('click', () => {
      cardModal.style.display = 'none';
    });
  });

  return p;
}

function appendCardToColumn(cardElement, selectToDo) {
  if (selectToDo === 1) {
    $('.TODO').append(cardElement);
  } else if (selectToDo === 2) {
    $('.IN_PROGRESS').append(cardElement);
  } else {
    $('.COMPLETED').append(cardElement);
  }
}

$(document).on('click', '#createCard', async () => {
  const groupId = getQueryParam('id');
  const title = $('#Title').val();
  const desc = $('#Descript').val();

  const data = {
    title,
    desc,
  };

  await axios
    .post(`http://localhost:4444/card/room/${groupId}`, data)
    .then((response) => {
      const newCard = response.data; // 서버에서 반환된 새 카드 데이터
      const { title, selectToDo, cardId } = newCard;

      const p = createCardElement(title, selectToDo, cardId, desc);
      appendCardToColumn(p, selectToDo);

      alert('카드 생성 성공');
      clearModalData();
      modal.style.display = 'none';
    })
    .catch((response) => {
      console.log(response);
      alert('카드 생성 실패');
    });
});

// 카드 수정
let checkUpdateBtn = true;
$(document).on('click', '#updateCard', async (e) => {
  if (checkUpdateBtn) {
    checkUpdateBtn = false;

    const updatedTitle = $('#titleInput');
    const updatedDesc = $('#descInput');

    updatedTitle.removeAttr('readonly');
    updatedTitle.select();

    updatedDesc.removeAttr('readonly');
  } else {
    const cardId = e.target.parentNode.id;
    const updatedTitle = $('#titleInput').val();
    const updatedDescription = $('#descInput').val();
    const selectedStatus = $('#statusSelect').val();

    console.log(updatedTitle);
    console.log(updatedDescription);
    console.log(selectedStatus);

    // selectedStatus가 유효한 숫자로 변환 가능한지 확인하고, 그렇지 않다면 기본값으로 처리합니다.
    const selectToDo =
      !isNaN(parseInt(selectedStatus)) &&
      [1, 2, 3].includes(parseInt(selectedStatus))
        ? parseInt(selectedStatus)
        : 1;

    const updatedData = {
      title: updatedTitle,
      desc: updatedDescription,
      selectToDo: selectToDo, // selectToDo를 숫자로 설정합니다.
    };
    console.log(updatedData);
    await axios
      .put(`http://localhost:4444/card/${cardId}`, updatedData)
      .then(() => {
        alert('수정 성공');
        const cardToUpdate = document.querySelector(
          `.card-title[id="${cardId}"]`,
        );
        if (cardToUpdate) {
          cardToUpdate.innerText = updatedTitle;
          const cardDescription = cardToUpdate.nextElementSibling; // 가정: 설명이 제목 바로 다음에 위치한다.
          if (
            cardDescription &&
            cardDescription.classList.contains('card-description')
          ) {
            cardDescription.innerText = updatedDescription;
          }
          cardToUpdate.remove();
          appendCardToColumn(cardToUpdate, selectToDo);

          // status (즉, selectToDo) 업데이트
          // 기존의 컬럼에서 카드를 제거하고, 새로운 selectToDo 값에 따라 해당 카드를 적절한 컬럼에 다시 추가
          cardToUpdate.remove();
          appendCardToColumn(cardToUpdate, selectToDo);
        }

        const cardModal = document.getElementById('cardModal');
        cardModal.style.display = 'none';
      })
      .catch((response) => {
        console.log(response);

        alert('수정 실패');
      });
  }
});

// 카드 삭제
$(document).on('click', '#deleteCard', async (e) => {
  const cardId = e.target.parentNode.id;

  await axios
    .delete(`http://localhost:4444/card/${cardId}`)
    .then(() => {
      alert('삭제 성공');

      const cardToDelete = document.querySelector(
        `.card-title[id="${cardId}"]`,
      );
      if (cardToDelete) {
        cardToDelete.remove();
      }

      const cardModal = document.getElementById('cardModal');
      cardModal.style.display = 'none';
    })
    .catch((response) => {
      console.log(response);

      alert('삭제 실패');
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
  clearModalData();
});

// 현재 페이지의 쿼리 스트링 파싱 함수
function getQueryParam(key) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get(key);
}

console.log('test1');
