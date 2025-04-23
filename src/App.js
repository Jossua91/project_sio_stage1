import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://events.jossua-creuzet.fr/api/events';

function App() {
  // Etat pour gérer les événements
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    type: '',
    date: '',
    time: '',
    address: '',
    image: ''
  });

  // Etats pour la modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' ou 'edit'
  const [error, setError] = useState(null);

  // Charger les événements au démarrage
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erreur lors du chargement des événements');
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur:', err);
      setEvents([]);
    }
  };

  // Fonction pour ouvrir la modal de création
  const openCreateModal = () => {
    setModalMode('create');
    setNewEvent({
      name: '',
      description: '',
      type: '',
      date: '',
      time: '',
      address: '',
      image: ''
    });
    setIsModalOpen(true);
  };

  // Fonction pour ouvrir la modal d'édition
  const openEditModal = (index) => {
    setModalMode('edit');
    setSelectedEventIndex(index);
    setNewEvent(events[index]);
    setIsModalOpen(true);
  };

  // Fonction pour fermer la modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEventIndex(null);
    setError(null);
  };

  // Fonction pour sauvegarder un événement
  const saveEvent = async () => {
    try {
      const url = modalMode === 'create' ? API_URL : `${API_URL}/${events[selectedEventIndex].id}`;
      const method = modalMode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
      
      await fetchEvents();
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  // Fonction pour confirmer la suppression
  const confirmDelete = (index) => {
    setSelectedEventIndex(index);
    setIsDeleteConfirmOpen(true);
  };

  // Fonction pour annuler la suppression
  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setSelectedEventIndex(null);
  };

  // Fonction pour exécuter la suppression
  const executeDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/${events[selectedEventIndex].id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      await fetchEvents();
      setIsDeleteConfirmOpen(false);
      setSelectedEventIndex(null);
    } catch (err) {
      setError(err.message);
    }
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
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Événements</h1>
          <div className="flex space-x-4">
            <button 
              onClick={openCreateModal}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
            >
              Créer un événement
            </button>
          </div>
        </div>
      </nav>

      {/* Liste des événements */}
      <div className="container mx-auto p-6">
        <div className="flex flex-wrap gap-6 justify-center">
          {events.map((event, index) => (
            <div 
              key={index} 
              className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-1/2 lg:w-1/3 xl:w-1/5 flex flex-col items-center justify-between min-h-80"
            >
              <h2 className="text-xl font-semibold text-blue-600 text-center">{event.name}</h2>
              <div>
                <p className="text-gray-700">{event.description}</p><br/>
                <p className="text-gray-500"><strong>Type:</strong> {event.type}</p>
                <p className="text-gray-500"><strong>Date:</strong> {event.date} à {event.time}</p>
                <p className="text-gray-500"><strong>Adresse:</strong> {event.address}</p>
              </div>
              {event.image && (
                <div className="mt-4 w-full">
                  <img 
                    src={event.image} 
                    alt={event.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="mt-4 text-center flex gap-2">
                <button 
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  onClick={() => openEditModal(index)}
                >
                  Modifier
                </button>
                <button 
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600" 
                  onClick={() => confirmDelete(index)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de création/édition */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-6 overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {modalMode === 'create' ? 'Créer un événement' : 'Modifier l\'événement'}
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={newEvent.name}
                  onChange={handleChange}
                  placeholder="Nom de l'événement"
                  className="w-full p-2 border rounded"
                />
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="type"
                  value={newEvent.type}
                  onChange={handleChange}
                  placeholder="Type d'événement"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="time"
                  name="time"
                  value={newEvent.time}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="address"
                  value={newEvent.address}
                  onChange={handleChange}
                  placeholder="Adresse"
                  className="w-full p-2 border rounded"
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">URL de l'image</label>
                  <input
                    type="text"
                    name="image"
                    value={newEvent.image}
                    onChange={handleChange}
                    placeholder="URL de l'image"
                    className="w-full p-2 border rounded"
                  />
                  {newEvent.image && (
                    <div className="mt-2">
                      <img 
                        src={newEvent.image} 
                        alt="Aperçu"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  onClick={saveEvent}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
            <p className="mb-4">Êtes-vous sûr de vouloir supprimer cet événement ?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={executeDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;