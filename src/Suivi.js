import React, { useState } from 'react';

export default function Suivi({ commandes, retourAccueil }) {
  const [tracking, setTracking] = useState('');
  const [resultat, setResultat] = useState(null);

  const rechercherCommande = () => {
    const commande = commandes.find(c => c.numero === tracking);
    setResultat(commande || 'notfound');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔍 Suivi de commande client</h2>
      <input
        placeholder="Entrez votre numéro de commande"
        value={tracking}
        onChange={(e) => setTracking(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <button onClick={rechercherCommande}>Rechercher</button>
      <button onClick={retourAccueil} style={{ marginLeft: 10 }}>Retour</button>

      {resultat === 'notfound' && (
        <p style={{ color: 'red', marginTop: 20 }}>❌ Commande non trouvée.</p>
      )}

      {resultat && resultat !== 'notfound' && (
        <div style={{ marginTop: 20, border: '1px solid #ccc', padding: 15 }}>
          <p><strong>Numéro :</strong> {resultat.numero}</p>
          <p><strong>Nom du client :</strong> {resultat.client}</p>
          <p><strong>Date :</strong> {resultat.date}</p>
          <p><strong>Statut :</strong> {resultat.statut}</p>
          <p><strong>Commentaire :</strong> {resultat.commentaire}</p>
        </div>
      )}
    </div>
  );
}