async function logout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
        console.error(err);
    }
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorBox = document.getElementById('login-error');
    const titleEl = document.getElementById('auth-title');
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleBtn = document.getElementById('toggle-auth-mode');
    const passwordInput = document.getElementById('password');

    let isRegisterMode = false;

    if (loginForm) {
        if (localStorage.getItem('token')) {
            window.location.href = 'admin.html';
            return;
        }

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isRegisterMode = !isRegisterMode;
            errorBox.textContent = '';
            errorBox.style.color = '';

            if (isRegisterMode) {
                titleEl.textContent = 'Створити адміністратора';
                submitBtn.textContent = 'Зареєструватися';
                toggleBtn.textContent = 'Вже є акаунт? Увійти';
                passwordInput.autocomplete = 'new-password';
            } else {
                titleEl.textContent = 'Вхід в систему';
                submitBtn.textContent = 'Увійти';
                toggleBtn.textContent = 'Створити адміністратора';
                passwordInput.autocomplete = 'current-password';
            }
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorBox.textContent = '';
            errorBox.style.color = '';

            const email = document.getElementById('email').value.trim();
            const password = passwordInput.value;
            const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';

            try {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (!res.ok) {
                    errorBox.textContent = data.error || 'Помилка авторизації';
                    return;
                }

                if (data.token) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'admin.html';
                } else if (isRegisterMode) {
                    errorBox.style.color = '#2e7d32';
                    errorBox.textContent = 'Адміністратора створено. Підтвердіть email або увійдіть.';
                    toggleBtn.click();
                }
            } catch (err) {
                errorBox.textContent = 'Сервер не відповідає';
            }
        });
    }
});