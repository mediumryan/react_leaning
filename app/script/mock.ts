// seedFirestore.ts
import { collection, doc, writeBatch, Timestamp } from "firebase/firestore";
import { firestore } from "~/lib/firebase";

const mockPosts = [
  {
    id: "post-1",
    title: "Next.js 블로그 플랫폼",
    content: "Next.js App Router와 MDX를 활용해 만든 개인 블로그 플랫폼입니다.",
    projectLink: "https://github.com/user/next-blog",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Next+Blog",
    like: 321,
    name: "Anonymous",
    createdAt: new Date(2026, 0, 10),
    likedUsers: ["user1", "user2", "user3"],
  },
  {
    id: "post-2",
    title: "Firebase 인증 예제",
    content: "Firebase Auth를 활용한 로그인/회원가입 예제 프로젝트입니다.",
    projectLink: "https://github.com/user/firebase-auth",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Firebase+Auth",
    like: 87,
    name: "Anonymous",
    createdAt: new Date(2026, 0, 25),
    likedUsers: ["user4", "user5", "user6"],
  },
  {
    id: "post-3",
    title: "Redux 상태관리 연습",
    content: "Redux Toolkit을 사용해 상태 관리를 연습한 미니 프로젝트입니다.",
    projectLink: "https://github.com/user/redux-practice",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Redux",
    like: 45,
    name: "Anonymous",
    createdAt: new Date(2026, 1, 1),
  },
  {
    id: "post-4",
    title: "Weather 앱",
    content: "OpenWeather API를 이용한 날씨 조회 웹 애플리케이션입니다.",
    projectLink: "https://github.com/user/weather-app",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Weather",
    like: 203,
    name: "Anonymous",
    createdAt: new Date(2026, 1, 5),
  },
  {
    id: "post-5",
    title: "Chat UI 디자인",
    content: "메신저 앱을 참고해 만든 채팅 UI 디자인 연습 프로젝트입니다.",
    projectLink: "https://github.com/user/chat-ui",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Chat+UI",
    like: 66,
    name: "Anonymous",
    createdAt: new Date(2026, 1, 12),
  },
  {
    id: "post-6",
    title: "Express REST API",
    content: "Node.js와 Express로 구현한 REST API 서버입니다.",
    projectLink: "https://github.com/user/express-api",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Express+API",
    like: 150,
    name: "Anonymous",
    createdAt: new Date(2026, 1, 18),
  },
  {
    id: "post-7",
    title: "MongoDB CRUD 예제",
    content: "MongoDB Atlas와 연동한 CRUD 예제 프로젝트입니다.",
    projectLink: "https://github.com/user/mongodb-crud",
    imageUrl: "https://via.placeholder.com/300x150.png?text=MongoDB",
    like: 98,
    name: "Anonymous",
    createdAt: new Date(2026, 1, 22),
  },
  {
    id: "post-8",
    title: "Calendar 앱",
    content: "일정 추가/삭제가 가능한 캘린더 웹 앱입니다.",
    projectLink: "https://github.com/user/calendar-app",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Calendar",
    like: 41,
    name: "Anonymous",
    createdAt: new Date(2026, 2, 1),
  },
  {
    id: "post-9",
    title: "CSS 애니메이션 모음",
    content: "CSS keyframes와 transition을 활용한 애니메이션 모음입니다.",
    projectLink: "https://github.com/user/css-animation",
    imageUrl: "https://via.placeholder.com/300x150.png?text=CSS+Animation",
    like: 77,
    name: "Anonymous",
    createdAt: new Date(2026, 2, 3),
  },
  {
    id: "post-10",
    title: "Responsive 랜딩 페이지",
    content: "모바일/태블릿/데스크톱 대응 반응형 랜딩 페이지입니다.",
    projectLink: "https://github.com/user/responsive-landing",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Landing+Page",
    like: 134,
    name: "Anonymous",
    createdAt: new Date(2026, 2, 6),
  },
  {
    id: "post-11",
    title: "React Chart 대시보드",
    content: "Chart.js를 활용한 데이터 시각화 대시보드입니다.",
    projectLink: "https://github.com/user/react-dashboard",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Dashboard",
    like: 256,
    name: "Anonymous",
    createdAt: new Date(2026, 2, 10),
  },
  {
    id: "post-12",
    title: "Infinite Scroll 구현",
    content: "Intersection Observer를 사용한 무한 스크롤 예제입니다.",
    projectLink: "https://github.com/user/infinite-scroll",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Infinite+Scroll",
    like: 59,
    name: "Anonymous",
    createdAt: new Date(2026, 2, 12),
  },
  {
    id: "post-13",
    title: "Form Validation 예제",
    content: "React Hook Form으로 구현한 폼 검증 예제입니다.",
    projectLink: "https://github.com/user/form-validation",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Form",
    like: 83,
    name: "Anonymous",
    createdAt: new Date(2026, 2, 14),
  },
  {
    id: "post-14",
    title: "Dark Mode 토글",
    content: "CSS 변수와 localStorage를 활용한 다크모드 구현입니다.",
    projectLink: "https://github.com/user/dark-mode",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Dark+Mode",
    like: 190,
    name: "Anonymous",
    createdAt: new Date(2026, 2, 16),
  },
  {
    id: "post-15",
    title: "검색 자동완성 기능",
    content: "디바운싱을 적용한 검색 자동완성 기능 구현 예제입니다.",
    projectLink: "https://github.com/user/search-autocomplete",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Search",
    like: 71,
    name: "Anonymous",
    createdAt: new Date(2026, 2, 18),
  },
  {
    id: "post-16",
    title: "Drag & Drop 리스트",
    content: "드래그 앤 드롭으로 순서를 변경할 수 있는 리스트입니다.",
    projectLink: "https://github.com/user/drag-drop",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Drag+Drop",
    like: 112,
    name: "Anonymous",
    createdAt: new Date(2026, 2, 20),
  },
  {
    id: "post-17",
    title: "Image Gallery",
    content: "그리드 레이아웃 기반 이미지 갤러리 프로젝트입니다.",
    projectLink: "https://github.com/user/image-gallery",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Gallery",
    like: 64,
    name: "Anonymous",
    createdAt: new Date(2026, 2, 22),
  },
  {
    id: "post-18",
    title: "Markdown 에디터",
    content: "마크다운 실시간 프리뷰를 지원하는 에디터입니다.",
    projectLink: "https://github.com/user/markdown-editor",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Markdown",
    like: 175,
    name: "Anonymous",
    createdAt: new Date(2026, 2, 24),
  },
  {
    id: "post-19",
    title: "E-commerce UI",
    content: "상품 목록과 장바구니 UI를 구현한 쇼핑몰 예제입니다.",
    projectLink: "https://github.com/user/ecommerce-ui",
    imageUrl: "https://via.placeholder.com/300x150.png?text=E-commerce",
    like: 222,
    name: "Anonymous",
    createdAt: new Date(2026, 2, 26),
  },
  {
    id: "post-20",
    title: "알고리즘 시각화",
    content: "정렬 알고리즘 동작을 시각화한 학습용 프로젝트입니다.",
    projectLink: "https://github.com/user/algorithm-visualizer",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Algorithm",
    like: 301,
    name: "Anonymous",
    createdAt: new Date(2026, 2, 28),
  },
];

const USER_POOL = Array.from({ length: 120 }, (_, i) => `user${i + 1}`);

function generateLikedUsers(likeCount: number, presetUsers: string[] = []) {
  const set = new Set(presetUsers);

  while (set.size < Math.min(likeCount, USER_POOL.length)) {
    const randomUser = USER_POOL[Math.floor(Math.random() * USER_POOL.length)];
    set.add(randomUser);
  }

  return Array.from(set);
}

export async function seedFirestore() {
  const batch = writeBatch(firestore);

  for (const post of mockPosts) {
    const postRef = doc(collection(firestore, "posts"), post.id);

    const likedUsers = generateLikedUsers(post.like, post.likedUsers ?? []);

    batch.set(postRef, {
      title: post.title,
      content: post.content,
      projectLink: post.projectLink ?? null,
      imageUrl: post.imageUrl ?? null,
      likeCount: likedUsers.length,
      name: post.name,
      createdAt: Timestamp.fromDate(post.createdAt),
    });

    likedUsers.forEach((uid) => {
      const likeRef = doc(collection(postRef, "likes"), uid);
      batch.set(likeRef, {
        createdAt: Timestamp.now(),
      });
    });
  }

  await batch.commit();
  console.log("✅ Firestore seed 완료");
}

// ⬇️ 파일 맨 마지막에 추가
seedFirestore()
  .then(() => {
    console.log("🎉 seed script finished");
  })
  .catch((err) => {
    console.error("❌ seed script failed", err);
  });
