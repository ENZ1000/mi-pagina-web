const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();

    // Credenciales de prueba
    if (usernameInput === 'admin' && passwordInput === '1234') {
      window.location.href = 'home.html';
    } else {
      errorMsg.style.display = 'block';
    }
  });
}