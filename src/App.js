
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Tracking from './Tracking';
import './index.css';

function App() {
  const [commandes, setCommandes] = useState([
    { numero: 'CMD001', client: 'Jean Dupont', date: '2025-06-10', statut: 'En attente', commentaire: 'Commande urgente' },
    { numero: 'CMD002', client: 'Sophie Tremblay', date: '2025-06-15', statut: 'En production', commentaire: '' }
  ]);
  const [commande, setCommande] = useState({ numero: '', client: '', date: '', statut: 'En attente', commentaire: '' });
  const [recherche, setRecherche] = useState('');
  const [editionIndex, setEditionIndex] = useState(null);

  const ajouterCommande = () => {
    if (editionIndex !== null) {
      const updated = [...commandes];
      updated[editionIndex] = commande;
      setCommandes(updated);
      setEditionIndex(null);
    } else {
      setCommandes([...commandes, commande]);
    }
    setCommande({ numero: '', client: '', date: '', statut: 'En attente', commentaire: '' });
  };

  const modifierCommande = (index) => {
    setCommande(commandes[index]);
    setEditionIndex(index);
  };

  const supprimerCommande = (index) => {
    const updated = [...commandes];
    updated.splice(index, 1);
    setCommandes(updated);
  };

  const changerCommentaire = (index, texte) => {
    const updated = [...commandes];
    updated[index].commentaire = texte;
    setCommandes(updated);
  };

  return (
    <Router>
      <div className="container">
        <h1>OPTI-W Commandes</h1>
        <nav>
          <Link to="/">Accueil</Link> | <Link to="/tracking">🔍 Suivi client</Link>
        </nav>
        <Routes>
          <Route path="/" element={
            <div>
              <input placeholder="Numéro" value={commande.numero} onChange={e => setCommande({ ...commande, numero: e.target.value })} />
              <input placeholder="Client" value={commande.client} onChange={e => setCommande({ ...commande, client: e.target.value })} />
              <input type="date" value={commande.date} onChange={e => setCommande({ ...commande, date: e.target.value })} />
              <textarea placeholder="Commentaire" value={commande.commentaire} onChange={e => setCommande({ ...commande, commentaire: e.target.value })}></textarea>
              <select value={commande.statut} onChange={e => setCommande({ ...commande, statut: e.target.value })}>
                <option>En attente</option>
                <option>Reçue au labo</option>
                <option>En production</option>
                <option>Prête</option>
                <option>Expédiée</option>
                <option>Reçue au magasin</option>
                <option>Livrée au client</option>
              </select>
              <button onClick={ajouterCommande}>{editionIndex !== null ? 'Modifier' : 'Ajouter'}</button>
              <input placeholder="Rechercher" value={recherche} onChange={e => setRecherche(e.target.value)} />
              <table>
                <thead><tr><th>Numéro</th><th>Client</th><th>Date</th><th>Statut</th><th>Commentaire</th><th>Actions</th></tr></thead>
                <tbody>
                  {commandes.filter(c => c.numero.includes(recherche)).map((c, i) => (
                    <tr key={i}>
                      <td>{c.numero}</td>
                      <td>{c.client}</td>
                      <td>{c.date}</td>
                      <td>{c.statut}</td>
                      <td><textarea value={c.commentaire} onChange={e => changerCommentaire(i, e.target.value)} /></td>
                      <td><button onClick={() => modifierCommande(i)}>✏️</button><button onClick={() => supprimerCommande(i)}>🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          } />
          <Route path="/tracking" element={<Tracking commandes={commandes} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
