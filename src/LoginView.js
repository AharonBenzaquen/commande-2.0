import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

export default function LoginView({ login, setLogin, mdp, setMdp, seConnecter }) {
  const navigate = useNavigate();
  const [tracking, setTracking] = useState('');
  const [commandeTrouvee, setCommandeTrouvee] = useState(null);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const rechercherTracking = () => {
    const toutes = JSON.parse(localStorage.getItem('commandes')) || [];
    const trouvée = toutes.find(c => c.numero === tracking);
    setCommandeTrouvee(trouvée || null);
  };

  return (
    <div className="app">
      {/* Connexion */}
      <div className="login-container">
        <input
          className="input-field"
          placeholder="Email"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          className="input-field"
          type="password"
          placeholder="Mot de passe"
          value={mdp}
          onChange={(e) => setMdp(e.target.value)}
        />
        <button className="login-button" onClick={() => seConnecter(navigate)}>
          Connexion
        </button>
      </div>

      {/* Suivi de commande */}
      <div className="tracking-box">
        <h3>Suivi de commande</h3>
        <input
          placeholder="Numéro de commande"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
        />
        <button onClick={rechercherTracking}>🔍 Rechercher</button>
        {commandeTrouvee ? (
          <div className="result">
            <p><strong>Commande :</strong> {commandeTrouvee.numero}</p>
            <p><strong>Statut :</strong> {commandeTrouvee.statut}</p>
            <p><strong>Commentaire :</strong> {commandeTrouvee.commentaire}</p>
          </div>
        ) : tracking && <p>Aucune commande trouvée.</p>}
      </div>

      {/* Promotions + parrainage */}
      <div className="promotions">
        <div className="promo-images">
          <img src="promo1.jpg" alt="Promotion 1" onClick={() => setShowModal1(true)} />
          <img src="promo2.jpg" alt="Promotion 2" onClick={() => setShowModal2(true)} />
        </div>
        <button className="referral-button" onClick={() => navigate('/parrainage')}>
          👥 Parrainer un ami
        </button>
      </div>

      {/* Bouton Où nous trouver */}
      <div className="ou-nous-trouver-button">
        <button onClick={() => navigate('/ou-nous-trouver')}>📍 Où nous trouver</button>
      </div>

      {/* Modal Promo 1 */}
    {showModal1 && (
  <div className="modal-overlay" onClick={() => setShowModal1(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
    <h3>🎁 Promo 1 - 2 paires Simple Vision pour 200$</h3>
    <div className="promo-modal-content">
     <img src="promo1-image.jpg" alt="Promo 1" className="modal-image" />
        <video controls className="modal-video">
          <source src="promo1-video.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo.
        </video>
      </div>
      <button className="close-button" onClick={() => setShowModal1(false)}>Fermer</button>
      </div>
    </div>
)}

      {/* Modal Promo 2 */}
       {showModal2 && (
  <div className="modal-overlay" onClick={() => setShowModal2(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <h3>🎁 Promo 2 - 2 paires Progressives pour 300$</h3>
      <div className="promo-modal-content">
        <img src="promo2-image.jpg" alt="Illustration Promo 2" className="promo-modal-img" />
        <video controls className="promo-modal-video">
          <source src="promo2-video.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo.
        </video>
      </div>
      <button className="close-button" onClick={() => setShowModal2(false)}>Fermer</button>
    </div>
  </div>
)}

    </div>
  );
}

