import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 🔧 Fonction utilitaire : différence entre deux dates en jours
function differenceEnJours(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2 - d1;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function MainApp({ setRole, setLogin, setMdp, role, magasin, setMagasin }) {
  const navigate = useNavigate();
  const aujourdHui = new Date();

  // États
  const [commande, setCommande] = useState({
    numero: '',
    client: '',
    date: '',
    statut: 'En attente',
    commentaire: ''
  });

  const [commandes, setCommandes] = useState(() => JSON.parse(localStorage.getItem('commandes')) || []);
  const [editionIndex, setEditionIndex] = useState(null);
  const [formActif, setFormActif] = useState(false);

  // Enregistre les commandes localement
  useEffect(() => {
    localStorage.setItem('commandes', JSON.stringify(commandes));
  }, [commandes]);

  // Filtrage des commandes selon le rôle
  const commandesFiltrees = commandes.filter(c =>
    role === 'admin' || role === 'labo' || c.origine === magasin
  );

  // Ajout ou modification de commande
  const ajouterCommande = () => {
    const copie = [...commandes];
    const nouvelle = { ...commande, origine: magasin };

    if (editionIndex !== null) {
      copie[editionIndex] = nouvelle;
      setEditionIndex(null);
    } else {
      copie.push(nouvelle);
    }

    setCommandes(copie);
    setCommande({ numero: '', client: '', date: '', statut: 'En attente', commentaire: '' });
    setFormActif(false);
  };

  // Déclenche modification
  const modifierCommande = (index) => {
    setCommande(commandes[index]);
    setEditionIndex(index);
    setFormActif(true);
  };

  // Supprime une commande
  const supprimerCommande = (index) => {
    const copie = [...commandes];
    copie.splice(index, 1);
    setCommandes(copie);
  };

  // Changer statut
  const changerStatut = (index, newStatut) => {
    const copie = [...commandes];
    copie[index].statut = newStatut;
    setCommandes(copie);
  };

  // Changer commentaire
  const changerCommentaire = (index, texte) => {
    const copie = [...commandes];
    copie[index].commentaire = texte;
    setCommandes(copie);
  };

  // Déconnexion
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
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleLogout} className="login-button">Déconnexion</button>
        <a
          href="https://ton-lien-de-rendez-vous.com"
          target="_blank"
          rel="noopener noreferrer"
          className="login-button"
          style={{ marginLeft: '10px', backgroundColor: '#f4c51c', color: '#002f5f' }}
        >
          📅 Prendre rendez-vous
        </a>
      </div>

      {/* ➕ Nouvelle commande */}
      <button onClick={() => {
        setFormActif(true);
        setCommande({ numero: '', client: '', date: '', statut: 'En attente', commentaire: '' });
        setEditionIndex(null);
      }}>
        ➕ Nouvelle commande
      </button>

      {/* 📋 Formulaire de commande */}
      <div className="formulaire">
        <input
          disabled={!formActif}
          placeholder="Numéro de commande"
          value={commande.numero}
          onChange={(e) => setCommande({ ...commande, numero: e.target.value })}
        />
        <input
          disabled={!formActif}
          placeholder="Nom du client"
          value={commande.client}
          onChange={(e) => setCommande({ ...commande, client: e.target.value })}
        />
        <input
          disabled={!formActif}
          type="date"
          value={commande.date}
          onChange={(e) => setCommande({ ...commande, date: e.target.value })}
        />
        <textarea
          disabled={!formActif}
          placeholder="Commentaire"
          value={commande.commentaire}
          onChange={(e) => setCommande({ ...commande, commentaire: e.target.value })}
        />
        <select
          disabled={!formActif}
          value={commande.statut}
          onChange={(e) => setCommande({ ...commande, statut: e.target.value })}
        >
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

      {/* 📊 Tableau des commandes */}
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
          {commandesFiltrees.map((c, i) => {
            const jours = differenceEnJours(c.date, aujourdHui);
            const style = jours >= 14
              ? { backgroundColor: '#ffcccc' }
              : jours >= 10
              ? { backgroundColor: '#fff3cd' }
              : {};

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
                <td>
                  <textarea
                    value={c.commentaire}
                    onChange={(e) => changerCommentaire(i, e.target.value)}
                  />
                </td>
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
