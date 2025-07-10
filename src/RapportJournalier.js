import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];

    const stock = JSON.parse(localStorage.getItem('rapportsJournaliers')) || {};
    stock[today] = formData;
    localStorage.setItem('rapportsJournaliers', JSON.stringify(stock));
    setHistorique(stock);
    setFormData({ livraisons: '', chiffre: '', rendezVous: '', employe: '' });

    // Envoi EmailJS
    const templateParams = {
      name: formData.employe,
      title: `Rapport du ${today}`,
      message: `Livraisons : ${formData.livraisons}\nChiffre : ${formData.chiffre}$\nRendez-vous : ${formData.rendezVous}`
    };

    try {
      await emailjs.send(
        'service_k77x31b',
        'template_xztnjwk',
        templateParams,
        'KpP9SWLy5OcgKnYqn'
      );
      alert('✅ Rapport enregistré et envoyé par email.');
    } catch (error) {
      alert('❌ Rapport sauvegardé mais erreur d’envoi du mail.');
      console.error(error);
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
          <p><strong>Employé :</strong> {rapportAffiche.employe}</p>
          <p><strong>Livraisons :</strong> {rapportAffiche.livraisons}</p>
          <p><strong>Chiffre du jour :</strong> {rapportAffiche.chiffre} $</p>
          <p><strong>Rendez-vous pris :</strong> {rapportAffiche.rendezVous}</p>
        </div>
      )}
    </div>
  );
}
