import React, { useState } from 'react';
import Register from '../components/Register';
import Login from '../components/Login';

const HomePage = () => {
  const [isRegister, setIsRegister] = useState(true);

  return (
    <div className="homepage">
      <h1>Welcome to Stack Overflow</h1>
      <button onClick={() => setIsRegister(true)}>Register</button>
      <button onClick={() => setIsRegister(false)}>Sign In</button>
      {isRegister ? <Register /> : <Login />}
    </div>
  );
};

export default HomePage;
