const API_URL = 'https://inventario-backend.onrender.com';

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') {
        window.location.href = '/login.html';
        return;
    }

    // Configurar nombre de usuario
    document.getElementById('userName').textContent = user.username;

    // Manejar cierre de sesión
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });

    // Cargar estadísticas
    loadDashboardStats();
    loadRecentActivity();
});

async function loadDashboardStats() {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Cargar total de motocicletas
        const motorcyclesResponse = await fetch(`${API_URL}/api/motorcycles`, {
            headers
        });
        const motorcyclesData = await motorcyclesResponse.json();
        document.getElementById('totalMotorcycles').textContent = motorcyclesData.length;

        // Aquí irían más llamadas a la API para obtener otras estadísticas
        // Por ahora usaremos datos de ejemplo
        document.getElementById('activeDrivers').textContent = '15';
        document.getElementById('pendingFines').textContent = '8';
        document.getElementById('monthlyPayments').textContent = '$2,500';

    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

async function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    
    // Ejemplo de actividades recientes
    const activities = [
        {
            type: 'motorcycle',
            text: 'Nueva motocicleta registrada',
            details: 'Placa: ABC123',
            time: '2 minutos atrás'
        },
        {
            type: 'user',
            text: 'Nuevo conductor registrado',
            details: 'Juan Pérez',
            time: '1 hora atrás'
        },
        {
            type: 'fine',
            text: 'Multa registrada',
            details: 'Monto: $100',
            time: '3 horas atrás'
        },
        {
            type: 'payment',
            text: 'Pago recibido',
            details: 'Monto: $250',
            time: '5 horas atrás'
        }
    ];

    // Limpiar lista actual
    activityList.innerHTML = '';

    // Agregar actividades a la lista
    activities.forEach(activity => {
        const li = document.createElement('li');
        li.className = 'activity-item';

        const icon = getActivityIcon(activity.type);
        
        li.innerHTML = `
            <div class="activity-icon">
                <i class="${icon}"></i>
            </div>
            <div class="activity-details">
                <h4>${activity.text}</h4>
                <p>${activity.details}</p>
                <small>${activity.time}</small>
            </div>
        `;

        activityList.appendChild(li);
    });
}

function getActivityIcon(type) {
    const icons = {
        motorcycle: 'fas fa-motorcycle',
        user: 'fas fa-user',
        fine: 'fas fa-exclamation-triangle',
        payment: 'fas fa-money-bill-wave'
    };
    return icons[type] || 'fas fa-info-circle';
}

// Actualizar estadísticas cada 5 minutos
setInterval(loadDashboardStats, 5 * 60 * 1000);
// Actualizar actividad reciente cada 2 minutos
setInterval(loadRecentActivity, 2 * 60 * 1000);
