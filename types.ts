export type Post = {
  id: number;
  publishDate: number;
  publishDateString: string;
  ownerId: number;
  ownerLogin: string;
  bulletinSubject: string;
  bulletinText: string;
  bulletinImages?: string[];
  moderatorsDecision?: {
    decision: 'approve' | 'decline' | 'escalate';
    reason?: string;
  };
};