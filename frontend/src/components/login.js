import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const handleLogin = async (email, password, onLoggedIn, navigate) => {
  try {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid credentials');
      } else {
        throw new Error('Échec de la connexion');
      }
    }

    const data = await response.json();

    navigate(`/Home/${data.Id}`);
    console.log(data.message);

    // Call the parent function to indicate successful user login
    onLoggedIn();
  } catch (error) {
    console.error('Erreur lors de la connexion:', error.message);

    // Display an alert only for invalid credentials
    if (error.message === 'Invalid credentials') {
      alert('Login unsuccessful. Please check your credentials and try again.');
    }
  }
};

const Login = ({ onLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = () => {
    handleLogin(email, password, onLoggedIn, navigate);
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLoginClick}>Login</button>
      <p>Vous n'avez pas de compte? <Link to="/CreateUser">Créer un compte</Link></p>
    </div>
  );
};

export default Login;
