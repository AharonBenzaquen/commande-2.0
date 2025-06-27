
import React, { useState } from 'react';

export default function Suivi({ commandes }) {
  const [numero, setNumero] = useState('');
  const [resultat, setResultat] = useState(null);

  const rechercher = () => {
    const cmd = commandes.find(c => c.numero === numero);
    setResultat(cmd || false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Suivi de commande</h2>
      <input
        placeholder="Entrez votre numéro de commande"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
      />
      <button onClick={rechercher}>🔍 Rechercher</button>

      {resultat === false && <p style={{ color: 'red' }}>Commande introuvable.</p>}

      {resultat && (
        <div style={{ marginTop: 20, padding: 10, border: '1px solid #ccc', borderRadius: 6 }}>
          <p><strong>Numéro :</strong> {resultat.numero}</p>
          <p><strong>Date :</strong> {resultat.date}</p>
          <p><strong>Statut :</strong> {resultat.statut}</p>
          <p><strong>Commentaire :</strong> {resultat.commentaire || "Aucun"}</p>
        </div>
      )}
    </div>
  );
}
