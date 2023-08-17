import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { useEffect, useState } from 'react';
import { setAxiosToken } from './services/api';

import io from 'socket.io-client';
import ChatsPage from './pages/ChatsPage';
import Users from './pages/admin/Users';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io.connect(process.env.REACT_APP_BACKEND_URL);

const App = () => {
  console.log('process.env.REACT_APP_BACKEND_URL :>> ', process.env.REACT_APP_BACKEND_URL);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    console.log('token :>> ', token);
    if (token) {
      setAxiosToken(token);
      socket.emit('authenticate', user?.id);
    }
  }, [token]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/login"
          element={<LoginPage token={token} setToken={setToken} setUser={setUser} setIsAdmin={setIsAdmin} />}
        />
        <Route path="/chats" element={<ChatsPage user={user} socket={socket} />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </>
  );
};

export default App;
