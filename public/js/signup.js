let AuthResult = false;

// 회원가입
$(document).on('click', '#signinbtn', async (e) => {
  const email = $('#signloginId').val();
  const password = $('#signpassword').val();
  const confirm = $('#signpasswordConfirm').val();
  const name = $('#signnickname').val();

  if (!email) {
    alert('이메일을 입력해주세요.');

    return;
  }
  e.preventDefault();

  if (AuthResult === true) {
    const data = {
      email,
      password,
      confirm,
      name,
    };

    await axios
      .post('/user/sign', data)
      .then((response) => {
        console.log(response);
        alert('회원가입 성공');

        window.location.href = '/login.html';
      })
      .catch((error) => {
        console.error(error);
        alert(error.response.data.message[0]);
      });
  } else {
    alert('이메일 인증을 해주세요.');
  }
});

// 이메일 인증 요청 버튼 클릭 이벤트
$(document).on('click', '#authBtn', async (e) => {
  e.preventDefault();
  const email = $('#signloginId').val();

  const data = {
    email,
  };

  await axios
    .post('/user/auth', data)
    .then((response) => {
      console.log(response);

      alert('이메일로 전송된 인증코드를 입력해주세요.');

      document.querySelector('.auth_code').style.display = 'block';
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
});

// 인증코드 확인 클릭 이벤트
$(document).on('click', '#codeBtn', async (e) => {
  e.preventDefault();

  const email = $('#signloginId').val();
  const code = $('#codeInput').val();

  const data = {
    email,
    code: +code,
  };

  await axios
    .post('/user/auth/code', data)
    .then((response) => {
      AuthResult = response.data;

      if (AuthResult === true) {
        alert('인증 성공');

        document.querySelector('.auth_code').style.display = 'none';
      } else {
        alert('인증 실패');
      }
    })
    .catch((error) => {
      alert('인증 실패');

      document.querySelector('.auth_code').style.display = 'none';
    });
});
