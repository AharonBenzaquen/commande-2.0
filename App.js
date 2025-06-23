import React, { useState } from 'react';
import './index.css';

export default function App() {
  const [message, setMessage] = useState('Bienvenue sur OPTI-W Commandes');

  return (
    <div>
      <h1>{message}</h1>
      <p>Le projet est fonctionnel.</p>
    </div>
  );
}
