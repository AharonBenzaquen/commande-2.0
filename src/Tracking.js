
import React, { useState } from 'react';

function Tracking({ commandes }) {
  const [code, setCode] = useState('');
  const commande = commandes.find(c => c.numero === code);

  return (
    <div>
      <h2>Suivi client</h2>
      <input placeholder="Entrez votre code de suivi" value={code} onChange={e => setCode(e.target.value)} />
      {commande ? (
        <div>
          <p><strong>Client :</strong> {commande.client}</p>
          <p><strong>Date :</strong> {commande.date}</p>
          <p><strong>Statut :</strong> {commande.statut}</p>
          <p><strong>Commentaire :</strong> {commande.commentaire}</p>
        </div>
      ) : code ? <p>Aucune commande trouvée.</p> : null}
    </div>
  );
}

export default Tracking;
