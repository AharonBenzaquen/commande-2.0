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

    const stock = JSON.parse(localStorage.getItem('rapportsJournaliers')) || {};
    stock[today] = formData;
    localStorage.setItem('rapportsJournaliers', JSON.stringify(stock));
    setHistorique(stock);
    setFormData({ magasin: '', livraisons: '', chiffre: '', rendezVous: '', employe: '' });

    const rapportData = {
      date: today,
      ...formData
    };

    try {
      const response = await fetch('https://optiw-backend.onrender.com/send-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
    <div className="rapport-container">
      <h2>📋 Rapport Journalier</h2>
      <form className="rapport-form" onSubmit={handleSubmit}>
        <label>Nom du magasin</label>
        <input type="text" name="magasin" value={formData.magasin} onChange={handleChange} required />

        <label>Nombre de livraisons</label>
        <input type="number" name="livraisons" value={formData.livraisons} onChange={handleChange} required />

        <label>Chiffre du jour ($)</label>
        <input type="number" name="chiffre" value={formData.chiffre} onChange={handleChange} required />

        <label>Nombre de rendez-vous pris</label>
        <input type="number" name="rendezVous" value={formData.rendezVous} onChange={handleChange} required />

        <label>Nom de l'employé</label>
        <input type="text" name="employe" value={formData.employe} onChange={handleChange} required />

        <button type="submit">📨 Envoyer le rapport</button>
      </form>

      <hr />

      <h3>📅 Consulter un rapport précédent</h3>
      <select onChange={handleDateSelect} value={selectedDate}>
        <option value="">-- Sélectionner une date --</option>
        {datesDisponibles.map(date => (
          <option key={date} value={date}>{date}</option>
        ))}
      </select>

      {rapportAffiche && (
        <div className="rapport-resultat">
          <p><strong>Magasin :</strong> {rapportAffiche.magasin}</p>
          <p><strong>Employé :</strong> {rapportAffiche.employe}</p>
          <p><strong>Livraisons :</strong> {rapportAffiche.livraisons}</p>
          <p><strong>Chiffre du jour :</strong> {rapportAffiche.chiffre} $</p>
          <p><strong>Rendez-vous pris :</strong> {rapportAffiche.rendezVous}</p>
        </div>
      )}
    </div>
  );
}
