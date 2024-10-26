import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                const userRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/user`, config);
                setUser(userRes.data);
                const postRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/posts/recent`, config);
                setPosts(postRes.data);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Welcome, {user.username}</h2>
            <h3>Your Posts:</h3>
            <ul>
                {posts.map((post) => (
                    <li key={post._id}>
                        {post.title} - {post.language}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
