import React, { useState, useEffect } from 'react';
import './index.css';

export default function RapportJournalier() {
  const [formData, setFormData] = useState({
    magasin: '',
    livraisons: '',
    chiffre: '',
    rendezVous: '',
    employe: ''
  });

  const [historique, setHistorique] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [rapportAffiche, setRapportAffiche] = useState(null);

  // ✅ Détecter le magasin automatiquement depuis le localStorage
  useEffect(() => {
    const utilisateur = JSON.parse(localStorage.getItem('utilisateurConnecte')) || {};
    const magasin = utilisateur.magasin || 'Non défini';
    setFormData(prev => ({ ...prev, magasin }));
  }, []);

  // Charger les anciens rapports si disponibles
  useEffect(() => {
    const stock = JSON.parse(localStorage.getItem('rapportsJournaliers')) || {};
    setHistorique(stock);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];

    const updatedForm = { ...formData };
    const stock = JSON.parse(localStorage.getItem('rapportsJournaliers')) || {};
    stock[today] = updatedForm;
    localStorage.setItem('rapportsJournaliers', JSON.stringify(stock));
    setHistorique(stock);

    setFormData(prev => ({
      ...prev,
      livraisons: '',
      chiffre: '',
      rendezVous: '',
      employe: ''
    }));

    const rapportData = {
      date: today,
      ...updatedForm
    };

    try {
      const response = await fetch('https://optiw-backend.onrender.com/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rapportData)
      });

      if (response.ok) {
        alert('✅ Rapport enregistré et envoyé par email.');
      } else {
        const data = await response.json();
        console.error('Erreur serveur :', data);
        alert('❌ Rapport sauvegardé mais erreur d’envoi du mail.');
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
      alert('❌ Rapport sauvegardé mais erreur de connexion au serveur.');
    }
  };

  const handleDateSelect = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setRapportAffiche(historique[date]);
  };

  const datesDisponibles = Object.keys(historique).sort().reverse();

  return (
    <div className="rapport-journalier-container">
      <h2>📋 Rapport Journalier</h2>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="magasin" value={formData.magasin} />

        <div className="champ-bloc">
          <label>Nombre de livraisons</label>
          <input type="number" name="livraisons" value={formData.livraisons} onChange={handleChange} required />
        </div>

        <div className="champ-bloc">
          <label>Chiffre du jour ($)</label>
          <input type="number" name="chiffre" value={formData.chiffre} onChange={handleChange} required />
        </div>

        <div className="champ-bloc">
          <label>Nombre de rendez-vous pris</label>
          <input type="number" name="rendezVous" value={formData.rendezVous} onChange={handleChange} required />
        </div>

        <div className="champ-bloc">
          <label>Nom de l'employé</label>
          <input type="text" name="employe" value={formData.employe} onChange={handleChange} required />
        </div>

        <button type="submit">📨 Envoyer le rapport</button>
      </form>

      <div className="rapport-liste">
        <h3>📅 Consulter un rapport précédent</h3>
        <select onChange={handleDateSelect} value={selectedDate}>
          <option value="">-- Sélectionner une date --</option>
          {datesDisponibles.map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>

        {rapportAffiche && (
          <ul>
            <li>
              <p><strong>Magasin :</strong> {rapportAffiche.magasin}</p>
              <p><strong>Employé :</strong> {rapportAffiche.employe}</p>
              <p><strong>Livraisons :</strong> {rapportAffiche.livraisons}</p>
              <p><strong>Chiffre :</strong> {rapportAffiche.chiffre} $</p>
              <p><strong>Rendez-vous :</strong> {rapportAffiche.rendezVous}</p>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
