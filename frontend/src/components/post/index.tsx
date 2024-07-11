import React from 'react'
import { type Post } from '../../../../types';
import './post.css'

function Post({post}: {post: Post}) {
  return (
    <div className="post">
      <div className="info">
        <div className="id-and-time">
          <a className="post-id">{post.id}</a>
          —
          <h4 className="time">{post.publishDateString}</h4>
        </div>
        <div className="user-name"><img src="/login-icon.svg" alt="login-icon" /><a>{post.ownerLogin}</a></div>
      </div>
      <div className="content">
        <h3 className="title">{post.bulletinSubject}</h3>
        <p className="description">{post.bulletinText}</p>
        <div className="images">{
          post.bulletinImages?.map((image, index) => <img key={index} alt='some image' src={image} />)
        }</div>
      </div>
    </div>
  )
}

export default Post