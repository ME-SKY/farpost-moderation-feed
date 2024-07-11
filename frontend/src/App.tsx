import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Post } from '../../types'
import Posts from './components/posts'
import Actions from './components/actions'

const API = {
  getPosts: async () => {
    const response = await fetch('http://localhost:3000/posts')
    const data = await response.json()
    return data;
  },
  postPosts: async (posts: Post[]) => {
    const response = await fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(posts),
    })
    const data = await response.json()
    return data
  },
}

function App() {
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  useEffect(() => {
    API.getPosts().then((postsData) => {
      setPosts(postsData);
    })
  }, [])




  return (
    <div className="App">
      <Posts items={posts}/>
      <Actions/>
    </div>
  )
}

export default App
