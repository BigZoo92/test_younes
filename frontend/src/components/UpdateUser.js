import React, { useState } from 'react';
import {  useNavigate,useParams } from 'react-router-dom';


    

const UpdateUser = ({ onUserUpdated }) => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [email, setEmail] = useState('');
    const [pseudo, setName] = useState('');
  
    const handleUpdateUser = async () => {
        const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert('L\'adresse email doit contenir "@" et se terminer par ".com"');
      return;
    }
      try {
        const response = await fetch(`http://localhost:3001/user/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, pseudo }),
        });
  
        if (!response.ok) {
          throw new Error('Échec de la mise à jour de l\'utilisateur');
        }
        navigate(`/Account/${userId}`);
        onUserUpdated();
        
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error.message);
      }
    };
  
    return (
      <div>
        <h2>Update User</h2>
        <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <button onClick={handleUpdateUser}>Confirm change</button>
      </div>
    );
  };
  
  export default UpdateUser;
  