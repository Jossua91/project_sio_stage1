const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Récupérer tous les événements
router.get('/', async (req, res) => {
  try {
    const [events] = await db.query('SELECT * FROM events');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un nouvel événement
router.post('/', async (req, res) => {
  try {
    const { name, description, type, date, time, address, image } = req.body;
    const [result] = await db.query(
      'INSERT INTO events (name, description, type, date, time, address, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, type, date, time, address, image]
    );
    const [newEvent] = await db.query('SELECT * FROM events WHERE id = ?', [result.insertId]);
    res.status(201).json(newEvent[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un événement
router.put('/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const { name, description, type, date, time, address, image } = req.body;
    
    // Vérifier d'abord si l'événement existe
    const [existingEvent] = await db.query('SELECT * FROM events WHERE id = ?', [eventId]);
    if (existingEvent.length === 0) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    // Mettre à jour l'événement
    await db.query(
      'UPDATE events SET name = ?, description = ?, type = ?, date = ?, time = ?, address = ?, image = ? WHERE id = ?',
      [name, description, type, date, time, address, image, eventId]
    );

    // Récupérer l'événement mis à jour
    const [updatedEvent] = await db.query('SELECT * FROM events WHERE id = ?', [eventId]);
    res.json(updatedEvent[0]);
  } catch (err) {
    console.error('Erreur lors de la mise à jour:', err);
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un événement
router.delete('/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    // Vérifier d'abord si l'événement existe
    const [existingEvent] = await db.query('SELECT * FROM events WHERE id = ?', [eventId]);
    if (existingEvent.length === 0) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    // Supprimer l'événement
    await db.query('DELETE FROM events WHERE id = ?', [eventId]);
    res.json({ message: 'Événement supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 