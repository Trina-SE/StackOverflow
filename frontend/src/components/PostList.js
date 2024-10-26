import React from 'react';

const PostList = ({ posts }) => (
  <div>
    <h2>Recent Posts</h2>
    {posts.map(post => (
      <div key={post._id}>
        <h3>{post.title}</h3>
        <p>Language: {post.language}</p>
        <pre>{post.codeSnippet}</pre>
      </div>
    ))}
  </div>
);

export default PostList;
