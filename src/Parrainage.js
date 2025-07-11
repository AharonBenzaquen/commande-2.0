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
  const [dateGeneration, setDateGeneration] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [mesParrainages, setMesParrainages] = useState([]);
  const [popupPalier, setPopupPalier] = useState(null);

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
    const nouveauCode = genererCodePromo(nom, prenom, telephone, email);
    setCodePromo(nouveauCode);
    setEnvoye(true);

    const dateNow = new Date().toISOString();
    setDateGeneration(dateNow);

    const anciens = JSON.parse(localStorage.getItem('parrainages')) || [];
    const existeDeja = anciens.some(p => p.code === nouveauCode);

    if (!existeDeja) {
      const nouveauParrainage = {
        ...formulaire,
        code: nouveauCode,
        utilise: false,
        valide: false,
        desactive: false,
        dateCreation: dateNow,
        parrain: parrain.email || parrain.telephone || 'inconnu'
      };
      const misAJour = [...anciens, nouveauParrainage];
      localStorage.setItem('parrainages', JSON.stringify(misAJour));

      const reference = parrain.email || parrain.telephone || 'inconnu';
      setMesParrainages(misAJour.filter(p => p.parrain === reference));

      try {
        const response = await fetch('https://optiw-backend.onrender.com/send-parrainage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            prenom,
            codePromo: nouveauCode,
            parrainNom: `${parrain.prenom || ''} ${parrain.nom || ''}`.trim(),
            validationLink: `${window.location.origin}/valider-parrainage?code=${nouveauCode}`
          })
        });

        const data = await response.json();

        if (response.ok) {
          console.log('✅ Email envoyé avec succès :', data);
        } else {
          console.error('❌ Erreur serveur :', data);
        }
      } catch (error) {
        console.error("❌ Erreur réseau ou fetch :", error);
      }
    } else {
      console.log("⚠️ Ce code promo existe déjà, aucun nouvel email envoyé.");
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

  const totalParrainages = mesParrainages.length;
  const totalCliques = mesParrainages.filter(p => p.valide && !p.desactive && !isExpired(p.dateCreation)).length;
  const totalRecompenses = totalCliques;

  useEffect(() => {
    const messages = {
      5: "Le savais-tu ? Tu peux jumeler tes assurances à tes parrainages pour avoir aucun reste à charge !",
      10: "Vous y êtes presque : plus que 10 parrainages pour 2 paires de lunettes simple vision 💪🏻",
      15: "Plus que 5 parrainages pour les simple vision. Besoin de progressif ? Plus que 15 parrainages 💪🏻",
      20: "Bravo vous avez mérité vos 2 lunettes simple vision gratuite ! ✅ Besoin de progressif ? Vous y êtes presque plus que 10 parrainages 💪🏻",
      25: "La ligne d’arrivée de vos progressifs vous attend : plus que 5 parrainages ! 💪🏻",
      30: "Bravo vous avez mérité vos 2 lunettes progressives gratuites ! ✅"
    };
    if (messages[totalCliques]) {
      setPopupPalier(messages[totalCliques]);
    }
  }, [totalCliques]);

  const getStatut = (p) => {
    if (p.desactive) return '🛑 Désactivé';
    if (isExpired(p.dateCreation)) return '⏳ Expiré';
    if (p.utilise) return '✅ Utilisé';
    if (p.valide) return '📬 Validé';
    return '❌ En attente';
  };

  return (
    <div className="parrainage-container">
      <h2>Bienvenue {parrain.prenom} {parrain.nom}</h2>

      {popupPalier && (
        <div className="niveau-popup">
          <p>{popupPalier}</p>
          <button onClick={() => setPopupPalier(null)}>Fermer</button>
        </div>
      )}

      <div className="compteur-parrainages">
        <p>👥 Parrainages envoyés : <strong>{totalParrainages}</strong></p>
        <p>📬 Filleuls ayant cliqué : <strong>{totalCliques}</strong></p>
        <p>💰 Récompenses débloquées : <strong>{totalRecompenses}</strong> — soit <strong>{totalRecompenses * 10}$</strong></p>
      </div>

      <div className="progression-table">
        <div className="progress-bar">
          <label>🌞 Solaires (10)</label>
          <progress max="10" value={totalCliques > 10 ? 10 : totalCliques}></progress>
          {totalCliques >= 10 && <span>✅</span>}
        </div>
        <div className="progress-bar">
          <label>👓 Simple Vision (20)</label>
          <progress max="20" value={totalCliques > 20 ? 20 : totalCliques}></progress>
          {totalCliques >= 20 && <span>✅</span>}
        </div>
        <div className="progress-bar">
          <label>👀 Progressif (30)</label>
          <progress max="30" value={totalCliques > 30 ? 30 : totalCliques}></progress>
          {totalCliques >= 30 && <span>✅</span>}
        </div>
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
