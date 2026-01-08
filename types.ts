
export type Category = 'Home & DIY' | 'Travel & Culture' | 'Career & Finance' | 'Personal Growth';

export interface RealityCheck {
  expectation: string;
  reality: string;
}

export interface Comment {
  id: string;
  author: string;
  authorId?: string;
  text: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string;
  joinedAt: string;
}

export interface Post {
  id: string;
  title: string;
  author: string;
  authorId?: string;
  category: Category;
  difficulty: number; // 1 to 5
  content: string;
  tips: string[];
  realityChecks: RealityCheck[];
  imageUrl: string;
  createdAt: string;
  comments: Comment[];
  isFeatured?: boolean;
}

export interface NewPost {
  title: string;
  author: string;
  category: Category;
  difficulty: number;
  content: string;
  tips: string[];
  realityChecks: RealityCheck[];
  imageFile?: File;
}
