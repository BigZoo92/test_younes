import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Bare from '../Bare.js';
import {
  Button,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled('div')({
  backgroundColor: '#f0f0f0',
  color: '#333',
  height: '100vh',
});

const ContentContainer = styled('div')({
  padding: '20px',
});

const StyledButton = styled(Button)({
  marginRight: '10px',
  padding: '10px 20px',
  cursor: 'pointer',
});

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  const Overlay = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  });

  const DialogContainer = styled('div')({
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  });

  const ButtonContainer = styled('div')({
    marginTop: '10px',
  });

  return (
    <Overlay>
      <DialogContainer>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            style={{ backgroundColor: '#4caf50', color: 'white' }}
            onClick={onConfirm}
          >
            Confirm
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: '#f44336', color: 'white' }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </DialogActions>
      </DialogContainer>
    </Overlay>
  );
};

const Account = () => {
  const [userDetails, setUserDetails] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/user/${userId}`);

        if (!response.ok) {
          throw new Error('Échec de la récupération des détails de l\'utilisateur');
        }

        const userData = await response.json();
        setUserDetails(userData);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error.message);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleDeleteUser = async () => {
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    setShowConfirmation(false);

    try {
      const response = await fetch(`http://localhost:3001/user/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Échec de la suppression de l\'utilisateur');
      }

      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error.message);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleUpdateUser = async () => {
    navigate(`/Account/UpdateUser/${userId}`);
  };

  return (
    <StyledContainer>
      <Bare />
      <ContentContainer>
        <Typography variant="h2">Account</Typography>
        {userDetails && (
          <div>
            <Typography>Email: {userDetails.email}</Typography>
            <Typography>Pseudo: {userDetails.pseudo}</Typography>
            <StyledButton
              variant="contained"
              onClick={handleDeleteUser}
              style={{ backgroundColor: '#f44336', color: 'white' }}
            >
              Delete User
            </StyledButton>
            <StyledButton
              variant="contained"
              onClick={handleUpdateUser}
              style={{ backgroundColor: '#ff9800', color: 'white' }}
            >
              Modify user
            </StyledButton>
          </div>
        )}
      </ContentContainer>
      {showConfirmation && (
        <ConfirmationDialog
          message="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </StyledContainer>
  );
};

export default Account;
