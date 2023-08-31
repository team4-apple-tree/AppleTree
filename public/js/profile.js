// const submitProfileBtn = document.getElementById('submitProfileBtn');

// submitProfileBtn.addEventListener('click', async () => {
//   const name = document.querySelector('input[name="userNickname"]').value;
//   const 각오 = document.querySelector('.profileTxarea').value;
//   const email = document.querySelector('.emailAddress-tx').textContent;

//   const data = {
//     name,
//     각오,
//     email,
//   };

//   try {
//     const response = await fetch(`http://localhost:4444/user/${userId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       // 성공적으로 업데이트되었을 때의 처리
//     } else {
//       // 업데이트에 실패한 경우의 처리
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }
// });
