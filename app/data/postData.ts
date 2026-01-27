import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
import { getPosts } from './postApi';
import { currentUserAtom, type User } from './userData';

export type PostType = {
  id: string;
  title: string;
  content: string;
  projectLink?: string;
  imageUrl?: string;
  like: number;
  name: string;
  createdAt: Date;
  isLiked?: boolean;
};

export type PostOrderType = 'new' | 'popular';

export const refetchAtom = atom(0);
export const postOrderAtom = atom<PostOrderType>('new');

export const postsAtom = atomWithQuery((get) => ({
  queryKey: [
    'posts',
    get(postOrderAtom),
    get(refetchAtom),
    get(currentUserAtom),
  ],
  queryFn: async ({ queryKey }) => {
    const [, postOrder, , currentUser] = queryKey as [
      string,
      PostOrderType,
      number,
      User | null,
    ];
    const posts = await getPosts(currentUser?.uid, postOrder);
    return posts;
  },
}));
