import React, { useEffect, useState } from 'react';

export default function ReferenceView() {
  const [parrainages, setParrainages] = useState([]);
  const [filtre, setFiltre] = useState('');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('parrainages')) || [];
    setParrainages(data);
  }, []);

  const resultatFiltre = parrainages.filter(p =>
    p.code.toLowerCase().includes(filtre.toLowerCase())
  );

  return (
    <div className="parrainage-container">
      <h2>Liste des Parrainages</h2>
      <input
        type="text"
        placeholder="🔍 Rechercher un code"
        value={filtre}
        onChange={(e) => setFiltre(e.target.value)}
        style={{ marginBottom: '20px', width: '100%', padding: '10px', borderRadius: '5px' }}
      />
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
              <td>{p.code}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
