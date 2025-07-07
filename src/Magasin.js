// Magasin.js
import React from 'react';

export default function Magasin() {
  const magasins = [
    {
      nom: "Opti-W Laval",
      adresse: "5400 Boul Robert-Bourassa, Laval, QC H7E 4P2",
      tel: "(450) 123-4567",
      mapsUrl: "https://www.google.com/maps?q=opti-w+laval",
      iframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.911253501144!2d-73.68648468412398!3d45.60059347910219!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc919cb0e2e6a81%3A0xabc123!2sOpti-W+Laval!5e0!3m2!1sen!2sca!4v1710000000000"
    },
    {
      nom: "Opti-W Rosemère",
      adresse: "401 Boul Labelle, Rosemère, QC J7A 3T2",
      tel: "(450) 234-5678",
      mapsUrl: "https://www.google.com/maps?q=opti-w+rosemère",
      iframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.12345678901!2d-73.789456!3d45.631234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc920123456789!2sOpti-W+Rosemère!5e0!3m2!1sen!2sca!4v1710000000001"
    },
    {
      nom: "Opti-W Blainville",
      adresse: "500 Boul du Curé-Labelle, Blainville, QC J7C 2H2",
      tel: "(450) 345-6789",
      mapsUrl: "https://www.google.com/maps?q=opti-w+blainville",
      iframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.987654321!2d-73.910123!3d45.672345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc921abcdef!2sOpti-W+Blainville!5e0!3m2!1sen!2sca!4v1710000000002"
    },
  ];

  return (
    <div className="app" style={{ padding: '40px' }}>
      <h2 className="header">📍 Nos Magasins</h2>
      {magasins.map((magasin, index) => (
        <div key={index} style={{ marginBottom: '40px', background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h3>{magasin.nom}</h3>
          <p><strong>Adresse :</strong> {magasin.adresse}</p>
          <p><strong>Téléphone :</strong> {magasin.tel}</p>
          <a href={magasin.mapsUrl} target="_blank" rel="noopener noreferrer">🗺️ Voir sur Google Maps</a>
          <div style={{ marginTop: '15px' }}>
            <iframe
              src={magasin.iframeUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title={`Google Maps ${magasin.nom}`}
            ></iframe>
          </div>
        </div>
      ))}
    </div>
  );
}
