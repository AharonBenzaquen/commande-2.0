// MainApp.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function differenceEnJours(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2 - d1;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function MainApp({ setRole, setLogin, setMdp, role, magasin, setMagasin }) {
  const [commande, setCommande] = useState({ numero: '', client: '', date: '', statut: 'En attente', commentaire: '' });
  const [commandes, setCommandes] = useState(() => JSON.parse(localStorage.getItem('commandes')) || []);
  const [editionIndex, setEditionIndex] = useState(null);
  const [formActif, setFormActif] = useState(false);
  const navigate = useNavigate();
  const aujourdHui = new Date();

  useEffect(() => {
    localStorage.setItem('commandes', JSON.stringify(commandes));
  }, [commandes]);

  const filtrerCommandes = commandes.filter((c) =>
    role === 'admin' || role === 'labo' || c.origine === magasin
  );

  const ajouterCommande = () => {
    const updated = [...commandes];
    if (editionIndex !== null) {
      updated[editionIndex] = { ...commande, origine: magasin };
      setEditionIndex(null);
    } else {
      updated.push({ ...commande, origine: magasin });
    }
    setCommandes(updated);
    setCommande({ numero: '', client: '', date: '', statut: 'En attente', commentaire: '' });
    setFormActif(false);
  };

  const modifierCommande = (index) => {
    setCommande(commandes[index]);
    setEditionIndex(index);
    setFormActif(true);
  };

  const supprimerCommande = (index) => {
    const updated = [...commandes];
    updated.splice(index, 1);
    setCommandes(updated);
  };

  const changerStatut = (index, nouveauStatut) => {
    const updated = [...commandes];
    updated[index].statut = nouveauStatut;
    setCommandes(updated);
  };

  const changerCommentaire = (index, texte) => {
    const updated = [...commandes];
    updated[index].commentaire = texte;
    setCommandes(updated);
  };

  const handleLogout = () => {
    setRole('');
    setLogin('');
    setMdp('');
    setMagasin('');
    localStorage.removeItem('role');
    localStorage.removeItem('magasin');
    navigate('/');
  };

  return (
    <div className="app">
      <h2 className="header">Bienvenue {role === 'magasin' ? magasin : role}</h2>
      <button onClick={handleLogout}>Déconnexion</button>
      <hr />
      <button onClick={() => {
        setFormActif(true);
        setCommande({ numero: '', client: '', date: '', statut: 'En attente', commentaire: '' });
        setEditionIndex(null);
      }}>
        ➕ Nouvelle commande
      </button>

      <div className="formulaire">
        <input disabled={!formActif} placeholder="Numéro de commande" value={commande.numero} onChange={(e) => setCommande({ ...commande, numero: e.target.value })} />
        <input disabled={!formActif} placeholder="Nom du client" value={commande.client} onChange={(e) => setCommande({ ...commande, client: e.target.value })} />
        <input disabled={!formActif} type="date" value={commande.date} onChange={(e) => setCommande({ ...commande, date: e.target.value })} />
        <textarea disabled={!formActif} placeholder="Commentaire" value={commande.commentaire} onChange={(e) => setCommande({ ...commande, commentaire: e.target.value })} />
        <select disabled={!formActif} value={commande.statut} onChange={(e) => setCommande({ ...commande, statut: e.target.value })}>
          <option>En attente</option>
          <option>Reçue au labo</option>
          <option>En production</option>
          <option>Prête</option>
          <option>Expédiée</option>
          <option>Reçue au magasin</option>
          <option>Livrée au client</option>
        </select>
        {formActif && (
          <button onClick={ajouterCommande}>
            {editionIndex !== null ? '✅ Modifier' : '📦 Ajouter'}
          </button>
        )}
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Délai</th>
            <th>Commentaire</th>
            <th>Origine</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtrerCommandes.map((c, i) => {
            const jours = differenceEnJours(c.date, aujourdHui);
            const style = jours >= 14 ? { backgroundColor: '#ffcccc' } : jours >= 10 ? { backgroundColor: '#fff3cd' } : {};
            return (
              <tr key={i} style={style}>
                <td>{c.numero}</td>
                <td>{c.client}</td>
                <td>{c.date}</td>
                <td>
                  <select value={c.statut} onChange={(e) => changerStatut(i, e.target.value)}>
                    <option>En attente</option>
                    <option>Reçue au labo</option>
                    <option>En production</option>
                    <option>Prête</option>
                    <option>Expédiée</option>
                    <option>Reçue au magasin</option>
                    <option>Livrée au client</option>
                  </select>
                </td>
                <td>{jours} jours</td>
                <td><textarea value={c.commentaire} onChange={(e) => changerCommentaire(i, e.target.value)} /></td>
                <td>{c.origine}</td>
                <td>
                  <button onClick={() => modifierCommande(i)}>✏️</button>
                  <button onClick={() => supprimerCommande(i)}>🗑️</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
