import { atom } from "jotai";

export type User = {
  uid: string;
  name: string;
  nickname: string;
  email: string;
  course: Course;
  grade: Grade;
  exp: number;
  authority: Authority;
  contentStatus: {
    course: string;
    isComplete: boolean;
  }[];
};

export type Authority = "admin" | "instructor" | "user";

export type Grade = "Bronze" | "Silver" | "Gold" | "Platinum";

export type Course = "Beginner" | "Intermediate" | "Advanced";

export const authLoadingAtom = atom(true);
export const currentUserAtom = atom<User | null>(null);
