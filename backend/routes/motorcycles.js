const router = require('express').Router();
const Motorcycle = require('../models/Motorcycle');
const auth = require('../middleware/auth');

// GET - Obtener todas las motocicletas
router.get('/', auth, async (req, res) => {
  try {
    const motorcycles = await Motorcycle.find()
      .populate('conductor', 'nombre apellido documento')
      .sort({ placa: 1 });
    res.json(motorcycles);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener motocicletas', error: error.message });
  }
});

// GET - Obtener una motocicleta por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const motorcycle = await Motorcycle.findById(req.params.id)
      .populate('conductor', 'nombre apellido documento');
    if (!motorcycle) {
      return res.status(404).json({ message: 'Motocicleta no encontrada' });
    }
    res.json(motorcycle);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la motocicleta', error: error.message });
  }
});

// POST - Crear nueva motocicleta
router.post('/', auth, async (req, res) => {
  try {
    const { placa, marca, modelo, año, conductor, seguro } = req.body;
    
    // Verificar si ya existe una moto con la misma placa
    const existingMotorcycle = await Motorcycle.findOne({ placa });
    if (existingMotorcycle) {
      return res.status(400).json({ message: 'Ya existe una motocicleta con esta placa' });
    }

    const motorcycle = new Motorcycle({
      placa,
      marca,
      modelo,
      año,
      conductor,
      seguro
    });

    const savedMotorcycle = await motorcycle.save();
    await savedMotorcycle.populate('conductor', 'nombre apellido documento');
    
    res.status(201).json(savedMotorcycle);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la motocicleta', error: error.message });
  }
});

// PUT - Actualizar motocicleta
router.put('/:id', auth, async (req, res) => {
  try {
    const { placa, marca, modelo, año, conductor, seguro } = req.body;
    
    // Verificar si existe otra moto con la misma placa (excepto la actual)
    const existingMotorcycle = await Motorcycle.findOne({ 
      placa, 
      _id: { $ne: req.params.id } 
    });
    if (existingMotorcycle) {
      return res.status(400).json({ message: 'Ya existe otra motocicleta con esta placa' });
    }

    const motorcycle = await Motorcycle.findByIdAndUpdate(
      req.params.id,
      { placa, marca, modelo, año, conductor, seguro },
      { new: true, runValidators: true }
    ).populate('conductor', 'nombre apellido documento');

    if (!motorcycle) {
      return res.status(404).json({ message: 'Motocicleta no encontrada' });
    }

    res.json(motorcycle);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la motocicleta', error: error.message });
  }
});

// DELETE - Eliminar motocicleta
router.delete('/:id', auth, async (req, res) => {
  try {
    const motorcycle = await Motorcycle.findByIdAndDelete(req.params.id);
    if (!motorcycle) {
      return res.status(404).json({ message: 'Motocicleta no encontrada' });
    }
    res.json({ message: 'Motocicleta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la motocicleta', error: error.message });
  }
});

// GET - Buscar motocicletas por placa o marca
router.get('/search/:term', auth, async (req, res) => {
  try {
    const searchTerm = req.params.term;
    const motorcycles = await Motorcycle.find({
      $or: [
        { placa: { $regex: searchTerm, $options: 'i' } },
        { marca: { $regex: searchTerm, $options: 'i' } }
      ]
    }).populate('conductor', 'nombre apellido documento');
    
    res.json(motorcycles);
  } catch (error) {
    res.status(500).json({ message: 'Error en la búsqueda de motocicletas', error: error.message });
  }
});

module.exports = router;
