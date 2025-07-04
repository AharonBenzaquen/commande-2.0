import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import JsBarcode from 'jsbarcode';

export default function Parrainage() {
  const [formulaire, setFormulaire] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
  });

  const [envoye, setEnvoye] = useState(false);
  const [codePromo, setCodePromo] = useState('');
  const codeRef = useRef(null);
  const canvasRef = useRef(null);

  // Génère un code promo unique
  const genererCodePromo = () => {
    const timestamp = Date.now();
    return `PAR-${timestamp.toString().slice(-6)}`; // Exemple : PAR-594321
  };

  // Crée le code-barres dès que le code est généré
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

  const handleChange = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nouveauCode = genererCodePromo();
    setCodePromo(nouveauCode);
    setEnvoye(true);
  };

  const imprimerCodePromo = () => {
    const dataUrl = canvasRef.current.toDataURL();

    const fenetre = window.open('', '_blank');
    fenetre.document.write(`
      <html>
        <head>
          <title>Code Promo</title>
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              text-align: center;
              padding: 40px;
              color: #002f5f;
            }
            img {
              max-width: 90%;
              border-radius: 10px;
              margin-top: 20px;
            }
            .code {
              font-size: 28px;
              font-weight: bold;
              margin-top: 20px;
              color: #002f5f;
            }
          </style>
        </head>
        <body>
          <img src="${window.location.origin}/coupon-promo.png" alt="Coupon Opti-W" />
          <div class="code">Code promo : ${codePromo}</div>
          <img src="${dataUrl}" alt="Code-barres" />
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
          <div className="code-promo-box">
            <p>Voici votre code promo de <strong>10$</strong> :</p>
            <h3>Code : <span className="code-value">{codePromo}</span></h3>
          </div>
          {/* Code-barres invisible (utilisé pour impression) */}
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

          <button onClick={imprimerCodePromo} className="imprimer-button">
            🖨️ Imprimer le code promo
          </button>
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

