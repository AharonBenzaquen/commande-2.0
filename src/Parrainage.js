import React, { useState } from 'react';
import './index.css';

export default function Parrainage() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [soumis, setSoumis] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSoumis(true);
  };

  return (
    <div className="parrainage-form">
      <h2>Parrainage</h2>
      {soumis ? (
        <p>Merci pour votre parrainage !</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
          <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
          <input type="tel" placeholder="Numéro de téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
          <input type="email" placeholder="Adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit">Soumettre</button>
        </form>
      )}
    </div>
  );
}