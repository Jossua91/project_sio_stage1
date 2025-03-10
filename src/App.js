import { useState } from 'react';
import './App.css';

function App() {
  // Etat pour gérer les événements
  const [events, setEvents] = useState([
    {
      name: 'Concert de Rock',
      description: 'Un concert incroyable avec des groupes locaux.',
      type: 'Musique',
      date: '2025-05-10',
      time: '20:00',
      address: 'Salle de concert ABC, Paris',
    },
    {
      name: 'Conférence Tech',
      description: 'Conférence sur les dernières innovations en technologie.',
      type: 'Conférence',
      date: '2025-06-01',
      time: '09:00',
      address: 'Université XYZ, Lyon',
    },
    {
      name: 'Marché Local',
      description: 'Marché avec des produits frais de producteurs locaux.',
      type: 'Marché',
      date: '2025-04-15',
      time: '08:00',
      address: 'Place du Marché, Bordeaux',
    },
  ]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    type: '',
    date: '',
    time: '',
    address: ''
  });

  // Fonction pour ajouter un événement
  const addEvent = () => {
    if (newEvent.name && newEvent.description && newEvent.type && newEvent.date && newEvent.time && newEvent.address) {
      setEvents([...events, newEvent]);
      setNewEvent({
        name: '',
        description: '',
        type: '',
        date: '',
        time: '',
        address: ''
      });
    }
  };

  // Fonction pour supprimer un événement
  const deleteEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  // Fonction pour mettre à jour un champ de l'événement
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  return (
    <div className="App bg-gray-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Événements</h1>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:text-gray-200">Ajouter un événement</a></li>
          </ul>
        </div>
      </nav>

      {/* Liste des événements */}
      <div className="container mx-auto p-4 flex flex-col space-y-8 mt-6">
        {events.map((event, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold text-blue-600">{event.name}</h2>
            <p className="text-gray-700">{event.description}</p>
            <p className="text-gray-500"><strong>Type:</strong> {event.type}</p>
            <p className="text-gray-500"><strong>Date:</strong> {event.date} à {event.time}</p>
            <p className="text-gray-500"><strong>Adresse:</strong> {event.address}</p>
            <button className="self-start mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;