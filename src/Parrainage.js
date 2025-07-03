import React, { useState } from 'react';
import './index.css';

export default function Parrainage() {
  const [formulaire, setFormulaire] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
  });

  const [envoye, setEnvoye] = useState(false);

  const handleChange = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simule un envoi (à remplacer par back-end si nécessaire)
    console.log("Parrainage soumis :", formulaire);
    setEnvoye(true);
  };

  return (
    <div className="parrainage-container">
      {envoye ? (
        <div>
          <h2>Merci pour votre parrainage 🎉</h2>
          <p>Votre ami(e) a bien été ajouté(e) !</p>
          <p>Utilisez le code promo suivant pour bénéficier de <strong>10$ de réduction</strong> :</p>
          <div style={{
            backgroundColor: '#f4c51c',
            color: '#002f5f',
            fontWeight: 'bold',
            padding: '12px',
            textAlign: 'center',
            fontSize: '18px',
            borderRadius: '6px',
            marginTop: '15px'
          }}>
            Parrain10
          </div>
        </div>
      ) : (
        <>
          <h2>Parrainer un ami</h2>
          <form onSubmit={handleSubmit}>
            <label>Nom</label>
            <input type="text" name="nom" value={formulaire.nom} onChange={handleChange} required />

            <label>Prénom</label>
            <input type="text" name="prenom" value={formulaire.prenom} onChange={handleChange} required />

            <label>Téléphone</label>
            <input type="tel" name="telephone" value={formulaire.telephone} onChange={handleChange} required />

            <label>Email</label>
            <input type="email" name="email" value={formulaire.email} onChange={handleChange} required />

            <button type="submit">Envoyer le parrainage</button>
          </form>
        </>
      )}
    </div>
  );
}
