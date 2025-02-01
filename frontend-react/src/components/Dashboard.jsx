import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  ExitToApp as LogoutIcon,
  Motorcycle as MotorcycleIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://inventario-backend.onrender.com';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMotorcycles: 0,
    recentActivity: []
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const motorcyclesResponse = await fetch(`${API_URL}/api/motorcycles`, {
        headers
      });
      const motorcyclesData = await motorcyclesResponse.json();

      setStats({
        totalMotorcycles: motorcyclesData.length,
        recentActivity: motorcyclesData.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            {user.username}
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Estadísticas
              </Typography>
              <Card>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <MotorcycleIcon fontSize="large" color="primary" />
                    </Grid>
                    <Grid item>
                      <Typography variant="h5">
                        {stats.totalMotorcycles}
                      </Typography>
                      <Typography color="textSecondary">
                        Motocicletas Totales
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Actividad Reciente
              </Typography>
              <List>
                {stats.recentActivity.map((motorcycle, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={motorcycle.marca + ' ' + motorcycle.modelo}
                      secondary={`Año: ${motorcycle.año} - Precio: $${motorcycle.precio}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
