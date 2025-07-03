import React, { useState, useRef } from 'react';
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

  const handleChange = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Parrainage soumis :", formulaire);
    setEnvoye(true);
  };

  const imprimerCodePromo = () => {
    const fenetre = window.open('', '_blank');
    fenetre.document.write(`
      <html>
        <head>
          <title>Code Promo Parrainage</title>
          <style>
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            img {
              width: 500px;
              max-width: 90%;
            }
          </style>
        </head>
        <body>
          <img src="coupon_parrainage.png" alt="Coupon Parrain10" />
        </body>
      </html>
    `);
    fenetre.document.close();
    fenetre.focus();
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
            <img src="coupon_parrainage.png" alt="Coupon Parrain10" style={{ marginTop: '15px', maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }} />
          </div>

          <button onClick={imprimerCodePromo} className="imprimer-button">🖨️ Imprimer le code promo</button>
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

