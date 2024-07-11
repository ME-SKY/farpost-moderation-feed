import express from 'express';
import { json } from 'body-parser';
import { promises as fs } from 'fs';
import path from 'path';
import { Post } from '../../types';

async function loadPosts(): Promise<Post[]> {
  const filePath = path.join(__dirname, '../posts.json');
  const data = await fs.readFile(filePath, 'utf-8');
  const posts: Post[] = JSON.parse(data);
  return posts;
}

async function startServer() {
  const app = express();
  const port = 3000;

  app.use(json());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // Load posts before starting the server
  let posts: Post[] = [];
  try {
    posts = await loadPosts();
    console.log('Posts loaded successfully');
  } catch (error) {
    console.error('Failed to load posts:', error);
    process.exit(1); // Exit the process if loading posts fails
  }

  app.get('/posts', (req, res) => {
    const postsWithoutModeration = posts.filter(post => !post.moderatorsDecision).slice(0, 10);
    res.json(postsWithoutModeration);
  });

  app.post('/posts', (req, res) => {
    const decisions = req.body;

    if (decisions.length) {
      for (const { id, moderatorsDecision } of decisions) {
        const postIndex = posts.findIndex(post => post.id === id);
        posts[postIndex].moderatorsDecision = moderatorsDecision;
      }
    }

    res.sendStatus(200);
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer();
