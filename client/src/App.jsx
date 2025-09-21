import './App.css'
import React, { useEffect } from 'react'
import Login from './pages/login/Login';
import { Routes, Route, useNavigate } from 'react-router-dom';
import styles from './App.module.css';
import GoogleCallback from './pages/google-callback/GoogleCallback';
import Home from './pages/home/Home';
import Navbar from './components/navbar/Navbar';
import axios from 'axios';
import ChatPage from './pages/chatPage/ChatPage';
import { setUser } from './redux/slices/userSlice';
import { useDispatch } from 'react-redux';
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname === '/google-callback') return;
    getUser();
 }, []);
  
  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:4000/auth/users', {
        withCredentials: true,
      });
      dispatch(setUser(response?.data?.data));
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
      // window.location.href = '/login'; // Redirect to login page on error
    }
  };
  return (
    <div className={styles.app}>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/google-callback' element={<GoogleCallback />} />
          <Route path='/chat/:topicId' element={<ChatPage/>} />
        </Routes>
    </div>
  )
}

export default App
