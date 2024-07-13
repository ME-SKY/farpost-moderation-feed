import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { type ModeratorsDecision, type Post as TPost } from "../../../types";
import { API as PostsApi } from "../api";

const AppProviderContext = createContext<{
  posts: TPost[],
  selectedPost: number | null,
  setSelectedPost: (id: number) => void,
  setPosts: (posts: TPost[]) => void,
  loadPosts: () => void,
  sendDecisions: any
}>({
  posts: [],
  selectedPost: null,
  setSelectedPost: () => {},
  setPosts: () => {},
  loadPosts: () => {},
  sendDecisions: () => {}
});

const sendDecisions = (decisions: { id: number, moderatorsDecision: ModeratorsDecision }[]) => {
  return PostsApi.postDecisions(decisions);
}

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  const loadPosts = useCallback(() => {
    PostsApi.getPosts().then((postsData) => {
      if (postsData.length !== 0) {
        setPosts(postsData);
        setSelectedPost(postsData[0].id);
      } else {
        setPosts([]);
        setSelectedPost(null);
      }  
    }).catch((error) => {
      console.error('error', error);
    })
  },[]);

  return (
    <AppProviderContext.Provider value={{posts, setPosts, selectedPost, setSelectedPost, loadPosts, sendDecisions}}>
      {children}
    </AppProviderContext.Provider>
  );
};

export default AppProvider;

export const useAppProvider = () => useContext(AppProviderContext);