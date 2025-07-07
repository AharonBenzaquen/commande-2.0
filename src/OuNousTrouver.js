// OuNousTrouver.js
import React from 'react';

const magasins = [
  {
    nom: 'Opti-W Laval',
    adresse: '540 boul. le Corbusier, Laval, QC H7N 6M3',
    tel: '514-123-4567',
    map: 'https://www.google.com/maps?q=opti-w+laval'
  },
  {
    nom: 'Opti-W Rosemère',
    adresse: '401 boul. Labelle, Rosemère, QC J7A 3T2',
    tel: '450-234-5678',
    map: 'https://www.google.com/maps?q=opti-w+rosemère'
  },
  {
    nom: 'Opti-W Blainville',
    adresse: '1055 boul. Curé-Labelle, Blainville, QC J7C 2M2',
    tel: '450-345-6789',
    map: 'https://www.google.com/maps?q=opti-w+blainville'
  }
];

export default function OuNousTrouver() {
  return (
    <div className="app">
      <h2 className="header">📍 Nos magasins</h2>
      {magasins.map((m, index) => (
        <div key={index} style={{ marginBottom: '30px' }}>
          <h3>{m.nom}</h3>
          <p>📍 {m.adresse}</p>
          <p>📞 {m.tel}</p>
          <iframe
            title={m.nom}
            src={m.map}
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: '10px', marginTop: '10px' }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
