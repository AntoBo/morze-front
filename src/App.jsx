import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { useEffect, useState } from 'react';
import { setAxiosToken } from './services/api';

import io from 'socket.io-client';
import ChatsPage from './pages/ChatsPage';
import Users from './pages/admin/Users';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const socket = io.connect(process.env.REACT_APP_BACKEND_URL);

const App = () => {
  console.log('process.env.REACT_APP_BACKEND_URL :>> ', process.env.REACT_APP_BACKEND_URL);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('token :>> ', token);
    if (token) {
      setAxiosToken(token);
      // socket.emit('authenticate', user);

      console.log('user :>> ', user);
    }
  }, [token]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/login"
          element={!token ? <LoginPage setToken={setToken} setUser={setUser} /> : <Navigate to={`/users`} />}
        />
        <Route path="/users" element={token && user?.isAdmin ? <Users /> : <Navigate to={`/chats`} />} />
        <Route path="/chats" element={token ? <ChatsPage user={user} /> : <Navigate to={`/login`} />} />
        <Route path="/*" element={<Navigate to={`/login`} />} />
      </Routes>
    </>
  );
};

export default App;
