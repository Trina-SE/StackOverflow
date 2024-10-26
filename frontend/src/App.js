// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SignIn from './components/SignIn';
import Register from './components/Register';
import Posts from './components/Posts';
import NotFound from './components/NotFound';
import Home from './components/Home'; // Optional Home component
import CreatePost from './components/CreatePost'; // Import your CreatePost component

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/create-post" element={<CreatePost />} /> {/* Define route for creating post */}
        <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
      </Routes>
    </AuthProvider>
  );
};

export default App;
