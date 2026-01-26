import {
  collection,
  getDocs,
  orderBy,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { firestore } from '~/lib/firebase';
import type { PostType } from './postData';

export const getPosts = async (): Promise<PostType[]> => {
  const postsCollection = collection(firestore, 'posts');
  const q = query(postsCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const posts: PostType[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    posts.push({
      id: doc.id,
      title: data.title,
      content: data.content,
      projectLink: data.projectLink,
      imageUrl: data.imageUrl,
      like: data.like,
      name: data.name,
      createdAt: data.createdAt.toDate(),
      likedUsers: data.likedUsers,
    });
  });
  return posts;
};

export const addPost = async (
  post: Omit<PostType, 'id' | 'createdAt' | 'like' | 'likedUsers'>,
) => {
  const newPost = {
    ...post,
    createdAt: new Date(),
    like: 0,
    likedUsers: [],
  };
  const docRef = await addDoc(collection(firestore, 'posts'), newPost);
  return { ...newPost, id: docRef.id };
};

export const updatePost = async (
  id: string,
  post: Partial<Omit<PostType, 'id'>>,
) => {
  const postRef = doc(firestore, 'posts', id);
  await updateDoc(postRef, post);
};

export const deletePost = async (id: string) => {
  const postRef = doc(firestore, 'posts', id);
  await deleteDoc(postRef);
};
