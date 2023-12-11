// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';  // Importez createRoot depuis "react-dom/client"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';  
import CreateUser from './components/CreateUser';
import Home from './components/home';
import Account from './components/Account';
import Task from './components/Task';
import UpdateUser from './components/UpdateUser';
import './style.css'



const App = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/createUser" element={<CreateUser />} />
    <Route path="/home/:userId" element={<Home />} />
    <Route path="/account/:userId" element={<Account/>}/>
    <Route path="/task/:userId" element={<Task/>}/>
    <Route path="/Account/UpdateUser/:userId" element={<UpdateUser/>}/>
  </Routes>
);

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Router>
    <App />
  </Router>
);