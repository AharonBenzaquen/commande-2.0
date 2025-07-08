import React, { useState } from 'react';

export default function Tracking({ commandes }) {
  const [code, setCode] = useState('');

  // 🔍 Recherche de la commande correspondant au code
  const commande = commandes.find(c => c.numero === code);

  return (
    <div className="tracking-container">
      <h2>Suivi client</h2>

      <input
        placeholder="Entrez votre code de suivi"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      {commande ? (
        <div className="tracking-result">
          <p><strong>Client :</strong> {commande.client}</p>
          <p><strong>Date :</strong> {commande.date}</p>
          <p><strong>Statut :</strong> {commande.statut}</p>
          <p><strong>Commentaire :</strong> {commande.commentaire}</p>
        </div>
      ) : (
        code && <p>Aucune commande trouvée.</p>
      )}
    </div>
  );
}
