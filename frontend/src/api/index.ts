import {type ModeratorsDecision} from "../../../types";

export const API = {
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