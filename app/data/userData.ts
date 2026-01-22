export type Grade = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
export type Authority = 'user' | 'operator' | 'admin';
export type Course = 'beginner' | 'intermediate' | 'advanced';

export type User = {
  id: number;
  name: string;
  nickname: string;
  email: string;
  course: Course;
  grade: Grade;
  authority: Authority;
  exp: number;
};

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Ryan Lee',
    nickname: 'ryan_dev',
    email: 'ryan@example.com',
    course: 'beginner',
    grade: 'Gold',
    authority: 'admin',
    exp: 12450,
  },
  {
    id: 2,
    name: 'Jane Kim',
    nickname: 'jane_k',
    email: 'jane@example.com',
    course: 'intermediate',
    grade: 'Silver',
    authority: 'operator',
    exp: 5230,
  },
  {
    id: 3,
    name: 'Tom Park',
    nickname: 'tommy',
    email: 'tom@example.com',
    course: 'advanced',
    grade: 'Bronze',
    authority: 'user',
    exp: 1200,
  },
];
