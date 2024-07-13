import React, { useEffect, useRef } from 'react'
import { type Post as TPost } from '../../../../types';
import Post from '../post';
import './posts.css'

function Posts({items, selectedPost, selectPost}: {items: TPost[], selectedPost: number | null, selectPost: (id: number) => void}) {

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedPost !== null && containerRef.current) {
      const selectedElement = containerRef.current.querySelector(`[data-id='${selectedPost}']`);
      const selectedPostIndex = items.findIndex((post) => post.id === selectedPost);
      
      if (selectedElement) {
        if (selectedPostIndex === 0) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          selectedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
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