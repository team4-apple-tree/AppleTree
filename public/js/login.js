$(document).on('click', '#loginbtn', async (e) => {
  e.preventDefault();

  const email = $('#loginId').val();
  const password = $('#password').val();

  const data = {
    email,
    password,
  };

  axios
    .post('http://localhost:4444/user/login', data)
    .then((response) => {
      console.log(response);
      alert('로그인 성공');
    })
    .catch((error) => {
      console.error(error);
      alert('로그인 실패');
    });
});
