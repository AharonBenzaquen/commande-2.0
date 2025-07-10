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
  const [mesParrainages, setMesParrainages] = useState([]);

  const genererCodePromo = (nom, prenom, telephone, email) => {
    const base = `${nom.trim().toLowerCase()}-${prenom.trim().toLowerCase()}-${telephone.trim()}-${email.trim().toLowerCase()}`;
    const hash = btoa(base).replace(/[^a-zA-Z0-9]/g, '');
    return `PAR-${hash.slice(0, 8).toUpperCase()}`;
  };

  const handleChange = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nom, prenom, telephone, email } = formulaire;
    const code = genererCodePromo(nom, prenom, telephone, email);
    setCodePromo(code);
    setEnvoye(true);

    const dateNow = new Date().toISOString();
    const nouveauParrainage = {
      ...formulaire,
      code,
      valide: false,
      utilise: false,
      desactive: false,
      dateCreation: dateNow,
      parrain: parrain.email || parrain.telephone || 'inconnu'
    };

    const anciens = JSON.parse(localStorage.getItem('parrainages')) || [];
    const deja = anciens.some(p => p.code === code);

    if (!deja) {
      const misAJour = [...anciens, nouveauParrainage];
      localStorage.setItem('parrainages', JSON.stringify(misAJour));
      const reference = parrain.email || parrain.telephone || 'inconnu';
      setMesParrainages(misAJour.filter(p => p.parrain === reference));

      // Envoi email au filleul
      try {
        await fetch('https://optiw-backend.onrender.com/send-parrainage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prenom,
            parrainNom: parrain.nom || 'Votre ami',
            codePromo: code,
            email,
            lienValidation: `${window.location.origin}/valider-parrainage?code=${code}`
          })
        });
      } catch (err) {
        console.error("Erreur d'envoi d'email :", err);
      }
    }
  };

  useEffect(() => {
    const tous = JSON.parse(localStorage.getItem('parrainages')) || [];
    const reference = parrain.email || parrain.telephone || 'inconnu';
    const mes = tous.filter(p => p.parrain === reference);
    setMesParrainages(mes);
  }, [envoye]);

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

  const imprimerCode = (code) => {
    const tempCanvas = document.createElement('canvas');
    JsBarcode(tempCanvas, code, {
      format: 'CODE128',
      lineColor: '#000',
      width: 2,
      height: 50,
      displayValue: false
    });

    const dataUrl = tempCanvas.toDataURL();
    const now = new Date();
    const expire = new Date(now);
    expire.setDate(expire.getDate() + 30);

    const formatDate = (date) => date.toLocaleDateString('fr-CA');

    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Code Promo</title>
          <style>
            body {
              text-align: center;
              font-family: 'Segoe UI', sans-serif;
              color: #002f5f;
            }
            .code {
              font-size: 24px;
              font-weight: bold;
              margin-top: 20px;
            }
            .dates {
              margin-top: 10px;
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <img id="headerImage" src="${window.location.origin}/coupon-promo.png" style="max-width:90%;margin-top:20px;" />
          <div class="code">Code promo : ${code}</div>
          <img id="barcode" src="${dataUrl}" />
          <div class="dates">
            <p>Généré le : ${formatDate(now)}</p>
            <p>Valable jusqu’au : ${formatDate(expire)}</p>
          </div>
          <script>
            const header = document.getElementById('headerImage');
            const barcode = document.getElementById('barcode');
            let imagesLoaded = 0;
            function tryPrint() {
              imagesLoaded++;
              if (imagesLoaded === 2) window.print();
            }
            header.onload = tryPrint;
            barcode.onload = tryPrint;
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

  const getStatut = (p) => {
    if (p.desactive) return '🛑 Désactivé';
    if (isExpired(p.dateCreation)) return '⏳ Expiré';
    if (p.utilise) return '✅ Utilisé';
    if (p.valide) return '📬 Validé';
    return '❌ En attente';
  };

  return (
    <div className="parrainage-container">
      <h2>Parrainer un ami</h2>

      {!envoye ? (
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
      ) : (
        <>
          <h3>Merci pour votre parrainage 🎉</h3>
          <p>Code promo généré : <strong>{codePromo}</strong></p>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          <button onClick={() => imprimerCode(codePromo)}>🖨️ Imprimer</button>
          <br /><br />
          <button onClick={() => navigate('/')}>🏠 Retour à l’accueil</button>
        </>
      )}

      <hr />
      <h3>Mes Parrainages</h3>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Code</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {mesParrainages.map((p, i) => (
            <tr key={i}>
              <td>{p.nom}</td>
              <td>{p.prenom}</td>
              <td>{p.email}</td>
              <td>{p.code}</td>
              <td>{getStatut(p)}</td>
              <td><button onClick={() => imprimerCode(p.code)}>🖨️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
