import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome</h1>
            <Link to="/register">
                <button>Register</button>
            </Link>
            <Link to="/signin">
                <button>Sign In</button>
            </Link>
        </div>
    );
};

export default HomePage;
