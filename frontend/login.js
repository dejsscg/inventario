const API_URL = 'https://inventario-backend.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const adminForm = document.getElementById('adminForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const loading = document.getElementById('loading');
    const tabs = document.querySelectorAll('.tab');

    // Manejo de tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover clase active de todos los tabs y forms
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.form-container').forEach(form => form.classList.remove('active'));
            
            // Activar el tab y form seleccionado
            tab.classList.add('active');
            const formId = `${tab.dataset.form}Form`;
            document.getElementById(formId).classList.add('active');
            
            // Limpiar mensajes
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';
        });
    });

    // Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        
        showLoading();
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.get('username'),
                    password: formData.get('password')
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                if (data.user.role === 'admin') {
                    window.location.href = '/dashboard.html';
                } else {
                    showError('Acceso no autorizado. Solo administradores.');
                }
            } else {
                throw new Error(data.message || 'Error en el inicio de sesión');
            }
        } catch (error) {
            showError(error.message);
        } finally {
            hideLoading();
        }
    });

    // Registro de Usuario
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        
        if (formData.get('password') !== formData.get('confirmPassword')) {
            showError('Las contraseñas no coinciden');
            return;
        }

        showLoading();
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.get('username'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    role: 'user'
                })
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess('Usuario registrado exitosamente. Por favor, inicia sesión.');
                registerForm.reset();
                // Cambiar a la pestaña de login después de 2 segundos
                setTimeout(() => {
                    document.querySelector('[data-form="login"]').click();
                }, 2000);
            } else {
                throw new Error(data.message || 'Error en el registro');
            }
        } catch (error) {
            showError(error.message);
        } finally {
            hideLoading();
        }
    });

    // Registro de Administrador
    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(adminForm);
        
        if (formData.get('password') !== formData.get('confirmPassword')) {
            showError('Las contraseñas no coinciden');
            return;
        }

        showLoading();
        try {
            const response = await fetch(`${API_URL}/api/auth/register-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.get('username'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    adminCode: formData.get('adminCode'),
                    role: 'admin'
                })
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess('Administrador registrado exitosamente. Por favor, inicia sesión.');
                adminForm.reset();
                // Cambiar a la pestaña de login después de 2 segundos
                setTimeout(() => {
                    document.querySelector('[data-form="login"]').click();
                }, 2000);
            } else {
                throw new Error(data.message || 'Error en el registro de administrador');
            }
        } catch (error) {
            showError(error.message);
        } finally {
            hideLoading();
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
    }

    function showLoading() {
        loading.style.display = 'block';
    }

    function hideLoading() {
        loading.style.display = 'none';
    }
});
