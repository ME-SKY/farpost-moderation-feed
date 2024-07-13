import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css';
//@ts-ignore
import { type ModeratorsDecision, type Post } from '../../types';
import Posts from './components/posts'
import Actions from './components/actions'
import ReasonModal from './components/reason-modal';
import { useAppProvider } from './providers';

function App() {
  const { posts, selectedPost, setSelectedPost, loadPosts, sendDecisions, setPosts } = useAppProvider();

  //TODO: can i avoid to using a lot of refs here?
  const decisions = useRef(new Map());
  const reasonModalRef = useRef<{
    showModal: (valueToSet: string) => void;
    hideModal: () => void;
    isVisible: boolean;
  }>();
  const postsRef = useRef(posts);
  const selectedPostRef = useRef(selectedPost);
  const f7ButtonPressedAlready = useRef(false);

  const keydownF7Handler = useCallback((event: KeyboardEvent) => {
    event.preventDefault();

    if (event.key === 'F7' && decisions.current.size === postsRef.current.length && !f7ButtonPressedAlready.current) {
      f7ButtonPressedAlready.current = true;
      saveDecisions();
      decisions.current.clear();
    }
  }, []);

  function setCurrentDecision(value: string) {
    if (value) {
      const currentDecision = decisions.current.get(selectedPostRef.current);

      if (currentDecision.decision !== 'approve') {
        document.addEventListener('keydown', keydownF7Handler);
      }
      currentDecision.reason = value;
      decisions.current.set(selectedPost, currentDecision)
    }

    const selectedPostIndex = postsRef.current.findIndex((post) => post.id === selectedPostRef.current);
    setSelectedPost(postsRef.current[selectedPostIndex + 1]?.id ?? null);
  }

  const saveDecisions = () => {
    const arrayOfDecisions = Array.from(decisions.current.entries()).map(([id, moderatorsDecision]) => ({ id, moderatorsDecision }));

    sendDecisions(arrayOfDecisions).then((res: Response) => {
      if (res.ok) {
        decisions.current.clear();
        postsRef.current = [];
        selectedPostRef.current = null;
      }
    }).then(() => {
      loadPosts();
    });
  }

  const handleKey = (event: KeyboardEvent) => {
    f7ButtonPressedAlready.current = false;

    if (reasonModalRef?.current?.isVisible) {
      return;
    }

    event.preventDefault();

    const selectedPostIndex = postsRef.current.findIndex((post) => post.id === selectedPostRef.current);

    if (event.shiftKey && event.code === 'Enter') {
      if (selectedPostIndex >= 0) {
        postsRef.current[selectedPostIndex].moderatorsDecision = { decision: 'escalate' };
        setPosts([...postsRef.current]);

        decisions.current.set(selectedPostRef.current, { decision: 'escalate' });

        document.removeEventListener('keydown', keydownF7Handler);
        //TODO: how to fix this: Property 'showModal' does not exist on type 'never'.ts(2339)
        reasonModalRef?.current?.showModal();
      }
    }

    if (event.code === 'Space') {
      if (selectedPostIndex >= 0) {
        postsRef.current[selectedPostIndex].moderatorsDecision = { decision: 'approve' };
        setPosts([...postsRef.current]);
        decisions.current.set(selectedPostRef.current, { decision: 'approve' });
        setSelectedPost(postsRef.current[selectedPostIndex + 1]?.id ?? null);
      }
    }

    //TODO: can i simplify this condition?
    if ((event.code === 'Delete' || event.code === 'Backspace' || event.code === 'Del') && !event.shiftKey) {
      console.log('event', event);
      if (selectedPostIndex >= 0) {
        postsRef.current[selectedPostIndex].moderatorsDecision = { decision: 'decline' };
        setPosts([...postsRef.current]);

        decisions.current.set(selectedPostRef.current, { decision: 'decline' });

        document.removeEventListener('keydown', keydownF7Handler);
        //TODO: how to fix this: Property 'showModal' does not exist on type 'never'.ts(2339)
        reasonModalRef.current && reasonModalRef.current.showModal();
      }
    }

    if (event.code === 'Enter' && !postsRef.current.length) {
      loadPosts();
    }
  };

  useEffect(() => {

    const preventScrollingOnSpace = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !reasonModalRef?.current?.isVisible) {
        event.preventDefault();
      }
    }

    document.addEventListener('keydown', preventScrollingOnSpace);
    document.addEventListener('keyup', handleKey);
    document.addEventListener('keydown', keydownF7Handler);

    return () => {
      document.removeEventListener('keyup', handleKey);
      document.removeEventListener('keydown', keydownF7Handler);
      document.removeEventListener('keydown', preventScrollingOnSpace);
    };
  }, []);

  useEffect(() => {
    postsRef.current = posts;
    selectedPostRef.current = selectedPost;
  }, [posts, selectedPost]);

  return (
    <div className="App">
      {posts.length ?
        <Posts items={posts} selectedPost={selectedPost} selectPost={setSelectedPost} /> :
        <div className='initial-text'> <h3>Чтобы загрузить посты нажмите кнопку Enter</h3></div>}
      <Actions />
      <ReasonModal ref={reasonModalRef} onClose={setCurrentDecision} />
    </div>
  )
}

export default App
