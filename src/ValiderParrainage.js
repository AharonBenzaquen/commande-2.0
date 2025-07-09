import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';

export default function ValiderParrainage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [codeValide, setCodeValide] = useState(null);
  const [confirmation, setConfirmation] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get('code');
    if (code) {
      setCodeValide(code);
      alert(`✅ Vous avez validé le parrainage avec le code : ${code}`);
      localStorage.setItem('promoParrain', code);
      setConfirmation(true);
    }
  }, [location.search]);

  return (
    <div className="valider-parrainage-container">
      {confirmation && (
        <>
          <h2>🎉 Parrainage confirmé !</h2>
          <p>Merci d'avoir validé votre code de parrainage.</p>

          <div className="promo-section">
            <div className="promo-item">
              <img src="promo1-img.jpg" alt="Promo 1" className="promo-image" />
              <video controls className="promo-video">
                <source src="promo1-video.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            </div>
            <div className="promo-item">
              <img src="promo2-img.jpg" alt="Promo 2" className="promo-image" />
              <video controls className="promo-video">
                <source src="promo2-video.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            </div>
          </div>

          <button
            className="referral-button"
            onClick={() => navigate('/connexion-parrain')}
            style={{ marginTop: '30px' }}
          >
            👥 Parrainer à mon tour
          </button>
        </>
      )}
    </div>
  );
}
