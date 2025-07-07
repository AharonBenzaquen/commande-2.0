// Magasins.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Magasins() {
  const navigate = useNavigate();

  const magasins = [
    {
      nom: 'Opti-W Laval',
      adresse: '3035 Boulevard Le Carrefour, Laval, QC H7T 1C8',
      telephone: '(450) 555-1234',
      map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.7613178059383!2d-73.75073232355929!3d45.57323802841164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc936f7314cbfed%3A0x8c0b3a0578f4ad7!2s3035%20Boulevard%20Le%20Carrefour%2C%20Laval%2C%20QC%20H7T%201C8!5e0!3m2!1sfr!2sca!4v1719960000000!5m2!1sfr!2sca',
    },
    {
      nom: 'Opti-W Rosemère',
      adresse: '401 Boulevard Labelle, Rosemère, QC J7A 3T2',
      telephone: '(450) 555-5678',
      map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2793.4725790104156!2d-73.79624432355696!3d45.63680822621845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc935f2d77bd06f%3A0x1e69f23747e5b3a!2s401%20Boulevard%20Labelle%2C%20Rosem%C3%A8re%2C%20QC%20J7A%203T2!5e0!3m2!1sfr!2sca!4v1719960000001!5m2!1sfr!2sca',
    },
    {
      nom: 'Opti-W Blainville',
      adresse: '1005 Boulevard Curé-Labelle, Blainville, QC J7C 2M3',
      telephone: '(450) 555-9012',
      map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2791.5485354629997!2d-73.87801492355495!3d45.68440482212796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc931b0415c2d61%3A0xbebfd8ed4716de1f!2s1005%20Boulevard%20Cur%C3%A9-Labelle%2C%20Blainville%2C%20QC%20J7C%202M3!5e0!3m2!1sfr!2sca!4v1719960000002!5m2!1sfr!2sca',
    },
  ];

  return (
    <div className="app">
      <h2 className="header">📍 Nos magasins</h2>

      {magasins.map((m, idx) => (
        <div key={idx} style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 10px' }}>{m.nom}</h3>
            <p><strong>Adresse :</strong> {m.adresse}</p>
            <p><strong>Téléphone :</strong> {m.telephone}</p>
          </div>
          <div style={{ flex: 1 }}>
            <iframe
              title={`Carte ${m.nom}`}
              src={m.map}
              width="100%"
              height="200"
              style={{ border: 0, borderRadius: '10px' }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <button onClick={() => navigate('/')} className="login-button">
          🔙 Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
