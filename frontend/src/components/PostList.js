// src/components/PostList.js
import React, { useState } from 'react';
import API from '../api';
import PostDetailsModal from './PostDetailsModal';

const PostList = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  const handleViewPost = async (post) => {
    try {
      const { data } = await API.get(`/posts/${post._id}`);
      setSelectedPost(data);
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  return (
    <div>
      <h2>Recent Posts</h2>
      {posts.map(post => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          <p>Posted by: {post.author?.username || "Anonymous"}</p>
          <button onClick={() => handleViewPost(post)}>View Post</button>
        </div>
      ))}
      {selectedPost && (
        <PostDetailsModal
          post={selectedPost.post}
          codeContent={selectedPost.codeContent}
          fileContent={selectedPost.uploadedFileContent}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default PostList;
