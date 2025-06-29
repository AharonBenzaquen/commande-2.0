
import React, { useState } from 'react';

export default function Tracking({ commandes }) {
  const [code, setCode] = useState('');
  const [commande, setCommande] = useState(null);

  const rechercher = () => {
    const result = commandes.find(c => c.numero === code);
    setCommande(result || null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔎 Suivi de commande</h2>
      <input
        placeholder="Entrez le numéro de commande"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={rechercher}>Rechercher</button>

      {commande ? (
        <div style={{ marginTop: 20, padding: 10, border: '1px solid #ccc' }}>
          <p><strong>Numéro :</strong> {commande.numero}</p>
          <p><strong>Client :</strong> {commande.client}</p>
          <p><strong>Statut :</strong> {commande.statut}</p>
          <p><strong>Commentaire :</strong> {commande.commentaire || 'Aucun'}</p>
        </div>
      ) : code && (
        <p style={{ color: 'red' }}>Commande non trouvée.</p>
      )}
    </div>
  );
}
