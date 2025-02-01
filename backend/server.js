const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const dotenv = require('dotenv');

// Configuración
dotenv.config();
require('./config/passport-setup');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://inventario2.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
const authRoutes = require('./routes/auth');
const motorcycleRoutes = require('./routes/motorcycles');

app.use('/api/auth', authRoutes);
app.use('/api/motorcycles', motorcycleRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
