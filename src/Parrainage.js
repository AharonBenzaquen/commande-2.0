import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import JsBarcode from 'jsbarcode';

export default function Parrainage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const parrain = JSON.parse(localStorage.getItem('parrainActif')) || {};

  const [formulaire, setFormulaire] = useState({ nom: '', prenom: '', telephone: '', email: '' });
  const [envoye, setEnvoye] = useState(false);
  const [codePromo, setCodePromo] = useState('');
  const [dateGeneration, setDateGeneration] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [mesParrainages, setMesParrainages] = useState([]);
  const [popupNiveau, setPopupNiveau] = useState(null);
  const [niveauAffiches, setNiveauAffiches] = useState(() => JSON.parse(localStorage.getItem('niveauParrainageAffiches')) || []);

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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            prenom,
            codePromo: nouveauCode,
            parrainNom: `${parrain.prenom || ''} ${parrain.nom || ''}`.trim(),
            validationLink: `${window.location.origin}/valider-parrainage?code=${nouveauCode}`
          })
        });

        const data = await response.json();
        if (response.ok) console.log('✅ Email envoyé avec succès :', data);
        else console.error('❌ Erreur serveur :', data);
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
        format: 'CODE128', lineColor: '#000', width: 2, height: 50, displayValue: false, margin: 0
      });
    }
  }, [codePromo, envoye]);

  useEffect(() => {
    const totalValid = mesParrainages.filter(p => p.valide && !p.desactive && !isExpired(p.dateCreation)).length;
    const niveaux = [
      { seuil: 5, message: "💡 Le savais-tu ? Tu peux jumeler tes assurances à tes parrainages pour avoir aucun reste à charge !" },
      { seuil: 10, message: "🔔 Vous y êtes presque ! Plus que 10 parrainages pour 2 paires de lunettes simple vision 💪🏻" },
      { seuil: 15, message: "💪 Plus que 5 parrainages pour les simple vision. Besoin de progressifs ? Plus que 15 !" },
      { seuil: 20, message: "✅ Bravo ! 2 lunettes simple vision méritées ! Besoin de progressifs ? Plus que 10 💪🏻" },
      { seuil: 25, message: "🚀 La ligne d’arrivée pour vos progressifs vous attend… plus que 5 ! 💪🏻" },
      { seuil: 30, message: "🎉 Bravo ! Vous avez mérité vos 2 lunettes progressives gratuites ! ✅" }
    ];

    const nouveauNiveau = niveaux.find(n => totalValid >= n.seuil && !niveauAffiches.includes(n.seuil));

    if (nouveauNiveau) {
      setPopupNiveau(nouveauNiveau);
      const nouveauNiveaux = [...niveauAffiches, nouveauNiveau.seuil];
      setNiveauAffiches(nouveauNiveaux);
      localStorage.setItem('niveauParrainageAffiches', JSON.stringify(nouveauNiveaux));
    }
  }, [mesParrainages]);

  const imprimerCode = (code) => {
    const tempCanvas = document.createElement('canvas');
    JsBarcode(tempCanvas, code, { format: 'CODE128', lineColor: '#000', width: 2, height: 50, displayValue: false });
    const dataUrl = tempCanvas.toDataURL();
    const now = new Date();
    const expire = new Date(now); expire.setDate(expire.getDate() + 30);
    const formatDate = (date) => date.toLocaleDateString('fr-CA');

    const win = window.open('', '_blank');
    win.document.write(`...`); // Raccourci pour clarté
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

  const getStatut = (p) => {
    if (p.desactive) return '🛑 Désactivé';
    if (isExpired(p.dateCreation)) return '⏳ Expiré';
    if (p.utilise) return '✅ Utilisé';
    if (p.valide) return '📬 Validé';
    return '❌ En attente';
  };

  const progressStep = (goal) => Math.min((totalCliques / goal) * 100, 100);
  const achieved = (goal) => totalCliques >= goal;

  return (
    <div className="parrainage-container">
      <h2>Bienvenue {parrain.prenom} {parrain.nom}</h2>

      {popupNiveau && (
        <div className="niveau-popup">
          <p>{popupNiveau.message}</p>
          <button className="fermer-btn" onClick={() => setPopupNiveau(null)}>Fermer</button>
        </div>
      )}

      <div className="compteur-parrainages">
        <p>👥 Parrainages envoyés : <strong>{totalParrainages}</strong></p>
        <p>📬 Filleuls ayant cliqué : <strong>{totalCliques}</strong></p>
        <p>💰 Récompenses débloquées : <strong>{totalRecompenses}</strong> — soit <strong>{totalRecompenses * 10}$</strong></p>
      </div>

      <div className="progression-recompenses">
        <div className="reward-item">
          <p>Lunettes solaires sans prescription (100$)</p>
          <div className="progress-bar"><div style={{ width: `${progressStep(10)}%` }} className="fill"></div></div>
          {achieved(10) && <span>😎</span>}
        </div>
        <div className="reward-item">
          <p>Simple vision (200$)</p>
          <div className="progress-bar"><div style={{ width: `${progressStep(20)}%` }} className="fill"></div></div>
          {achieved(20) && <span>😃</span>}
        </div>
        <div className="reward-item">
          <p>Progressives (300$)</p>
          <div className="progress-bar"><div style={{ width: `${progressStep(30)}%` }} className="fill"></div></div>
          {achieved(30) && <span>🎉</span>}
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
                  <td><button onClick={() => imprimerCode(p.code)}>🖨️</button></td>
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
          <button onClick={() => imprimerCode(codePromo)} className="imprimer-button">🖨️ Imprimer le code promo</button>
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
