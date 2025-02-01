document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loading = document.getElementById('loading');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Mostrar loading y ocultar mensaje de error
        loading.style.display = 'block';
        errorMessage.style.display = 'none';
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar el token en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Verificar si el usuario es admin
                if (data.user.role === 'admin') {
                    // Redirigir al dashboard
                    window.location.href = '/dashboard.html';
                } else {
                    errorMessage.textContent = 'Acceso no autorizado. Solo administradores.';
                    errorMessage.style.display = 'block';
                }
            } else {
                throw new Error(data.message || 'Error en el inicio de sesión');
            }
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    });
});
