import { atom } from 'jotai';
// import { atomWithQuery } from 'jotai-tanstack-query'; // No longer needed
// import { getAllUsers } from '~/lib/firestore_utils'; // No longer needed

export type User = {
  uid: string;
  name: string;
  nickname: string;
  email: string;
  course: Course;
  grade: Grade;
  exp: number;
  authority: Authority;
  contentStatus: Set<string>;
};

export type Authority = 'admin' | 'instructor' | 'user';

export type Grade = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export type Course = 'Beginner' | 'Intermediate' | 'Advanced';

export const authLoadingAtom = atom(true);
export const currentUserAtom = atom<User | null>(null);

// usersAtom will now be a regular Jotai atom, initialized to null
export const usersAtom = atom<User[] | null>(null);
