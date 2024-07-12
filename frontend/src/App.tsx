import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css';
//@ts-ignore
import { type ModeratorsDecision, type Post } from '../../types';
import Posts from './components/posts'
import Actions from './components/actions'
import ReasonModal from './components/reason-modal';

const API = {
  getPosts: async () => {
    const response = await fetch('http://localhost:3000/posts')
    const data = await response.json()
    return data;
  },
  postDecisions: async (decisions: { id: number, moderatorsDecision: ModeratorsDecision }[]) => {
    const response = await fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(decisions),
    })
    const data = await response.json();
    return data;
  },
}

function App() {
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  // let decisions =

  // const decisions
  const decisions = useRef(new Map());
  const reasonModalRef = useRef();
  const postsRef = useRef(posts);
  const selectedPostRef = useRef(selectedPost);

  function setCurrentDecision(value: string) {
    if (value) {
      const currentDecision = decisions.current.get(selectedPostRef.current);
      currentDecision.reason = value;
      decisions.current.set(selectedPost, currentDecision)
    }

    console.log('decisions', decisions.current);
  }

  const approveAction = (id: number) => {
    decisions.current.set(id, { decision: 'approve' });
  }

  const declineAction = () => {
    //@ts-ignore
    reasonModalRef?.current?.showModal();
    decisions.current.set(selectedPost, { decision: 'decline' });
  }

  const escalateAction = (id: number) => {

  }

  const saveDecisions = () => {
    //TODO: fix it
    API.postDecisions(decisions.current).then((data) => {
      console.log(data)
    })
  }

  const handleKey = (event: KeyboardEvent) => {

    // @ts-ignore
    if(reasonModalRef?.current?.isVisible) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    console.log('it works!', event);
    const selectedPostIndex = postsRef.current.findIndex((post) => post.id === selectedPostRef.current);
    // Check if Shift+Enter is pressed
    if (event.shiftKey && event.code === 'Enter') {
      reasonModalRef?.current?.showModal();
      decisions.current.set(selectedPostRef.current, { decision: 'decline' });
      // Prevent the default behavior if needed
      // Execute your desired action here
      console.log('Shift+Enter was pressed!');
    }

    if (event.code === 'Space') {
      event.preventDefault();
      console.log('here')
      if (selectedPostIndex >= 0) {
        console.log('will change')
        postsRef.current[selectedPostIndex].moderatorsDecision = { decision: 'approve' };
        setPosts([...postsRef.current]);
        decisions.current.set(selectedPostRef.current, { decision: 'approve' });
        setSelectedPost(postsRef.current[selectedPostIndex + 1]?.id ?? null);
      }
    }

    if (event.key === 'Delete') {
      declineAction();
    }



  };



  useEffect(() => {

    // const handleKey = (event: KeyboardEvent) => {
    //   console.log('it works!', event);
    //   const selectedPostIndex = posts.findIndex((post) => post.id === selectedPost);
    //   // Check if Shift+Enter is pressed
    //   if (event.shiftKey && event.key === 'Enter') {
    //     // Prevent the default behavior if needed
    //     // Execute your desired action here
    //     console.log('Shift+Enter was pressed!');
    //   }

    //   if (event.code === 'Space') {
    //     event.preventDefault();
    //     console.log('here')
    //     if (selectedPostIndex >= 0) {
    //       console.log('will change')
    //       posts[selectedPostIndex].moderatorsDecision = {decision: 'approve'};
    //       setPosts([...posts]);
    //       decisions.current.set(selectedPost, {decision: 'approve'});
    //       setSelectedPost(posts[selectedPostIndex + 1]?.id ?? null);
    //     }
    //   }

    //   if (event.key === 'Delete') {
    //     declineAction();
    //   }



    // };

    document.addEventListener('keyup', handleKey);

    API.getPosts().then((postsData) => {
      setPosts(postsData);
      setSelectedPost(postsData[0].id);
    })

    // return () => {
    //   document.removeEventListener('keyup', handleKey);
    // };
  }, []);

  useEffect(() => {
    postsRef.current = posts;
    selectedPostRef.current = selectedPost;
  }, [posts, selectedPost]);


  useEffect(() => {
    const preventScrolling = (event: KeyboardEvent) => {
      if(event.code === 'Space' && !reasonModalRef?.current?.isVisible) {
        event.preventDefault();
    }  
    }
    document.addEventListener('keydown', preventScrolling);

    return () => {
      document.removeEventListener('keydown', preventScrolling);
    }
  }, [])


  return (
    <div className="App">
      <Posts items={posts} selectedPost={selectedPost} selectPost={setSelectedPost} />
      <Actions />
      <ReasonModal ref={reasonModalRef} onClose={setCurrentDecision} />
    </div>
  )
}

export default App
