import React, { useState, useEffect } from 'react';
import './index.css';

export default function RapportJournalier() {
  const [formData, setFormData] = useState({
    livraisons: '',
    chiffre: '',
    rendezVous: '',
    employe: ''
  });

  const [historique, setHistorique] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [rapportAffiche, setRapportAffiche] = useState(null);

  useEffect(() => {
    const stock = JSON.parse(localStorage.getItem('rapportsJournaliers')) || {};
    setHistorique(stock);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const stock = JSON.parse(localStorage.getItem('rapportsJournaliers')) || {};
    stock[today] = formData;
    localStorage.setItem('rapportsJournaliers', JSON.stringify(stock));
    alert("✅ Rapport enregistré pour le " + today);
    setHistorique(stock);
    setFormData({ livraisons: '', chiffre: '', rendezVous: '', employe: '' });
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
              <p><strong>🧑 Employé :</strong> {rapportAffiche.employe}</p>
              <p><strong>📦 Livraisons :</strong> {rapportAffiche.livraisons}</p>
              <p><strong>💰 Chiffre :</strong> {rapportAffiche.chiffre} $</p>
              <p><strong>📅 Rendez-vous :</strong> {rapportAffiche.rendezVous}</p>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
