const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
  conductor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  moto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Motorcycle',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  tipo: {
    type: String,
    enum: ['transito', 'municipal', 'otro'],
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'pagada', 'en_proceso'],
    default: 'pendiente'
  },
  numeroMulta: {
    type: String,
    required: true
  },
  entidad: {
    type: String,
    required: true
  },
  fechaVencimiento: {
    type: Date,
    required: true
  },
  observaciones: String
}, {
  timestamps: true
});
