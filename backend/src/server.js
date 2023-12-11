import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/createUser', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Vous avez déjà un compte. Veuillez vous connecter.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        pseudo: name,
        password: hashedPassword,
      },
    });

    return res.json({ message: `Félicitations, ${newUser.pseudo} ! Vous avez créé un nouveau compte.`, Id:newUser.id });
  } catch (error) {
    console.error('Erreur :', error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'utilisateur.' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
      return res.status(401).json({ message: 'L\'utilisateur n\'existe pas. Veuillez vous inscrire.' });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (passwordMatch) {
      return res.json({ message: `Connexion réussie, bienvenue ${existingUser.pseudo} !` , Id: existingUser.id});
    } else {
      return res.status(401).json({ message: 'Mot de passe incorrect. Veuillez réessayer.' });
    }
  } catch (error) {
    console.error('Erreur :', error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de la connexion.' });
  }
});
app.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Ne renvoyez que les informations nécessaires, évitez de renvoyer le mot de passe par exemple
    const userData = {
      id: user.id,
      email: user.email,
      pseudo: user.pseudo,
    };

    return res.json(userData);
  } catch (error) {
    console.error('Erreur :', error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des informations de l\'utilisateur.' });
  }
});

// Ajout d'une route pour mettre à jour les informations de l'utilisateur
app.put('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { email, pseudo } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: email,
        pseudo: pseudo,
      },
    });

    return res.json({ message: `Les informations de l'utilisateur ont été mises à jour.` });
  } catch (error) {
    console.error('Erreur :', error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour des informations de l\'utilisateur.' });
  }
});

// Ajout d'une route pour supprimer l'utilisateur
app.delete('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    await prisma.user.delete({
      where: { id: userId },
    });

    return res.json({ message: `L'utilisateur a été supprimé.` });
  } catch (error) {
    console.error('Erreur :', error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de l\'utilisateur.' });
  }
});

app.post('/user/:userId/tasks', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { title, description } = req.body;

    const newTask = await prisma.task.create({
      data: {
        title: title,
        description: description,
        authorId: userId,
      },
    });

    return res.json({ message: `La tâche a été créée avec succès.`, task: newTask });
  } catch (error) {
    console.error('Erreur :', error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de la création de la tâche.' });
  }
});

// Ajout d'une route pour récupérer toutes les tâches d'un utilisateur
app.get('/user/:userId/tasks', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const tasks = await prisma.task.findMany({
      where: { authorId: userId },
    });

    return res.json({ tasks });
  } catch (error) {
    console.error('Erreur :', error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des tâches.' });
  }
});

// Ajout d'une route pour mettre à jour une tâche
app.put('/user/:userId/tasks/:taskId', async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    const { title, description } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title,
        description: description,
      },
    });

    return res.json({ message: `La tâche a été mise à jour avec succès.`, task: updatedTask });
  } catch (error) {
    console.error('Erreur :', error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour de la tâche.' });
  }
});

// Ajout d'une route pour supprimer une tâche
app.delete('/user/:userId/tasks/:taskId', async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId, 10);

    await prisma.task.delete({
      where: { id: taskId },
    });

    return res.json({ message: `La tâche a été supprimée avec succès.` });
  } catch (error) {
    console.error('Erreur :', error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de la tâche.' });
  }
});

// Ajout d'une route pour check ou non une tâche
app.put('/user/:taskId/tasks_checked', async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    const { isChecked } = req.body;
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        completed: isChecked,
      },
    });

    return res.json({ message: `La tâche a été mise à jour avec succès.`, task: updatedTask });
  } catch (error) {
    console.error('Erreur :', error);
    return res.status(500).json({ message: updatedTask });
  }
});


export { app, prisma };
