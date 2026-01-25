import { atom } from "jotai";
import { nanoid } from "nanoid";

export type PostType = {
  id: string;
  title: string;
  content: string;
  projectLink?: string;
  imageUrl?: string;
  like: number;
  name: string;
  createdAt: Date;
};

export const postAtom = atom([
  {
    id: nanoid(),
    title: "React Todo 앱",
    content:
      "이번에 만든 React 기반 Todo 앱입니다. 상태 관리와 컴포넌트 구조 연습용 프로젝트!",
    projectLink: "https://github.com/user/react-todo",
    imageUrl:
      "https://img.freepik.com/free-photo/summer-picnic-with-fruits-food-wine_23-2151992916.jpg?size=338&ext=jpg",
    like: 9999,
    name: "Anonymous",
    createdAt: new Date(2026, 0, 15),
  },
  {
    id: nanoid(),
    title: "Tailwind Portfolio 사이트",
    content:
      "TailwindCSS와 Shadcn 컴포넌트를 활용해 만든 개인 포트폴리오 사이트입니다.",
    projectLink: "https://user.github.io/portfolio",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Portfolio",
    like: 12,
    name: "Anonymous",
    createdAt: new Date(),
  },
  {
    id: nanoid(),
    title: "Vanilla JS 게임",
    content:
      "순수 JavaScript만 사용해서 만든 간단한 브라우저 게임 프로젝트입니다. 🎮",
    projectLink: "https://github.com/user/js-game",
    imageUrl: "https://via.placeholder.com/300x150.png?text=JS+Game",
    like: 0,
    name: "Anonymous",
    createdAt: new Date(),
  },
]);
