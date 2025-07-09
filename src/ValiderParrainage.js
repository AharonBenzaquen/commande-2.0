import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './index.css';

export default function ValiderParrainage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(true);
  const [codeValide, setCodeValide] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      const parrainages = JSON.parse(localStorage.getItem('parrainages')) || [];
      const index = parrainages.findIndex(p => p.code === code);

      if (index !== -1 && !parrainages[index].utilise) {
        parrainages[index].utilise = true;
        localStorage.setItem('parrainages', JSON.stringify(parrainages));
        setCodeValide(true);
      }
    }

    setTimeout(() => setPopupVisible(false), 3000);
  }, [location.search]);

  return (
    <div className="valider-parrainage-container">
      {popupVisible && (
        <div className="popup-confirmation">
          ✅ Vous avez validé votre parrainage !
        </div>
      )}

      <h2 className="promo-title">Nos Promotions Actuelles</h2>

      <div className="promo-grid">
        <div className="promo-col">
          <img src="/promo SV.png" alt="Promotion 1" className="promo-image" />
          <video src="/promo1.mp4" className="promo-video" controls />
        </div>

        <div className="promo-col">
          <img src="/promo prog.png" alt="Promotion 2" className="promo-image" />
          <video src="/promo2.mp4" className="promo-video" controls />
        </div>
      </div>

      <button className="parrainer-retour-button" onClick={() => navigate('/connexion-parrainage')}>
        👥 Parrainer à mon tour
      </button>
    </div>
  );
}
