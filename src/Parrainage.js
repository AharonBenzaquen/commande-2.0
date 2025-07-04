import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Ajout
import './index.css';

export default function Parrainage() {
  const [formulaire, setFormulaire] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
  });

  const [envoye, setEnvoye] = useState(false);
  const codeRef = useRef(null);
  const navigate = useNavigate(); // ✅ Ajout

  const handleChange = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Parrainage soumis :", formulaire);
    setEnvoye(true);
  };

  const imprimerCodePromo = () => {
    const contenu = codeRef.current.innerHTML;
    const fenetre = window.open('', '_blank');
    fenetre.document.write(`
      <html>
        <head><title>Code Promo</title></head>
        <body style="font-family: sans-serif; text-align: center;">
          ${contenu}
        </body>
      </html>
    `);
    fenetre.document.close();
    fenetre.print();
  };

  return (
    <div className="parrainage-container">
      {envoye ? (
        <div>
          <h2>Merci pour votre parrainage 🎉</h2>
          <p>Votre ami(e) a bien été ajouté(e) !</p>
          <p>Voici votre code promo de <strong>10$</strong> :</p>

          <div ref={codeRef} className="code-promo-box">
            <h3>Code : <span className="code-value">Parrain10</span></h3>
            <img src="coupon-final.png" alt="Coupon Opti-W" style={{ maxWidth: '100%', marginTop: '10px' }} />
          </div>

          <button onClick={imprimerCodePromo} className="imprimer-button">🖨️ Imprimer le code promo</button>
          <br /><br />
          <button className="referral-button" onClick={() => navigate('/')}>🏠 Retour à l’accueil</button> {/* ✅ Ajout */}
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
