import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './index.css';

export default function ValiderParrainage() {
  const [searchParams] = useSearchParams();
  const [popupVisible, setPopupVisible] = useState(true);
  const [promoVisible, setPromoVisible] = useState(false);
  const navigate = useNavigate();

  const code = searchParams.get('code');

  useEffect(() => {
    if (code) {
      const parrainages = JSON.parse(localStorage.getItem('parrainages')) || [];
      const index = parrainages.findIndex(p => p.code === code);

      if (index !== -1 && !parrainages[index].valide) {
        parrainages[index].valide = true;
        if (!parrainages[index].date) {
          parrainages[index].date = new Date().toISOString();
        }
        localStorage.setItem('parrainages', JSON.stringify(parrainages));
      }
    }

    const timer1 = setTimeout(() => {
      setPopupVisible(false);
      setPromoVisible(true);
    }, 3000); // ferme le premier popup, ouvre le second

    return () => clearTimeout(timer1);
  }, [code]);

  const parrainer = () => {
    if (code) {
      localStorage.setItem('codeParrain', code);
    }
    navigate('/connexion-parrainage');
  };

  return (
    <div className="valider-parrainage-container">
      {popupVisible && (
        <div className="validation-popup">
          🎉 Votre parrainage a bien été validé ! Merci de votre confiance.
        </div>
      )}

      {promoVisible && (
        <div className="promo-popup">
          <h3>Tu veux des Solaires gratuites ?</h3>
          <h3>Tu veux des Simple Vision gratuites ?</h3>
          <h3>Tu veux des Progressifs gratuites ?</h3>
          <p><strong>✨ Opti-W rend cela possible ! ✨</strong></p>
          <button className="fermer-btn" onClick={() => setPromoVisible(false)}>Fermer</button>
        </div>
      )}

      <h2 className="valider-titre-offres">Nos offres</h2>

      <div className="promotions-wrapper">
        <div className="promo-item">
          <img src="/promo 200.png" alt="Promo simple vision" />
        </div>
        <div className="promo-item">
          <video src="/video1.mp4" controls />
        </div>
        <div className="promo-item">
          <img src="/promo 300.png" alt="Promo progressive" />
        </div>
        <div className="promo-item">
          <video src="/video2.mp4" controls />
        </div>
      </div>

      <button className="parrainer-btn" onClick={parrainer}>
        🤝 Parrainer à mon tour
      </button>
    </div>
  );
}
