import React, { useState } from 'react';

export default function Tracking({ commandes }) {
  const [code, setCode] = useState('');
  const commande = commandes.find(c => c.numero === code);

  return (
    <div className="tracking-client-container">
      <h2 className="tracking-client-title">🔍 Suivi de commande</h2>

      <input
        className="tracking-client-input"
        placeholder="Numéro de commande"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      {commande ? (
        <div className="tracking-client-info">
          <p><strong>Client :</strong> {commande.client}</p>
          <p><strong>Date :</strong> {commande.date}</p>
          <p><strong>Statut :</strong> {commande.statut}</p>
          <p><strong>Commentaire :</strong> {commande.commentaire}</p>
        </div>
      ) : (
        code && <p className="tracking-client-message">❌ Aucune commande trouvée.</p>
      )}
    </div>
  );
}

