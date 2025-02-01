const mongoose = require('mongoose');

const motorcycleSchema = new mongoose.Schema({
  placa: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  marca: {
    type: String,
    required: true,
    trim: true
  },
  modelo: {
    type: String,
    required: true,
    trim: true
  },
  año: {
    type: Number,
    required: true
  },
  conductor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  seguro: {
    tiene: {
      type: Boolean,
      default: false
    },
    fechaVencimiento: Date,
    compañia: String,
    numeroPoliza: String
  },
  mantenimiento: {
    ultimoMantenimiento: Date,
    proximoMantenimiento: Date,
    kilometraje: Number,
    observaciones: String
  },
  estado: {
    type: String,
    enum: ['activa', 'inactiva', 'mantenimiento', 'suspendida'],
    default: 'activa'
  }
}, {
  timestamps: true
});
