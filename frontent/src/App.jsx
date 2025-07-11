import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './screen/Layout';
import Home from './screen/Home';
import Login from './screen/Login';
import ProtectedRoute from './components/ProtectedRoute';
import SocketIdContextProvider from './store/socketIdContext';
import AuthContextProvider from './store/authContext';
import Signup from './screen/Signup';

function App() {


  return (
    <AuthContextProvider>
      <SocketIdContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup/>} />
          </Routes>
        </BrowserRouter>
      </SocketIdContextProvider>
    </AuthContextProvider>
  )
}

export default App
