import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  Button,
  Checkbox,
  Paper,
  TextField,
  TextareaAutosize,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/system';
import Bare from '../Bare';
import '../style/task.css'


const StyledPaper = styled(Paper)({
  padding: '20px',
  marginBottom: '20px',
});


const StyledButton = styled(Button)({
  marginRight: '10px',

});

const StyledList = styled(List)({
  padding: 0,
  width: "100%",
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: "center",
  flexDirection: 'column'
});

const StyledListItem = styled(ListItem)({
  marginBottom: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  
});

const StyledCheckbox = styled(Checkbox)({
  // Styles personnalisés pour la case à cocher
});

const Task = () => {
  const { userId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [checkedTasks, setCheckedTasks] = useState([]);


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = async(task) => {
    setCheckedTasks(prevCheckedTasks => prevCheckedTasks.includes(task.id) ? prevCheckedTasks.filter(id => id !== task.id) :[...prevCheckedTasks, task.id]);
    await checkedTasksFetch(!task.completed, task.id)
  };


  const checkedTasksFetch = async (isChecked, taskId) => {
    try {
      const response = await fetch(`http://localhost:3001/user/${taskId}/tasks_checked`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isChecked}),
      });
      const data = await response.json();
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches :', error);
    }
  };
  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:3001/user/${userId}/tasks`);
      const data = await response.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches :', error);
    }
  };

  const createTask = () => {
    setShowForm(true);
    setEditingTaskId(null);
  };

  const handleEditTask = (task) => {
    setShowForm(true);
    setEditingTaskId(task.id);
    setFormData({
      title: task.title,
      description: task.description,
    });
  };

  const submitForm = async () => {
    try {
      const endpoint = editingTaskId
        ? `http://localhost:3001/user/${userId}/tasks/${editingTaskId}`
        : `http://localhost:3001/user/${userId}/tasks`;

      const method = editingTaskId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
        }),
      });

      const data = await response.json();

      // Mise à jour de la liste des tâches avec la nouvelle tâche ou la tâche modifiée
      setTasks((prevTasks) =>
        editingTaskId
          ? prevTasks.map((task) => (task.id === editingTaskId ? data.task : task))
          : [...prevTasks, data.task]
      );

      // Réinitialiser le formulaire et masquer le formulaire après la soumission
      setFormData({ title: '', description: '' });
      setShowForm(false);
      setEditingTaskId(null); // Réinitialiser l'ID de la tâche en cours d'édition
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire :', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3001/user/${userId}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Supprimer la tâche de la liste des tâches
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } else {
        console.error('Erreur lors de la suppression de la tâche.');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche :', error);
    }
  };

  useEffect(() => {
    if(tasks.length === 0) return
    const newTasks = []
    for (const task of tasks){
      task.completed && newTasks.push(task.id)
    }
    setCheckedTasks(newTasks)
  }, [tasks]);


  useEffect(() => {
    fetchTasks();
  }, [userId]);

  return (
    <>
      <Bare />
      <section className='cd_task'>
        <h1>Task Manager</h1>
      <StyledPaper>
      
      {showForm && (
        <div className='form_task'>
          <TextField
            label="Titre"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            fullWidth
          />
          <br />
          <TextareaAutosize
            label="Description"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            rows={2}
            fullWidth
          />
          <br />
          <div className="cd_button_form_task">
            <StyledButton variant="contained" style={{backgroundColor: '#161E54'}} onClick={submitForm}>
              {editingTaskId ? 'Modifier' : 'Ajouter'}
            </StyledButton>
            <StyledButton variant="outlined" style={{color: '#161E54', borderColor: "#161E54"}} onClick={() => setShowForm(false)}>
              Cancel
            </StyledButton>
          </div>
          
        </div>
      )}

      {!showForm && (
        <StyledButton variant="contained" style={{backgroundColor: '#161E54'}} onClick={createTask}>
          Add new task
        </StyledButton>
      )}
    </StyledPaper>

    <StyledList>
      
      {tasks.length === 0 ? (
        <div className='cd_hot_air'>
        <svg className="hot-air" width="50" viewBox="0 0 84 126" fill="none">
        <path
          d="M75.1224 32.5435C75.1224 53.4471 58.3042 88.0945 37.5602 88.0945C16.8162 88.0945 -1.35462e-07 53.4471 -1.35462e-07 32.5435C-1.35462e-07 11.6379 16.8162 1.85674e-07 37.5602 1.85674e-07C58.3042 1.85674e-07 75.1224 11.6379 75.1224 32.5435Z"
          transform="translate(8.87762 6.95734)"
          fill="#E56A77"
        />
        <path
          d="M34.3288 11.3081C34.3288 16.2847 30.3259 19.8805 25.388 19.8805H13.5196C8.5817 19.8805 4.5769 16.2847 4.5769 11.3081L-8.1277e-07 7.27537e-07H38.9076L34.3288 11.3081Z"
          transform="translate(26.6032 106.12)"
          fill="#EDC951"
        />
        <path
          d="M40.5194 94.0565C18.1518 94.0565 -1.35462e-07 58.6383 -1.35462e-07 35.5235C-1.35462e-07 14.2761 16.2835 0 40.5194 0C64.7553 0 81.0408 14.2761 81.0408 35.5235C81.0408 58.6383 62.8871 94.0565 40.5194 94.0565ZM40.5194 5.96396C23.2949 5.96396 5.91841 15.1046 5.91841 35.5235C5.91841 55.3285 22.0895 88.0925 40.5194 88.0925C58.9493 88.0925 75.1224 55.3285 75.1224 35.5235C75.1224 15.1046 57.742 5.96396 40.5194 5.96396Z"
          fill="black"
        />
        <path
          d="M28.3465 25.8465H16.4781C10.0211 25.8465 4.91744 21.0944 4.59193 14.9159L0.218222 4.10841C-0.152665 3.18859 -0.0461315 2.14361 0.502308 1.31914C1.05075 0.494678 1.97204 -3.57706e-06 2.95845 -3.57706e-06H41.8661C42.8525 -3.57706e-06 43.7738 0.494678 44.3222 1.31914C44.8707 2.14361 44.9772 3.18859 44.6043 4.10841L40.2326 14.9159C39.9071 21.0944 34.8034 25.8465 28.3465 25.8465ZM7.36174 5.96396L10.2756 13.1636C10.4196 13.5212 10.4946 13.9046 10.4946 14.2901C10.4946 17.4786 13.0671 19.8805 16.4781 19.8805H28.3465C31.7574 19.8805 34.33 17.4786 34.33 14.2901C34.33 13.9046 34.4049 13.5212 34.5489 13.1636L37.4628 5.96396H7.36174Z"
          transform="translate(17.7264 98.1669)"
          fill="black"
        />
        <path
          d="M30.5785 5.96395H2.9592C1.32572 5.96395 -8.72975e-07 4.62892 -8.72975e-07 2.98198C-8.72975e-07 1.33305 1.32572 -1.45507e-06 2.9592 -1.45507e-06H30.5785C32.2119 -1.45507e-06 33.5377 1.33305 33.5377 2.98198C33.5377 4.62892 32.2119 5.96395 30.5785 5.96395Z"
          transform="translate(22.4249 110.097)"
          fill="black"
        />
        <path
          d="M2.96042 47.9719C1.86355 47.9719 0.810072 47.3521 0.297143 46.2912C-0.415039 44.8091 0.196527 43.0251 1.66627 42.3059C13.144 36.6897 22.3846 16.2012 22.3846 2.98198C22.3846 1.33305 23.7104 5.45653e-07 25.3439 5.45653e-07C26.9773 5.45653e-07 28.3031 1.33305 28.3031 2.98198C28.3031 18.5216 18.0169 40.9351 4.25261 47.6699C3.83635 47.8746 3.39444 47.9719 2.96042 47.9719Z"
          transform="translate(37.0086 44.3264)"
          fill="black"
        />
        <path
          d="M25.3426 47.9719C24.9086 47.9719 24.4667 47.8746 24.0524 47.6699C10.2862 40.9351 -4.51539e-07 18.5216 -4.51539e-07 2.98198C-4.51539e-07 1.33305 1.32572 5.45653e-07 2.9592 5.45653e-07C4.59269 5.45653e-07 5.91841 1.33305 5.91841 2.98198C5.91841 16.2012 15.161 36.6897 26.6368 42.3059C28.1065 43.0251 28.7201 44.8091 28.0059 46.2912C27.495 47.3521 26.4395 47.9719 25.3426 47.9719Z"
          transform="translate(16.4098 44.3264)"
          fill="black"
        />
      </svg>
      <h2>Nothing on the to-do horizon. Enjoy the calm!</h2>
      </div>
      ) : tasks.map((task) => (
        <StyledListItem key={task.id}>
          <StyledCheckbox
            color="primary"
            checked={checkedTasks.includes(task.id)}
            onChange={() => handleCheckboxChange(task)}
          />
          <ListItemText>
            <Typography variant="h6">{task.title || 'Titre non disponible'}</Typography>
            <Typography>{task.description || 'Description non disponible'}</Typography>
          </ListItemText>
          <StyledButton variant="outlined" color="secondary" onClick={() => deleteTask(task.id)}>
            Delete
          </StyledButton>
          <StyledButton variant="outlined" color="primary" onClick={() => handleEditTask(task)}>
            Modify
          </StyledButton>
        </StyledListItem>
      ))}
    </StyledList>
      </section>
      
      </>
  );
};

export default Task;