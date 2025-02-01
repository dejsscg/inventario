const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
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
  fechaProgramada: {
    type: Date,
    required: true
  },
  fechaPago: {
    type: Date
  },
  monto: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'pagado', 'atrasado', 'perdonado'],
    default: 'pendiente'
  },
  semana: {
    type: Number,
    required: true
  },
  año: {
    type: Number,
    required: true
  },
  metodoPago: {
    type: String,
    enum: ['efectivo', 'transferencia', 'otro'],
    required: true
  },
  comprobante: String,
  observaciones: String
}, {
  timestamps: true
});
