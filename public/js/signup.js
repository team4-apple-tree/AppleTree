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
    .post('/user/sign', data)
    .then((response) => {
      console.log(response);
      alert('회원가입 성공');

      window.location.href = '/login.html';
    })
    .catch((error) => {
      console.error(error);
      alert(error.response.data.message);
    });
});
