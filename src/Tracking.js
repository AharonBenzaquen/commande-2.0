import React, { useState } from 'react';

export default function Tracking({ commandes }) {
  const [code, setCode] = useState('');
  const [resultat, setResultat] = useState(null);
  const [afficheMessage, setAfficheMessage] = useState(false);

  const handleSearch = () => {
    const commandeTrouvee = commandes.find(c => c.numero === code.trim());
    setResultat(commandeTrouvee || null);
    setAfficheMessage(true);
  };

  return (
    <div className="tracking-client-container">
      <h2 className="tracking-client-title">🔍 Suivi de commande</h2>

      <input
        className="tracking-client-input"
        placeholder="Numéro de commande"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button className="tracking-client-button" onClick={handleSearch}>
        🔎 Rechercher
      </button>

      {resultat ? (
        <div className="tracking-client-info">
          <p><strong>Client :</strong> {resultat.client}</p>
          <p><strong>Date :</strong> {resultat.date}</p>
          <p><strong>Statut :</strong> {resultat.statut}</p>
          <p><strong>Commentaire :</strong> {resultat.commentaire}</p>
        </div>
      ) : (
        afficheMessage && (
          <p className="tracking-client-message">❌ Aucune commande trouvée.</p>
        )
      )}
    </div>
  );
}
