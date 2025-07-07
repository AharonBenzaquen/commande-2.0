import React from 'react';
import './index.css';

export default function OuNousTrouver() {
  return (
    <div className="app">
      <h2 className="header">📍 Nos Magasins</h2>

      <div className="magasin-bloc">
        <h3>Opti-W Laval</h3>
        <p>Adresse : 123 Rue Laval, QC</p>
        <p>Téléphone : (514) 123-4567</p>
        <button className="maps-link-button" onClick={() => window.open('https://www.google.com/maps?q=opti-w+laval', '_blank')}>
          Voir sur Google Maps
        </button>
      </div>

      <div className="magasin-bloc">
        <h3>Opti-W Rosemère</h3>
        <p>Adresse : 456 Rue Rosemère, QC</p>
        <p>Téléphone : (514) 987-6543</p>
        <button className="maps-link-button" onClick={() => window.open('https://www.google.com/maps?q=opti-w+rosemère', '_blank')}>
          Voir sur Google Maps
        </button>
      </div>

      <div className="magasin-bloc">
        <h3>Opti-W Blainville</h3>
        <p>Adresse : 789 Rue Blainville, QC</p>
        <p>Téléphone : (514) 555-7890</p>
        <button className="maps-link-button" onClick={() => window.open('https://www.google.com/maps?q=opti-w+blainville', '_blank')}>
          Voir sur Google Maps
        </button>
      </div>
    </div>
  );
}
