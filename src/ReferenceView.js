import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

export default function ReferenceView() {
  const [parrainages, setParrainages] = useState([]);
  const [filtre, setFiltre] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('parrainages')) || [];
    setParrainages(data);
  }, []);

  const resultatFiltre = parrainages.filter(p =>
    p.code.toLowerCase().includes(filtre.toLowerCase())
  );

  return (
    <div className="parrainage-container">
      <h2 style={{ textAlign: 'center', color: '#002f5f' }}>👁️ Vue Référence – Parrainages</h2>

      <input
        type="text"
        placeholder="🔍 Rechercher un code promo"
        value={filtre}
        onChange={(e) => setFiltre(e.target.value)}
        style={{
          marginBottom: '20px',
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontSize: '16px'
        }}
      />

      {resultatFiltre.length > 0 ? (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Code promo</th>
            </tr>
          </thead>
          <tbody>
            {resultatFiltre.map((p, i) => (
              <tr key={i}>
                <td>{p.nom}</td>
                <td>{p.prenom}</td>
                <td>{p.telephone}</td>
                <td>{p.email}</td>
                <td><strong>{p.code}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>Aucun parrainage trouvé.</p>
      )}

      <button
        className="referral-button"
        style={{ marginTop: '30px', width: '100%' }}
        onClick={() => navigate('/')}
      >
        🏠 Retour à l'accueil
      </button>
    </div>
  );
}

