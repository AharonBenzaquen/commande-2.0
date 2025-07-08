import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

export default function ReferenceView({ setRole, setLogin, setMdp }) {
  const [parrainages, setParrainages] = useState([]);
  const [filtre, setFiltre] = useState('');
  const [codeEntree, setCodeEntree] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  // 📦 Charger les parrainages au démarrage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('parrainages')) || [];
    setParrainages(data);
  }, []);

  // 🔄 Validation automatique d'un code scanné ou saisi
  useEffect(() => {
    const code = codeEntree.trim();

    if (code.length > 5) {
      const index = parrainages.findIndex(p => p.code === code);
      const updated = [...parrainages];

      if (index !== -1 && !updated[index].utilise) {
        updated[index].utilise = true;
        setParrainages(updated);
        localStorage.setItem('parrainages', JSON.stringify(updated));
        setPopupMessage('✅ Code promo validé !');
      } else if (index !== -1 && updated[index].utilise) {
        setPopupMessage('⚠️ Code déjà utilisé.');
      } else {
        setPopupMessage('❌ Code promo invalide.');
      }

      setPopupVisible(true);
      setCodeEntree('');
      setTimeout(() => setPopupVisible(false), 1000);
    }
  }, [codeEntree, parrainages]);

  // 🗑️ Supprimer un parrainage
  const supprimerParrainage = (index) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce parrainage ?")) {
      const updated = [...parrainages];
      updated.splice(index, 1);
      setParrainages(updated);
      localStorage.setItem('parrainages', JSON.stringify(updated));
    }
  };

  // 🔍 Filtrage des parrainages
  const resultatFiltre = parrainages.filter(p =>
    p.code.toLowerCase().includes(filtre.toLowerCase())
  );

  // 🚪 Déconnexion
  const deconnexion = () => {
    setRole('');
    setLogin('');
    setMdp('');
    navigate('/');
  };

  return (
    <div className="parrainage-container" style={{ maxWidth: '800px', margin: '60px auto' }}>
      <h2 style={{ textAlign: 'center', color: '#002f5f' }}>👁️ Vue Référence – Parrainages</h2>

      {/* 🔍 Barre de recherche */}
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

      {/* 📲 Zone de scan/saisie code promo */}
      <div style={{ display: 'flex', marginBottom: '20px', gap: '10px' }}>
        <input
          type="text"
          placeholder="Scannez un code promo"
          value={codeEntree}
          onChange={(e) => setCodeEntree(e.target.value)}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />
      </div>

      {/* ✅ Message popup de validation */}
      {popupVisible && (
        <div style={{
          background: popupMessage.includes('validé') ? '#4CAF50' : '#ffc107',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '20px',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          {popupMessage}
        </div>
      )}

      {/* 📋 Tableau des parrainages */}
      <table className="styled-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#002f5f', color: 'white' }}>
            <th style={{ padding: '12px' }}>Nom</th>
            <th style={{ padding: '12px' }}>Prénom</th>
            <th style={{ padding: '12px' }}>Téléphone</th>
            <th style={{ padding: '12px' }}>Email</th>
            <th style={{ padding: '12px' }}>Code promo</th>
            <th style={{ padding: '12px' }}>Utilisé</th>
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
              <td style={{
                padding: '10px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#002f5f'
              }}>
                {p.code}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                {p.utilise ? '✔️' : '❌'}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button
                  onClick={() => supprimerParrainage(i)}
                  style={{
                    fontSize: '18px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🚪 Bouton de déconnexion */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={deconnexion}
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
          🏠 Déconnexion / Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
