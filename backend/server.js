require('dotenv').config();
const express = require('express');
const cors = require('cors');
const eventsRouter = require('./routes/events');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventsRouter);

// Test de la connexion à la base de données
db.query('SELECT 1')
  .then(() => console.log('Connecté à MySQL'))
  .catch(err => console.error('Erreur de connexion à MySQL:', err));

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 