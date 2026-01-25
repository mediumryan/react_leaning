import { atom } from 'jotai';

export type User = {
  uid: string;
  name: string;
  nickname: string;
  email: string;
  course: string;
  grade: string;
  exp: number;
  authority: string;
  contentStatus: {
    course: string;
    isComplete: boolean;
  }[];
};

export type Course = 'Beginner' | 'Intermediate' | 'Advanced';

export const currentUserAtom = atom<User | null>(null);
