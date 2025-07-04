
import React, { useState } from 'react';

export default function ReferenceView() {
  const [search, setSearch] = useState('');
  const [parrainages, setParrainages] = useState([
    { code: 'Parrain10-ABC123', nom: 'Jean Dupont', email: 'jean@email.com' },
    { code: 'Parrain10-XYZ456', nom: 'Sarah Leblanc', email: 'sarah@email.com' },
  ]);

  const resultats = parrainages.filter((p) => p.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '30px' }}>
      <h2>📋 Liste des parrainages</h2>
      <input
        type="text"
        placeholder="Rechercher par code promo"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '10px', marginBottom: '20px', width: '100%', maxWidth: '400px' }}
      />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Code</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Nom</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {resultats.map((p, i) => (
            <tr key={i}>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{p.code}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{p.nom}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{p.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
