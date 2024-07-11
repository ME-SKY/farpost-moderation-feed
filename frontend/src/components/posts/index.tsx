import React from 'react'
import { type Post as TPost } from '../../../../types';
import Post from '../post';
import './posts.css'

function Posts({items}: {items: TPost[]}) {
  return (
    <div className="posts">
        {
          items.map((post) => <Post key={post.id} post={post}/>)
        }
      </div>
  )
}

export default Posts