import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

export default function ReferenceView() {
  const [parrainages, setParrainages] = useState([]);
  const [filtre, setFiltre] = useState('');
  const [codeEntree, setCodeEntree] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('parrainages')) || [];
    setParrainages(data);
  }, []);

  const supprimerParrainage = (index) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce parrainage ?")) {
      const updated = [...parrainages];
      updated.splice(index, 1);
      setParrainages(updated);
      localStorage.setItem('parrainages', JSON.stringify(updated));
    }
  };

  const validerCode = () => {
    const index = parrainages.findIndex(p => p.code === codeEntree.trim());
    if (index !== -1) {
      const updated = [...parrainages];
      updated.splice(index, 1);
      setParrainages(updated);
      localStorage.setItem('parrainages', JSON.stringify(updated));
      setPopupVisible(true);
      setTimeout(() => {
        setPopupVisible(false);
        setCodeEntree('');
      }, 1000);
    } else {
      alert("Code promo invalide.");
    }
  };

  const resultatFiltre = parrainages.filter(p =>
    p.code.toLowerCase().includes(filtre.toLowerCase())
  );

  return (
    <div className="parrainage-container" style={{ maxWidth: '800px', margin: '60px auto' }}>
      <h2 style={{ textAlign: 'center', color: '#002f5f' }}>👁️ Vue Référence – Parrainages</h2>

      <input
        type="text"
        placeholder="🔍 Rechercher un code promo"
        value={filtre}
        onChange={(e) => setFiltre(e.target.value)}
        style={{
          width: '100%', padding: '12px', marginBottom: '20px',
          borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px'
        }}
      />

      <div style={{ display: 'flex', marginBottom: '20px', gap: '10px' }}>
        <input
          type="text"
          placeholder="Entrer un code promo à valider"
          value={codeEntree}
          onChange={(e) => setCodeEntree(e.target.value)}
          style={{
            flex: 1, padding: '12px', borderRadius: '8px',
            border: '1px solid #ccc', fontSize: '16px'
          }}
        />
        <button
          onClick={validerCode}
          style={{
            backgroundColor: '#002f5f', color: 'white', padding: '12px 20px',
            border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          ✅ Valider
        </button>
      </div>

      {popupVisible && (
        <div style={{
          background: '#4CAF50', color: 'white', padding: '10px 20px',
          borderRadius: '8px', textAlign: 'center', marginBottom: '20px',
          fontWeight: 'bold', fontSize: '18px'
        }}>
          ✅ Code promo validé !
        </div>
      )}

      <table className="styled-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                <button onClick={() => supprimerParrainage(i)} style={{ fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer' }}>
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bouton de retour */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#002f5f',
            color: 'white',
            padding: '12px 20px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🏠 Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

