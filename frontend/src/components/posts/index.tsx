import React, { useEffect, useRef } from 'react'
import { type Post as TPost } from '../../../../types';
import Post from '../post';
import './posts.css'

function Posts({items, selectedPost, selectPost}: {items: TPost[], selectedPost: number | null, selectPost: (id: number) => void}) {

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedPost !== null && containerRef.current) {
      const selectedElement = containerRef.current.querySelector(`[data-id='${selectedPost}']`);
      
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedPost]);


  return (
    <div className="posts" ref={containerRef}>
        {
          items.map((post) => <Post key={post.id} post={post} selected={selectedPost === post.id} selectPost={selectPost}/>)
        }
      </div>
  )
}

export default Posts