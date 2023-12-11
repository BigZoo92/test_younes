import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CreateUser = ({ onUserCreated }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleCreateUser = async () => {
    // Email validation condition
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert('L\'adresse email doit contenir "@" et se terminer par ".com"');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      if (!response.ok) {
        throw new Error('Création d\'utilisateur échouée');
      }

      const data = await response.json();
      navigate(`/Home/${data.Id}`);
      console.log(data.message);

      // Call the parent function to indicate successful user creation
      onUserCreated();
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error.message);
    }
  };

  return (
    <div>

      <h2>Create User</h2>
      <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleCreateUser}>Create User</button>
      <p>Vous avez déjà un compte? <Link to="/">Connectez-vous</Link></p>
    </div>
  );
};

export default CreateUser;
