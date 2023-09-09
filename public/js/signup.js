$(document).on('click', '#signinbtn', async (e) => {
  e.preventDefault();

  const email = $('#signloginId').val();
  const password = $('#signpassword').val();
  const confirm = $('#signpasswordConfirm').val();
  const name = $('#signnickname').val();

  const data = {
    email,
    password,
    confirm,
    name,
  };

  axios
    .post('http://localhost:4444/user/sign', data)
    .then((response) => {
      console.log(response);
      alert('회원가입 성공');

      window.location.href = 'http://localhost:4444/login.html';
    })
    .catch((error) => {
      console.error(error);
      alert('회원가입 실패');
    });
});
