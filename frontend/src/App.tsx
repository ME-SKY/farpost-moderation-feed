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

    return response;
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
  const f7ButtonPressedAlready = useRef(false);

  const keydownF7Handler = useCallback((event: KeyboardEvent) => {
    console.log('keydownF7Handler');
    event.preventDefault();

    if (event.key === 'F7' && decisions.current.size === postsRef.current.length && !f7ButtonPressedAlready.current) {
      // event.preventDefault();
      f7ButtonPressedAlready.current = true;
      saveDecisions();
      decisions.current.clear();
    }
  }, []);

  function setCurrentDecision(value: string) {

    if (value) {
      const currentDecision = decisions.current.get(selectedPostRef.current);

      if (currentDecision.decision !== 'approve') {
        console.log('add keydownF7Handler');
        document.addEventListener('keydown', keydownF7Handler);

      }
      currentDecision.reason = value;
      decisions.current.set(selectedPost, currentDecision)
    }

    const selectedPostIndex = postsRef.current.findIndex((post) => post.id === selectedPostRef.current);
    setSelectedPost(postsRef.current[selectedPostIndex + 1]?.id ?? null);
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
    //@ts-ignore
    reasonModalRef?.current?.showModal();
    decisions.current.set(selectedPost, { decision: 'decline' });
  }

  const saveDecisions = () => {
    const arrayOfDecisions = Array.from(decisions.current.entries()).map(([id, moderatorsDecision]) => ({ id, moderatorsDecision }));
    API.postDecisions(arrayOfDecisions).then((res) => {
      if (res.ok) {
        decisions.current.clear();
        postsRef.current = [];
        selectedPostRef.current = null;
      }

    }).then(() => {
      API.getPosts().then((postsData) => {
        setPosts(postsData);
        setSelectedPost(postsData[0].id);
      })
    })
  }

  const handleKey = (event: KeyboardEvent) => {
    f7ButtonPressedAlready.current = false;

    // @ts-ignore
    if (reasonModalRef?.current?.isVisible) {
      return;
    }
    event.preventDefault();
    // event.stopPropagation();
    console.log('it works!', event);
    const selectedPostIndex = postsRef.current.findIndex((post) => post.id === selectedPostRef.current);
    // Check if Shift+Enter is pressed
    if (event.shiftKey && event.code === 'Enter') {
      if (selectedPostIndex >= 0) {
        console.log('will change');
        postsRef.current[selectedPostIndex].moderatorsDecision = { decision: 'escalate' };
        setPosts([...postsRef.current]);
        decisions.current.set(selectedPostRef.current, { decision: 'escalate' });
        // setSelectedPost(postsRef.current[selectedPostIndex + 1]?.id ?? null);
        console.log('remove keydownF7Handler');
        document.removeEventListener('keydown', keydownF7Handler);
        reasonModalRef?.current?.showModal();
        decisions.current.set(selectedPostRef.current, { decision: 'escalate' });
      }

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

    if ((event.code === 'Delete' || event.code === 'Backspace' || event.code === 'Del') && !event.shiftKey) {
      if (selectedPostIndex >= 0) {
        console.log('will change')
        postsRef.current[selectedPostIndex].moderatorsDecision = { decision: 'decline' };
        setPosts([...postsRef.current]);
        decisions.current.set(selectedPostRef.current, { decision: 'decline' });
        // setSelectedPost(postsRef.current[selectedPostIndex + 1]?.id ?? null);
        console.log('remove keydownF7Handler');
        document.removeEventListener('keydown', keydownF7Handler);
        reasonModalRef?.current?.showModal();
        decisions.current.set(selectedPostRef.current, { decision: 'decline' });
      }
    }

    if (event.code === 'Enter' && !postsRef.current.length) {
      API.getPosts().then((postsData) => {
        setPosts(postsData);
        setSelectedPost(postsData[0].id);
      })
    }

    // if (event.code === 'fn' && decisions.current.size === 10) {
    //   event.preventDefault();
    //   saveDecisions();
    //   decisions.current.clear();
    // }



  };

  const handleKeyUpFn = (event: KeyboardEvent) => {
    if (event.getModifierState('Fn')) {
      console.log('Fn was pressed');
    }
  }



  // const handleKeyUpFn = (event: KeyboardEvent) => {
  //   if (event.getModifierState('Fn')) {
  //     console.log('Fn was pressed');
  //   }
  // }



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
    console.log('add keydownF7Handler');
    document.addEventListener('keydown', keydownF7Handler);



    return () => {
      document.removeEventListener('keyup', handleKey);
      console.log('remove keydownF7Handler');
      document.removeEventListener('keydown', keydownF7Handler);
    };
  }, []);

  useEffect(() => {
    postsRef.current = posts;
    selectedPostRef.current = selectedPost;
  }, [posts, selectedPost]);


  useEffect(() => {
    const preventScrolling = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !reasonModalRef?.current?.isVisible) {
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
      {posts.length ? <Posts items={posts} selectedPost={selectedPost} selectPost={setSelectedPost} /> :
        <div className='initial-text'> <h3>Чтобы загрузить посты нажмите кнопку Enter</h3></div>}
      <Actions />
      <ReasonModal ref={reasonModalRef} onClose={setCurrentDecision} />
    </div>
  )
}

export default App
