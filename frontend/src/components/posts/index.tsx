import React, { useEffect, useRef } from 'react'
import { type Post as TPost } from '../../../../types';
import Post from '../post';
import './posts.css'

function Posts({items, selectedPost, selectPost}: {items: TPost[], selectedPost: number | null, selectPost: (id: number) => void}) {

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedPost !== null && containerRef.current) {
      console.log('haha')
      const selectedElement = containerRef.current.querySelector(`[data-id='${selectedPost}']`);
      if (selectedElement) {
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const elementTop = selectedElement.getBoundingClientRect().top;
        console.log('containerTop', containerTop, 'elementTop', elementTop)
        const offset = elementTop - containerTop - 20;

        const scrollValue = containerRef.current.scrollTop + offset;
        console.log('scrollValue', scrollValue);


        
        // containerRef.current.scrollTo({
        //   top: 20,
        //   behavior: 'smooth',
        // });
        // console.log('should scroll')
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        // containerRef.current.scrollTop -= 20;
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