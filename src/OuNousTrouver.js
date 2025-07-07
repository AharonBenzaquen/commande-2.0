import React from 'react';
import './index.css';

export default function OuNousTrouver() {
  return (
    <div className="app">
      <h2 className="header">📍 Nos Magasins</h2>

      <div className="magasin-bloc">
        <h3>Opti-W Laval</h3>
        <p>Adresse : 2075 Bd Chomedey, Laval, Quebec H7T 0G5</p>
        <p>Téléphone : (450)687-8787</p>
        <button className="maps-link-button" onClick={() => window.open('https://www.google.com/maps?q=opti-w+laval', '_blank')}>
          Voir sur Google Maps
        </button>
      </div>

      <div className="magasin-bloc">
        <h3>Opti-W Rosemère</h3>
        <p>Adresse :401 Boul. Labelle, Rosemère, QC J7A 3T2</p>
        <p>Téléphone : (450)951-2115</p>
        <button className="maps-link-button" onClick={() => window.open('https://www.google.com/maps?q=opti-w+rosemère', '_blank')}>
          Voir sur Google Maps
        </button>
      </div>

      <div className="magasin-bloc">
        <h3>Opti-W Blainville</h3>
        <p>Adresse : 1333 Bd Michèle-Bohec, Blainville, QC J7C 5M7</p>
        <p>Téléphone : (514)416 1909</p>
        <button className="maps-link-button" onClick={() => window.open('https://www.google.com/maps?q=opti-w+blainville', '_blank')}>
          Voir sur Google Maps
        </button>
      </div>
    </div>
  );
}
