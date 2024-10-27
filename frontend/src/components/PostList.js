// src/components/PostList.js
import React from 'react';

const PostList = ({ posts }) => (
  <div>
    <h2>Recent Posts</h2>
    {posts.map(post => (
      <div key={post._id}>
        <h3>{post.title}</h3>
        
        {/* Conditionally render Language only if it has a valid, non-empty value */}
        {post.language && post.language.trim() !== '' && (
          <p>Language: {post.language}</p>
        )}
        
        {/* Display code snippet if available */}
        {post.codeSnippet && <pre>{post.codeSnippet}</pre>}
      </div>
    ))}
  </div>
);

export default PostList;
