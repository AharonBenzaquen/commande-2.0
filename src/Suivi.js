import React, { useState } from 'react';

export default function Suivi() {
  const [numero, setNumero] = useState('');
  const [commande, setCommande] = useState(null);

  const chercherCommande = () => {
    const data = JSON.parse(localStorage.getItem('commandes') || '[]');
    const found = data.find(c => c.numero === numero);
    setCommande(found || null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Suivi de commande</h2>
      <input
        placeholder="Entrez le numéro de commande"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
      />
      <button onClick={chercherCommande}>Rechercher</button>

      {commande ? (
        <div style={{ marginTop: 20 }}>
          <p><strong>Client :</strong> {commande.client}</p>
          <p><strong>Statut :</strong> {commande.statut}</p>
        </div>
      ) : numero ? (
        <p style={{ marginTop: 20 }}>Commande non trouvée.</p>
      ) : null}
    </div>
  );
}