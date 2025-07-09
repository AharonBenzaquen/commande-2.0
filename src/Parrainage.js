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
  const [showDetails, setShowDetails] = useState(false);
  const [mesParrainages, setMesParrainages] = useState([]);
  const [dateGeneration, setDateGeneration] = useState(null);

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

    const maintenant = new Date().toISOString();
    setDateGeneration(maintenant);

    const anciens = JSON.parse(localStorage.getItem('parrainages')) || [];
    const existeDeja = anciens.some(p => p.code === nouveauCode);

    if (!existeDeja) {
      const nouveauParrainage = {
        ...formulaire,
        code: nouveauCode,
        utilise: false,
        desactive: false,
        dateCreation: maintenant,
        parrain: parrain.email || parrain.telephone || 'inconnu'
      };
      const misAJour = [...anciens, nouveauParrainage];
      localStorage.setItem('parrainages', JSON.stringify(misAJour));

      const reference = parrain.email || parrain.telephone || 'inconnu';
      setMesParrainages(misAJour.filter(p => p.parrain === reference));
    }
  };

  useEffect(() => {
    const tous = JSON.parse(localStorage.getItem('parrainages')) || [];
    const reference = parrain.email || parrain.telephone || 'inconnu';
    const mes = tous.filter(p => p.parrain === reference);
    setMesParrainages(mes);
  }, [envoye, parrain]);

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

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString();
  };

  const imprimerCode = (code) => {
    const parrainages = JSON.parse(localStorage.getItem('parrainages')) || [];
    const fiche = parrainages.find(p => p.code === code);
    const date = fiche?.dateCreation || new Date().toISOString();
    const expire = new Date(date);
    expire.setDate(expire.getDate() + 30);

    const tempCanvas = document.createElement('canvas');
    JsBarcode(tempCanvas, code, {
      format: 'CODE128',
      lineColor: '#000',
      width: 2,
      height: 50,
      displayValue: false
    });

    const dataUrl = tempCanvas.toDataURL();
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head><title>Code Promo</title></head>
        <body style="text-align:center;font-family:'Segoe UI';color:#002f5f;">
          <img id="headerImage" src="${window.location.origin}/coupon-promo.png" style="max-width:90%;margin-top:20px;" />
          <div style="font-size:24px;font-weight:bold;margin-top:20px;">Code promo : ${code}</div>
          <div style="margin-top:10px;">Généré le : ${formatDate(date)}</div>
          <div style="margin-bottom:20px;">Valable jusqu’au : ${formatDate(expire)}</div>
          <img id="barcode" src="${dataUrl}" />
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const isExpired = (date) => {
    const now = new Date();
    const createdAt = new Date(date);
    const diff = (now - createdAt) / (1000 * 60 * 60 * 24);
    return diff > 30;
  };

  const totalParrainages = mesParrainages.length;
  const totalValides = mesParrainages.filter(p => p.utilise && !p.desactive && !isExpired(p.dateCreation)).length;

  const getStatut = (p) => {
    if (p.desactive) return '🛑 Désactivé';
    if (isExpired(p.dateCreation)) return '⏳ Expiré';
    if (p.utilise) return '✅ Validé';
    return '❌ En attente';
  };

  return (
    <div className="parrainage-container">
      <h2>Bienvenue {parrain.prenom} {parrain.nom}</h2>

      <div className="compteur-parrainages">
        <p>👥 Parrainages envoyés : <strong>{totalParrainages}</strong></p>
        <p>✅ Valides : <strong>{totalValides}</strong> — soit <strong>{totalValides * 10}$</strong></p>
      </div>

      <button onClick={() => setShowDetails(!showDetails)} style={{ marginBottom: '15px' }}>
        {showDetails ? 'Masquer mes parrainages' : 'Voir mes parrainages'}
      </button>

      {showDetails && (
        <div className="table-parrainages">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Code</th>
                <th>Statut</th>
                <th>Imprimer</th>
              </tr>
            </thead>
            <tbody>
              {mesParrainages.map((p, i) => (
                <tr key={i}>
                  <td>{p.nom}</td>
                  <td>{p.prenom}</td>
                  <td>{p.email}</td>
                  <td>{p.telephone}</td>
                  <td>{p.code}</td>
                  <td>{getStatut(p)}</td>
                  <td>
                    <button onClick={() => imprimerCode(p.code)}>🖨️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {envoye ? (
        <>
          <h3>Merci pour votre parrainage 🎉</h3>
          <div className="code-promo-box">
            <p>Voici votre code promo de <strong>10$</strong> :</p>
            <h3>Code : <span className="code-value">{codePromo}</span></h3>
            <p>Généré le : {formatDate(dateGeneration)}</p>
            <p>Valable jusqu’au : {formatDate(new Date(new Date(dateGeneration).getTime() + 30 * 24 * 60 * 60 * 1000))}</p>
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

          <button onClick={() => imprimerCode(codePromo)} className="imprimer-button">
            🖨️ Imprimer le code promo
          </button>

          <br /><br />
          <button className="referral-button" onClick={() => navigate('/')}>🏠 Retour à l'accueil</button>
        </>
      ) : (
        <>
          <h3>Parrainer un ami</h3>
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
