import { atom } from 'jotai';
import { getPosts } from './postApi';

export type PostType = {
  id: string;
  title: string;
  content: string;
  projectLink?: string;
  imageUrl?: string;
  like: number;
  name: string;
  createdAt: Date;
  likedUsers: string[];
};

export const refetchAtom = atom(0);

export const postsAtom = atom(async (get) => {
  get(refetchAtom);
  const posts = await getPosts();
  return posts;
});
