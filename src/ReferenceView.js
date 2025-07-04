import React, { useEffect, useState } from 'react';
import './index.css';

export default function ReferenceView() {
  const [parrainages, setParrainages] = useState([]);
  const [filtre, setFiltre] = useState('');

  // Charger les parrainages au démarrage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('parrainages')) || [];
    setParrainages(data);
  }, []);

  // Supprimer un parrainage
  const supprimerParrainage = (index) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce parrainage ?");
    if (!confirmDelete) return;

    const nouveaux = [...parrainages];
    nouveaux.splice(index, 1);
    setParrainages(nouveaux);
    localStorage.setItem('parrainages', JSON.stringify(nouveaux));
  };

  // Filtrer les parrainages par code promo
  const resultatFiltre = parrainages.filter(p =>
    p.code.toLowerCase().includes(filtre.toLowerCase())
  );

  return (
    <div className="parrainage-container" style={{ maxWidth: '850px', margin: '60px auto', backgroundColor: 'rgba(255,255,255,0.95)', padding: '30px', borderRadius: '12px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#002f5f' }}>👁️ Vue Référence – Parrainages</h2>

      <input
        type="text"
        placeholder="🔍 Rechercher un code promo"
        value={filtre}
        onChange={(e) => setFiltre(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontSize: '16px'
        }}
      />

      <table className="styled-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr style={{ backgroundColor: '#002f5f', color: 'white' }}>
            <th style={{ padding: '12px' }}>Nom</th>
            <th style={{ padding: '12px' }}>Prénom</th>
            <th style={{ padding: '12px' }}>Téléphone</th>
            <th style={{ padding: '12px' }}>Email</th>
            <th style={{ padding: '12px' }}>Code promo</th>
            <th style={{ padding: '12px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {resultatFiltre.map((p, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
              <td style={{ padding: '10px', textAlign: 'center' }}>{p.nom}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>{p.prenom}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>{p.telephone}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>{p.email}</td>
              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#002f5f' }}>{p.code}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button
                  onClick={() => supprimerParrainage(i)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => {
          localStorage.clear(); // déconnexion forcée
          window.location.href = '/';
        }}
        style={{
          backgroundColor: '#002f5f',
          color: 'white',
          padding: '12px 20px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          width: '100%',
          cursor: 'pointer'
        }}
      >
        🏠 Retour à l'accueil
      </button>
    </div>
  );
}
