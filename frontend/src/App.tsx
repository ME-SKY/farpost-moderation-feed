import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css';
//@ts-ignore
import { type ModeratorsDecision, type Post } from '../../types';
import Posts from './components/posts'
import Actions from './components/actions'
import ReasonModal from './components/reason-modal';
import { useAppProvider } from './providers';
import { getDecisionFromEvent } from './helpers';

function App() {
  const { posts, selectedPost, setSelectedPost, loadPosts, sendDecisions, setPosts } = useAppProvider();

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
    event.preventDefault();

    if (reasonModalRef?.current?.isVisible) {
      return;
    }

    const selectedPostIndex = postsRef.current.findIndex((post) => post.id === selectedPostRef.current);
    const decisionText = getDecisionFromEvent(event);

    if (selectedPostIndex >= 0 && decisionText !== null) {
      const previousDecision = decisions.current.get(postsRef.current[selectedPostIndex].id);

      const decisionToSet = {
        decision: decisionText as ModeratorsDecision['decision'],
        reason: previousDecision?.reason ?? ''
      }

      postsRef.current[selectedPostIndex].moderatorsDecision = decisionToSet;
      setPosts([...postsRef.current]);
      decisions.current.set(selectedPostRef.current, decisionToSet);

      if (['decline', 'escalate'].includes(decisionText)) {
        document.removeEventListener('keydown', keydownF7Handler);
        reasonModalRef.current && reasonModalRef.current.showModal(decisionToSet.reason);
      } else {
        setSelectedPost(postsRef.current[selectedPostIndex + 1]?.id ?? null);
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
