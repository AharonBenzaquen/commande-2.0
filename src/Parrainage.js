import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import JsBarcode from 'jsbarcode';

export default function Parrainage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const parrain = JSON.parse(localStorage.getItem('parrainActif')) || {};

  const [formulaire, setFormulaire] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: ''
  });

  const [envoye, setEnvoye] = useState(false);
  const [codePromo, setCodePromo] = useState('');

  const genererCodePromo = (nom, prenom, telephone, email) => {
    const base = `${nom.trim().toLowerCase()}-${prenom.trim().toLowerCase()}-${telephone.trim()}-${email.trim().toLowerCase()}`;
    const hash = btoa(base).replace(/[^a-zA-Z0-9]/g, '');
    return `PAR-${hash.slice(0, 8).toUpperCase()}`;
  };

  const handleChange = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { nom, prenom, telephone, email } = formulaire;
    const nouveauCode = genererCodePromo(nom, prenom, telephone, email);
    setCodePromo(nouveauCode);
    setEnvoye(true);

    const anciens = JSON.parse(localStorage.getItem('parrainages')) || [];
    const existeDeja = anciens.some(p => p.code === nouveauCode);

    if (!existeDeja) {
      anciens.push({
        ...formulaire,
        code: nouveauCode,
        utilise: false,
        parrain: parrain.email || parrain.telephone || 'inconnu'
      });
      localStorage.setItem('parrainages', JSON.stringify(anciens));
    }
  };

  useEffect(() => {
    if (envoye && codePromo && canvasRef.current) {
      JsBarcode(canvasRef.current, codePromo, {
        format: 'CODE128',
        lineColor: '#000',
        width: 2,
        height: 50,
        displayValue: false,
        margin: 0
      });
    }
  }, [codePromo, envoye]);

  const imprimerCodePromo = () => {
    const dataUrl = canvasRef.current.toDataURL();
    const fenetre = window.open('', '_blank');
    fenetre.document.write(`
      <html>
        <head><title>Code Promo</title></head>
        <body style="text-align:center;font-family:'Segoe UI';color:#002f5f;">
          <img src="${window.location.origin}/coupon-promo.png" style="max-width:90%;margin-top:20px;" />
          <div style="font-size:28px;font-weight:bold;margin-top:20px;">Code promo : ${codePromo}</div>
          <img src="${dataUrl}" />
        </body>
      </html>
    `);
    fenetre.document.close();
    fenetre.print();
  };

  // 🔢 Compteurs de parrainages envoyés et validés
  const tous = JSON.parse(localStorage.getItem('parrainages')) || [];
  const mesParrainages = tous.filter(p => p.parrain === (parrain.email || parrain.telephone));
  const totalParrainages = mesParrainages.length;
  const totalValides = mesParrainages.filter(p => p.utilise).length;

  return (
    <div className="parrainage-container">
      <h2>Bienvenue {parrain.prenom} {parrain.nom}</h2>

      <div className="compteur-parrainages">
        <p>👥 Parrainages envoyés : <strong>{totalParrainages}</strong></p>
        <p>✅ Validés : <strong>{totalValides}</strong> — soit <strong>{totalValides * 10}$</strong></p>
      </div>

      {envoye ? (
        <>
          <h3>Merci pour votre parrainage 🎉</h3>
          <div className="code-promo-box">
            <p>Voici votre code promo de <strong>10$</strong> :</p>
            <h3>Code : <span className="code-value">{codePromo}</span></h3>
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

          <button onClick={imprimerCodePromo} className="imprimer-button">
            🖨️ Imprimer le code promo
          </button>

          <br /><br />

          <button className="referral-button" onClick={() => navigate('/')}>
            🏠 Retour à l'accueil
          </button>
        </>
      ) : (
        <>
          <h3>Parrainer un ami</h3>
          <form onSubmit={handleSubmit}>
            <label>Nom</label>
            <input
              type="text"
              name="nom"
              value={formulaire.nom}
              onChange={handleChange}
              required
            />

            <label>Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formulaire.prenom}
              onChange={handleChange}
              required
            />

            <label>Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={formulaire.telephone}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formulaire.email}
              onChange={handleChange}
              required
            />

            <button type="submit">Envoyer le parrainage</button>
          </form>
        </>
      )}
    </div>
  );
}

