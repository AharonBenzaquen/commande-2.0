
import React, { useState } from 'react';

export default function Tracking() {
  const [trackingCode, setTrackingCode] = useState('');
  const [resultat, setResultat] = useState(null);

  const chercherCommande = () => {
    const sauvegarde = JSON.parse(localStorage.getItem('commandes')) || [];
    const commande = sauvegarde.find((c) => c.numero === trackingCode);
    setResultat(commande || 'notfound');
  };

  return (
    <div>
      <h2>Suivi de votre commande</h2>
      <input placeholder="Entrez votre numéro de commande" value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} />
      <button onClick={chercherCommande}>🔍 Suivre</button>

      {resultat === 'notfound' && <p>❌ Aucune commande trouvée</p>}
      {resultat && resultat !== 'notfound' && (
        <div>
          <p><strong>Client :</strong> {resultat.client}</p>
          <p><strong>Date :</strong> {resultat.date}</p>
          <p><strong>Statut :</strong> {resultat.statut}</p>
          <p><strong>Commentaire :</strong> {resultat.commentaire}</p>
        </div>
      )}
    </div>
  );
}
