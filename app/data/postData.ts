import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { getPosts } from "./postApi";
import { currentUserAtom, type User } from "./userData";
import { refetchAtom } from "./commonData";

export type PostType = {
  id: string;
  title: string;
  content: string;
  projectLink?: string;
  imageUrl: string | null;
  likeCount: number;
  name: string;
  createdAt: Date;
  isLiked?: boolean;
  userId?: string;
};

export type PostOrderType = "new" | "popular";

export const postOrderAtom = atom<PostOrderType>("new");

export const MAX_FILE_SIZE = 0.5 * 1024 * 1024; // 0.5MB

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const postsAtom = atomWithQuery((get) => ({
  queryKey: [
    "posts",
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
