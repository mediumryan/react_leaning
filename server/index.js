import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useNavigate, Link, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, Navigate, useParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { atom, getDefaultStore, useAtom, useAtomValue, useSetAtom } from "jotai";
import { getApps, initializeApp, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs, query, orderBy, updateDoc, addDoc, serverTimestamp, deleteDoc, setDoc, writeBatch, Timestamp } from "firebase/firestore";
import { getStorage, ref, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import { House, BookOpen, UsersRound, MessagesSquare, LogOut, Info, TriangleAlert, Ban, LoaderIcon, XIcon, CheckIcon, Plus, Pencil, Trash2, PanelLeftIcon, Check, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, CircleIcon, ArrowUp, PlusIcon, HeartIcon, Search, UserCog } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { atomWithQuery } from "jotai-tanstack-query";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { FaReact } from "react-icons/fa";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import ReactMarkdown from "react-markdown";
import { Prism } from "react-syntax-highlighter";
import nord from "react-syntax-highlighter/dist/cjs/styles/prism/nord.js";
import remarkGfm from "remark-gfm";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const authLoadingAtom = atom(true);
const currentUserAtom = atom(null);
const usersAtom = atom(null);
const firebaseConfig = {
  apiKey: "AIzaSyCY074fG5q10VeGc-s_73uM1Ragklabl9U",
  authDomain: "ryan-react-2ace0.firebaseapp.com",
  projectId: "ryan-react-2ace0",
  storageBucket: "ryan-react-2ace0.firebasestorage.app",
  messagingSenderId: "146016822888",
  appId: "1:146016822888:web:31c9c2a9b5c69723e67ddd",
  measurementId: "G-0T67BPN7XT"
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
typeof window !== "undefined" ? getAnalytics(app) : null;
const getUserProfile = async (uid) => {
  const userDocRef = doc(firestore, "users", uid);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    const contentStatusCollectionRef = collection(userDocRef, "contentStatus");
    const contentStatusSnap = await getDocs(contentStatusCollectionRef);
    const contentStatus = new Set(contentStatusSnap.docs.map((doc2) => doc2.id));
    return {
      uid,
      ...userData,
      contentStatus
      // Overwrite with the Set
    };
  } else {
    console.error("No user profile found in Firestore for UID:", uid);
    return null;
  }
};
const getAllUsers = async () => {
  const usersCollectionRef = collection(firestore, "users");
  const querySnapshot = await getDocs(usersCollectionRef);
  const users2 = [];
  for (const userDoc of querySnapshot.docs) {
    const userData = userDoc.data();
    const uid = userDoc.id;
    const contentStatusCollectionRef = collection(userDoc.ref, "contentStatus");
    const contentStatusSnap = await getDocs(contentStatusCollectionRef);
    const contentStatus = new Set(contentStatusSnap.docs.map((doc2) => doc2.id));
    users2.push({
      uid,
      ...userData,
      contentStatus
    });
  }
  return users2;
};
const addUserToFirestore = async (user) => {
  const userDocRef = doc(firestore, "users", user.uid);
  const { contentStatus, ...userDataToStore } = user;
  await setDoc(userDocRef, userDataToStore);
  const batch = writeBatch(firestore);
  contentStatus.forEach((contentId) => {
    const contentStatusDocRef = doc(userDocRef, "contentStatus", contentId);
    batch.set(contentStatusDocRef, { createdAt: /* @__PURE__ */ new Date() });
  });
  await batch.commit();
};
const updateUserInFirestore = async (uid, updates) => {
  const userDocRef = doc(firestore, "users", uid);
  const { contentStatus, ...updatesToApply } = updates;
  await updateDoc(userDocRef, updatesToApply);
};
const deleteUserFromFirestore = async (uid) => {
  const userDocRef = doc(firestore, "users", uid);
  const contentStatusCollectionRef = collection(userDocRef, "contentStatus");
  const querySnapshot = await getDocs(contentStatusCollectionRef);
  const batch = writeBatch(firestore);
  querySnapshot.docs.forEach((doc2) => {
    batch.delete(doc2.ref);
  });
  await batch.commit();
  await deleteDoc(userDocRef);
};
const updateUserCourse = async (uid, newCourse) => {
  const userDocRef = doc(firestore, "users", uid);
  await updateDoc(userDocRef, {
    course: newCourse
  });
};
const getNotices = async () => {
  try {
    const noticesRef = collection(firestore, "notices");
    const q = query(noticesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc2) => {
      const data = doc2.data();
      return {
        id: doc2.id,
        title: data.title,
        content: data.content,
        createdAt: data.createdAt.toDate(),
        isNew: data.isNew ?? false,
        isImportant: data.isImportant ?? false
      };
    });
  } catch (error) {
    console.error("Failed to fetch notices:", error);
    return [];
  }
};
const addNotice = async (title, content, isNew, isImportant) => {
  try {
    const noticesRef = collection(firestore, "notices");
    await addDoc(noticesRef, {
      title,
      content,
      isNew: isNew ?? true,
      isImportant: isImportant ?? false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to create notice:", error);
    throw error;
  }
};
const deleteNotice = async (noticeId) => {
  const noticeRef = doc(firestore, "notices", noticeId);
  await deleteDoc(noticeRef);
};
const mockContents = (
  // 0: 설명, 1: 객관식, 2: 주관식
  [
    {
      type: 0,
      section: 1,
      order: 0,
      id: "section1-orientation",
      title: "강의 시작하기: 무엇을 만들게 될까요?",
      exp: 5,
      isComplete: false,
      content: '안녕하세요 👋\n\n이 강의에 오신 것을 환영합니다.\n\n이 강의에서는 **React를 처음 접하는 분들도**, 하나의 완성된 웹 애플리케이션을 직접 만들어보는 것을 목표로 합니다.\n\n---\n\n### 🧠 수강 전 알아두면 좋아요\n\n이 강의는 React 입문 강의이지만,\n아래와 같은 **기본적인 웹 개발 지식**을 알고 계시면 훨씬 수월하게 따라올 수 있습니다.\n\n> 📌 **필요한 선수 지식**\n>\n> - 기본적인 **HTML 구조** (태그, 속성 등)\n> - **JavaScript 기초 문법** (변수, 함수, 배열)\n>\n> React 문법 자체는 강의에서 차근차근 설명드리니,\n> 너무 걱정하지 않으셔도 괜찮습니다.\n\n---\n\n### 🎯 강의 컨셉\n\n> - React의 핵심 개념을 **직접 만들면서** 이해합니다.\n> - 복잡한 이론보다, "왜 이렇게 쓰는지"에 집중합니다.\n\n---\n\n### 📚 이 강의에서 배우게 될 내용\n\n1. React의 기본 개념과 동작 원리\n2. 컴포넌트와 JSX 문법\n3. State와 Props를 이용한 데이터 관리\n4. 리스트 렌더링과 이벤트 처리\n5. 최종 프로젝트: **Todo-List 앱 완성**\n\n---\n\n### 🧩 최종 목표 미리보기\n\n아래와 같은 Todo-List 애플리케이션을\n**혼자서도 만들 수 있게 되는 것**이 이 강의의 목표입니다.\n\n![Todo Template]( )\n\n --- \n\n그럼, 이제 차근차근 시작해볼까요?'
    },
    {
      type: 0,
      section: 1,
      order: 1,
      id: "intro-what-is-react",
      title: "React.js란 무엇인가?",
      exp: 10,
      isComplete: false,
      content: 'React는 **사용자 인터페이스**(UI)를 만들기 위한 JavaScript 라이브러리입니다.\n\nReact는 **Meta**(구 Facebook)에서 개발했으며,\n현재 전 세계에서 가장 널리 사용되는 프론트엔드 기술 중 하나입니다.\n\n웹페이지에서 버튼을 클릭하거나 입력값이 바뀔 때,\n화면이 전체가 아닌 **필요한 부분만** 업데이트되는 경험을 해보셨나요?\n\n이러한 동적인 화면을 **효율적으로 구현하기 위해** React가 사용됩니다.\n\n---\n\n### 🧠 React의 핵심 개념 미리보기\n\n> 📌 React를 이해하기 위한 핵심 키워드\n>\n> - **컴포넌트(Component)**: UI를 작은 단위로 나눈 조각\n> - **State**: 컴포넌트가 기억하는 상태 값\n> - **Props**: 컴포넌트 간에 전달되는 데이터\n\n이 개념들을 조합해\n복잡한 화면도 **체계적으로 관리**할 수 있습니다.\n\n---\n\n### 📦 라이브러리란 무엇일까요?\n\nReact는 프레임워크가 아닌 **라이브러리**입니다.\n\n즉, 모든 규칙을 강요하기보다는\n"필요한 부분만 선택해서" 사용할 수 있다는 장점이 있습니다.\n\n> 그래서 React는\n> 작은 프로젝트부터 대규모 서비스까지\n> 폭넓게 사용됩니다.'
    },
    {
      type: 2,
      section: 1,
      order: 2,
      id: "quiz-react-definition",
      title: "React의 정의 퀴즈",
      question: "React는 JavaScript의 어떤 종류의 도구입니까? (ㄹㅇㅂㄹㄹ)",
      correctAnswer: "라이브러리",
      exp: 20,
      isComplete: false
    },
    {
      type: 0,
      section: 1,
      order: 3,
      id: "intro-why-react",
      title: "왜 React를 배워야 할까요?",
      exp: 10,
      isComplete: false,
      content: "전 세계적으로 React가 널리 사용되는 데에는 분명한 이유가 있습니다.\n\n1. **컴포넌트 재사용**  \n   한 번 만든 UI를 여러 화면에서 반복해서 사용할 수 있습니다.\n\n2. **거대한 생태계**  \n   수많은 라이브러리와 자료가 이미 준비되어 있습니다.\n\n3. **선언적 프로그래밍**  \n   화면이 *어떻게* 바뀌는지보다,\n   *무엇을 보여줄지*에 집중할 수 있습니다.\n\n> React를 배우면\n> 단순히 문법 하나가 아니라,\n> 현대적인 프론트엔드 사고방식을 익히게 됩니다."
    },
    {
      type: 0,
      section: 1,
      order: 4,
      id: "app-creation-vite",
      title: "앱 생성하기 - Vite",
      exp: 15,
      isComplete: false,
      content: "이제 실제로 React 애플리케이션을 만들어볼 차례입니다.\n\n가장 빠르고 현대적인 개발 도구인 **Vite**를 사용합니다.\n\n터미널을 열고 아래 명령어를 입력해보세요.\n\n```bash\nnpm create vite@latest my-todo-app -- --template react\n```\n\n명령이 완료되면,\nReact 개발을 시작할 준비가 모두 끝납니다."
    },
    {
      type: 0,
      section: 1,
      order: 5,
      id: "section1-summary",
      title: "섹션 1 정리: React의 큰 그림",
      exp: 5,
      isComplete: false,
      content: "이번 섹션에서는 React를 시작하기 전에 꼭 알아야 할 **큰 그림**을 살펴봤습니다.\n\n---\n\n### ✅ 이번 섹션에서 배운 것\n\n- React는 **사용자 인터페이스(UI)**를 만들기 위한 JavaScript **라이브러리**라는 점\n- React가 왜 많은 개발자들에게 선택받는지\n- React 프로젝트를 시작하는 기본 환경 (Vite)\n\n---\n\n### 🎯 지금 여러분이 할 수 있는 것\n\n- React가 어떤 역할을 하는 도구인지 설명할 수 있습니다.\n- React 프로젝트를 직접 생성하고 실행할 수 있습니다.\n\n---\n\n다음 섹션부터는\nReact의 핵심인 **컴포넌트와 JSX**를 하나씩 직접 다뤄보게 됩니다.\n\n이제 진짜 React 개발이 시작됩니다 🚀"
    },
    {
      isComplete: false,
      exp: 10,
      order: 1,
      type: 0,
      id: "basic-understanding-components",
      title: "컴포넌트(Components) 이해하기",
      section: 2,
      content: "컴포넌트는 UI를 구성하는 **독립적인 블록**입니다.\n\nReact에서 컴포넌트는 사실 **JavaScript 함수**입니다.\n\n```jsx\nfunction Welcome() {\n  return <h1>안녕, 리액트!</h1>;\n}\n```\n\n아래와 같이 태그 형태로 사용할 수 있습니다.\n\n```jsx\n<Welcome />\n```\n\n> ⚠️ **주의**\n>\n> 컴포넌트 이름의 첫 글자는 반드시 **대문자**여야 합니다."
    },
    {
      type: 0,
      section: 2,
      order: 2,
      id: "basic-jsx-syntax",
      title: "JSX: 자바스크립트 속 HTML",
      exp: 10,
      isComplete: false,
      content: "\n\nJSX는 **자바스크립트 안에서 HTML처럼 보이는 문법**을 사용할 수 있게 해주는 React의 특수한 문법입니다.\n\n즉, HTML과 JavaScript를 자연스럽게 섞어 쓸 수 있도록 해줍니다.\n\n> 📌 핵심 특징\n> - HTML 태그처럼 생겼지만, 실제로는 자바스크립트 코드입니다.\n> - JSX 안에서는 **자바스크립트 표현식**을 `{ }` 안에 넣어 사용할 수 있습니다.\n> - `class` 대신 `className`, `for` 대신 `htmlFor` 등 일부 속성 이름이 React 규칙으로 바뀌었습니다.\n\n---\n\n### 기본 JSX 예제\n```jsx\nconst element = <h1 className=\"title\">안녕하세요, React!</h1>;\n```\n- HTML과 거의 동일하게 작성할 수 있지만, 클래스는 `className`으로 작성해야 합니다.\n\n---\n\n### 자바스크립트 표현식 사용\nJSX에서는 `{ }`를 사용해 자바스크립트 변수를 직접 넣을 수 있습니다.\n```jsx\nconst name = '철수';\nconst element = <h1>안녕하세요, {name}님!</h1>;\n```\n- 위 코드에서는 `{name}`이 변수 `name`의 값을 출력합니다.\n\n---\n\n### 더 다양한 표현식 사용 예제\n```jsx\nconst a = 10;\nconst b = 20;\nconst element = <p>{a} + {b} = {a + b}</p>;\n```\n- `{a + b}`처럼 수학 연산도 바로 JSX 안에서 처리할 수 있습니다.\n\n```jsx\nconst isLoggedIn = true;\nconst message = <p>{isLoggedIn ? '환영합니다!' : '로그인이 필요합니다.'}</p>;\n```\n- 삼항 연산자를 활용해 조건부 렌더링도 가능합니다.\n\n---\n\n### JSX에서 주의할 점\n- JSX 내부에서 **자바스크립트 문(statement)**는 사용할 수 없습니다. 표현식(expression)만 가능\n  - 예: `if`, `for` 문은 JSX 안에서 직접 쓸 수 없음\n  - 대신 `{condition ? <A /> : <B />}` 또는 `map()` 등을 사용\n---\n- 여러 요소를 반환할 때는 반드시 **하나의 부모 태그**로 감싸야 합니다.\n```jsx\nreturn (\n  <div>\n    <h1>안녕하세요</h1>\n    <p>JSX 연습 중입니다.</p>\n  </div>\n);\n```\n\n---\n\nJSX를 이해하면, React 컴포넌트 안에서 **UI를 자바스크립트처럼 조작**할 수 있는 강력한 능력을 갖게 됩니다. \n다음 강의에서는 이 JSX를 사용해 **컴포넌트를 구성하는 방법**을 배워보겠습니다."
    },
    {
      type: 1,
      section: 2,
      order: 3,
      id: "quiz-jsx-definition",
      title: "JSX의 개념 퀴즈",
      question: "다음 중 JSX에 대한 설명으로 가장 올바른 것은 무엇입니까?",
      options: [
        "HTML 파일을 대체하기 위한 새로운 언어",
        "브라우저에서 직접 실행되는 템플릿 언어",
        "자바스크립트 안에서 HTML처럼 보이는 문법을 사용할 수 있게 해주는 문법",
        "React 전용의 스타일링 문법"
      ],
      correctAnswerIndex: 2,
      exp: 20,
      isComplete: false
    },
    {
      type: 1,
      section: 2,
      order: 4,
      id: "quiz-jsx-expression",
      title: "JSX 표현식 퀴즈",
      question: "JSX 안에서 자바스크립트 변수를 출력할 때 사용하는 올바른 방법은 무엇입니까?",
      options: [
        "<p>name</p>",
        "<p>${name}</p>",
        "<p>{name}</p>",
        "<p>(name)</p>"
      ],
      correctAnswerIndex: 2,
      exp: 20,
      isComplete: false
    },
    {
      type: 1,
      section: 2,
      order: 5,
      id: "quiz-jsx-statement-vs-expression",
      title: "JSX 문법 이해 퀴즈",
      question: "다음 중 JSX 안에서 **직접 사용할 수 없는 것**은 무엇입니까?",
      options: [
        "삼항 연산자 (condition ? A : B)",
        "숫자 계산 (1 + 2)",
        "if 문",
        "변수 값 출력"
      ],
      correctAnswerIndex: 2,
      exp: 25,
      isComplete: false
    },
    {
      type: 0,
      section: 2,
      order: 6,
      id: "section2-summary",
      title: "섹션 2 정리: 컴포넌트와 JSX",
      exp: 5,
      isComplete: false,
      content: "이번 섹션에서는 React의 가장 핵심적인 개념인\n**컴포넌트와 JSX**를 배웠습니다.\n\n---\n\n### ✅ 이번 섹션에서 배운 것\n\n- 컴포넌트는 UI를 구성하는 **독립적인 단위**라는 점\n- JSX는 자바스크립트 안에서 HTML처럼 작성하는 문법이라는 점\n- JSX 안에서는 `{ }`를 사용해 자바스크립트 **표현식**을 사용할 수 있다는 점\n\n---\n\n### 🎯 지금 여러분이 할 수 있는 것\n\n- 간단한 React 컴포넌트를 직접 작성할 수 있습니다.\n- JSX 문법을 읽고, 어떤 화면이 나올지 예상할 수 있습니다.\n\n---\n\n다음 섹션에서는\n컴포넌트가 **기억을 가지게 만드는 방법**,\n즉 **State**에 대해 알아보겠습니다."
    },
    {
      exp: 15,
      id: "state-what-is-state",
      title: "State란 무엇인가?",
      section: 3,
      order: 1,
      type: 0,
      isComplete: false,
      content: "React에서 **State**는 컴포넌트가 **기억하고 있는 값**입니다.\n\n이 값은 시간이 지나면서\n또는 사용자와의 상호작용에 따라 **변경될 수 있는 데이터**를 의미합니다.\n\n---\n\n### ❓ 왜 일반 변수로는 안 될까요?\n\n아래 코드를 먼저 살펴봅시다.\n\n```jsx\nlet count = 0;\n\nfunction Counter() {\n  const increase = () => {\n    count = count + 1;\n    console.log(count);\n  };\n\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={increase}>증가</button>\n    </div>\n  );\n}\n```\n\n버튼을 눌러도 화면의 숫자는 바뀌지 않습니다.\n\n> 값은 바뀌었지만,\n> **React는 화면을 다시 그려야 한다는 사실을 알지 못하기 때문**입니다.\n\n---\n\n### ✅ 그래서 State가 필요합니다\n\nState는 단순한 값이 아니라,\n**값이 변경되었을 때 화면을 다시 그리도록 React에게 알려주는 역할**을 합니다.\n\nState가 변경되면 React는\n해당 컴포넌트를 **자동으로 다시 렌더링**합니다.\n\n---\n\n### 🧠 useState 기본 구조\n\n```jsx\nconst [count, setCount] = useState(0);\n```\n\n- `count` : 현재 상태 값\n- `setCount` : 상태를 변경하는 함수\n- `useState(0)` : 상태의 초기값\n\n> 📌 **중요**\n>\n> State 값은 반드시 `setCount` 같은\n> **상태 변경 함수로만 수정**해야 합니다.\n\n---\n\n### ✋ 꼭 기억하세요\n\n- State는 컴포넌트마다 **독립적으로 존재**합니다.\n- State가 바뀌면 컴포넌트는 **자동으로 다시 실행**됩니다.\n- 일반 변수와 다르게, State는 **화면과 연결된 값**입니다."
    },
    {
      type: 0,
      content: "이번에는 **State를 사용해 실제로 화면이 바뀌는 예제**를 살펴봅니다.\n\n아래 코드는 버튼을 클릭할 때마다\n숫자가 1씩 증가하는 간단한 카운터 앱입니다.\n\n```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        증가\n      </button>\n    </div>\n  );\n}\n```\n\n---\n\n### 🔄 버튼을 누르면 무슨 일이 일어날까요?\n\n1.버튼 클릭 이벤트가 발생합니다.\n2.이벤트는 아래의 코드를 실행시킵니다.`setCount(count + 1)`\n3.State 값이 변경됩니다.\n4.React가 **컴포넌트를 다시 실행**합니다.\n5.변경된 **count** 값이 화면에 반영됩니다.\n\n---\n\n> ⚠️ **주의**\n>\n> React 이벤트는 HTML과 다르게\n> `onclick`이 아닌 **`onClick`** 입니다.",
      isComplete: false,
      exp: 25,
      id: "state-counter-practice",
      section: 3,
      order: 2,
      title: "카운터 앱 실습: 버튼 이벤트"
    },
    {
      type: 2,
      section: 3,
      order: 3,
      id: "quiz-state-description",
      title: "State 개념 이해 퀴즈",
      question: "컴포넌트가 기억하고 있으며, 값이 변경되면 화면이 다시 렌더링되도록 만드는 React의 데이터는 무엇입니까?",
      correctAnswer: "State",
      exp: 20,
      isComplete: false
    },
    {
      type: 2,
      section: 3,
      order: 4,
      id: "quiz-state-update-code",
      title: "State 변경 코드 퀴즈",
      question: "다음 상태가 선언되어 있을 때,\n\nconst [number, setNumber] = useState(0);\n\nnumber의 값을 5로 변경하는 코드를 작성하세요.",
      correctAnswer: "setNumber(5)",
      exp: 30,
      isComplete: false
    },
    {
      type: 1,
      section: 3,
      order: 5,
      id: "quiz-state-change-effect",
      title: "State 변경 결과 퀴즈",
      question: "State의 값이 변경되면 React 컴포넌트에는 어떤 일이 발생합니까?",
      options: [
        "아무 일도 일어나지 않는다",
        "전체 페이지가 새로고침된다",
        "해당 컴포넌트가 다시 렌더링된다",
        "에러가 발생한다"
      ],
      correctAnswerIndex: 2,
      exp: 20,
      isComplete: false
    },
    {
      type: 1,
      section: 3,
      order: 6,
      id: "quiz-state-vs-variable",
      title: "State와 변수 비교 퀴즈",
      question: "다음 중 React에서 State와 일반 변수의 차이점으로 올바른 것은 무엇입니까?",
      options: [
        "State는 자바스크립트 문법이 아니다",
        "일반 변수는 값이 변경되면 자동으로 화면이 바뀐다",
        "State는 값이 변경되면 화면에 반영된다",
        "State는 컴포넌트 밖에서만 사용할 수 있다"
      ],
      correctAnswerIndex: 2,
      exp: 25,
      isComplete: false
    },
    {
      type: 1,
      section: 3,
      order: 7,
      id: "quiz-state-update-rule-final",
      title: "State 변경 규칙 퀴즈",
      question: "React에서 State 값을 직접 수정하면 안 되는 이유로 가장 적절한 것은 무엇입니까?",
      options: [
        "문법 오류가 발생하기 때문에",
        "JavaScript에서 금지된 문법이기 때문에",
        "React가 상태 변경을 감지하지 못해 화면이 갱신되지 않을 수 있기 때문에",
        "코드 스타일 가이드에 어긋나기 때문에"
      ],
      correctAnswerIndex: 2,
      exp: 30,
      isComplete: false
    },
    {
      type: 0,
      section: 3,
      order: 8,
      id: "state-common-mistakes",
      title: "+ State에서 가장 많이 하는 실수들",
      exp: 20,
      isComplete: false,
      content: "State는 React에서 가장 중요한 개념인 만큼,\n처음 배울 때 실수도 가장 많이 발생합니다.\n\n이번 강의에서는 **초보자가 가장 자주 하는 State 실수 3가지**를 살펴봅니다.\n\n---\n\n### ❌ 실수 1. State를 직접 수정하기\n\n```jsx\ncount = count + 1; // ❌ 잘못된 방법\n```\n\nState를 직접 수정하면 값은 바뀔 수 있지만,\nReact는 이 변화를 **감지하지 못합니다**.\n\n```jsx\nsetCount(count + 1); // ✅ 올바른 방법\n```\n\n> 📌 State는 반드시\n> **상태 변경 함수 - setter**로만 수정해야 합니다.\n\n---\n\n### ❌ 실수 2. State가 즉시 바뀔 거라고 생각하기\n\n```jsx\nsetCount(count + 1);\nconsole.log(count);\n```\n\n위 코드에서 console.log는 **변경되기 전 값**을 출력할 수 있습니다.\n\n> State 변경은 즉시 반영되지 않고,\n> React의 렌더링 흐름에 따라 처리됩니다.\n\n---\n\n### ❌ 실수 3. State를 너무 많이 만들기\n\n처음에는 모든 값을 State로 만들고 싶어집니다.\n\n하지만 화면에 영향을 주지 않는 값까지 State로 만들 필요는 없습니다.\n\n> 📌 **기준은 하나입니다**\n>\n> 이 값이 바뀌면 화면이 바뀌어야 하는가?\n>\n> - YES → State\n> - NO → 일반 변수\n\n---\n\n이 실수들만 피해도 React 코드는 훨씬 안정적으로 동작하게 됩니다."
    },
    {
      type: 0,
      section: 3,
      order: 9,
      id: "state-summary-review",
      title: "Section 3 마무리: State 한 번에 정리하기",
      exp: 15,
      isComplete: false,
      content: '이번 섹션에서는 React의 핵심 개념인 **State**에 대해 배웠습니다.\n\n이제 중요한 내용을 차분하게 한 번 정리해봅시다.\n\n---\n\n### 🧠 State 핵심 요약\n\n> 📌 State란?\n>\n> - 컴포넌트가 기억하는 값\n> - 값이 변경되면 화면이 다시 렌더링됨\n\n> --- \n\n > --- \n\n > 📌 State 사용 규칙\n>\n> - State는 **useState**로 선언한다\n> - 값은 반드시 상태 변경 함수로만 수정한다\n> - State 변경 → 컴포넌트 재실행\n\n---\n\n### 🔄 State 사고방식 정리\n\nReact에서는 이렇게 생각하면 됩니다.\n\n> "값이 바뀌면, 화면도 함께 바뀌어야 한다면\n> 그 값은 State다."\n\n이 기준만 기억해도\nState를 언제 써야 할지 헷갈리지 않게 됩니다.\n\n---\n\n### ▶️ 다음 섹션 예고\n\n다음 섹션에서는\n**Props**를 사용해 컴포넌트 간에\n데이터를 전달하는 방법을 배웁니다.\n\nState를 이해했다면,\nProps는 훨씬 쉽게 느껴질 것입니다.\n\n수고하셨습니다 👏\n이제 한 단계 더 React에 가까워졌습니다.'
    },
    {
      title: "Props로 데이터 전달하기",
      type: 0,
      order: 1,
      section: 4,
      exp: 20,
      isComplete: false,
      id: "props-passing-data",
      content: 'React에서 **Props**는\n부모 컴포넌트가 자식 컴포넌트에게 전달하는 **데이터**입니다.\n\n쉽게 말해,\n> 부모가 자식에게 주는 **읽기 전용 값**입니다.\n\n---\n\n### ❓ 왜 Props가 필요할까요?\n\n컴포넌트는 혼자서만 존재하지 않습니다.\n대부분의 경우, 여러 컴포넌트가 **함께 협력**하며 하나의 화면을 만듭니다.\n\n이때 컴포넌트 간에 데이터를 주고받아야 하는데,\n그 역할을 하는 것이 바로 **Props**입니다.\n\n---\n\n### 👨‍👩‍👧 부모 → 자식 구조 이해하기\n\n아래 예제를 살펴봅시다.\n\n```jsx\n// 부모 컴포넌트\n<MyButton text="저장하기" />\n```\n\n부모 컴포넌트는\n`text`라는 이름의 Props를 자식에게 전달합니다.\n\n```jsx\n// 자식 컴포넌트\nfunction MyButton(props) {\n  return <button>{props.text}</button>;\n}\n```\n\n- `props.text` → 부모가 전달한 값\n- 자식 컴포넌트는 이 값을 **사용만 할 수 있고 수정할 수는 없습니다**.\n\n---\n\n### 📌 꼭 기억하세요\n\n- Props는 **위에서 아래로**만 전달됩니다 (부모 → 자식)\n- 자식 컴포넌트는 Props를 **변경할 수 없습니다**\n- 화면에 표시되는 데이터의 대부분은 Props로 전달됩니다'
    },
    {
      type: 0,
      section: 4,
      order: 2,
      id: "props-vs-state",
      title: "Props와 State의 차이점 이해하기",
      exp: 15,
      isComplete: false,
      content: 'Props와 State는 둘 다\n컴포넌트에서 사용하는 데이터이지만,\n역할은 완전히 다릅니다.\n\n---\n\n### 🧠 한 문장으로 정리하면\n\n> - **State**: 컴포넌트가 스스로 관리하는 값\n> - **Props**: 부모가 내려주는 값\n\n---\n\n### 📊 Props vs State 비교\n\n- State는 컴포넌트 안에서 선언됩니다\n- Props는 컴포넌트 밖(부모)에서 전달됩니다\n\n```jsx\n// 부모\nfunction App() {\n  return <MyButton text="확인" />;\n}\n\n// 자식\nfunction MyButton(props) {\n  return <button>{props.text}</button>;\n}\n```\n\n- `text`는 MyButton의 State가 아닙니다\n- 부모(App)가 결정한 값입니다\n\n---\n\n### ❗ 초보자가 가장 많이 하는 착각\n\n> ❌ "Props도 State처럼 바꾸면 되지 않나요?"\n\n아닙니다.\n\nProps는 **읽기 전용**이며,\n자식 컴포넌트는 받은 값을 변경할 수 없습니다.\n\n이 규칙 덕분에\n컴포넌트 구조가 훨씬 예측 가능해집니다.'
    },
    {
      id: "props-pass-setstate",
      type: 0,
      section: 4,
      order: 3,
      title: "함수도 Props로 전달할 수 있어요",
      exp: 20,
      isComplete: false,
      content: "Props로는 문자열이나 숫자뿐만 아니라\n**함수도 전달할 수 있습니다**.\n\n이 방식은 React에서\n아주 자주 사용되는 중요한 패턴입니다.\n\n---\n\n### ❓ 왜 함수까지 전달할까요?\n\nState는 부모가 가지고 있지만,\n버튼 클릭 같은 이벤트는 자식에서 발생하는 경우가 많습니다.\n\n이때,\n> 자식이 부모의 State를 직접 바꿀 수는 없기 때문에\n> **부모가 만든 함수를 Props로 내려줍니다**.\n\n---\n\n### 🔄 구조 예제\n\n```jsx\n// 부모 컴포넌트\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  return <CounterButton onIncrease={() => setCount(count + 1)} />;\n}\n\n// 자식 컴포넌트\nfunction CounterButton(props) {\n  return <button onClick={props.onIncrease}>증가</button>;\n}\n```\n\n---\n\n### 🧠 이 구조의 핵심\n\n- State는 여전히 **부모가 관리**합니다\n- 자식은 이벤트만 발생시킵니다\n- 실제 상태 변경은 부모에서 이루어집니다\n\n> 이 패턴을 이해하면\n> React 컴포넌트 구조가 한눈에 보이기 시작합니다."
    },
    {
      type: 0,
      section: 4,
      order: 4,
      id: "props-common-mistakes",
      title: "+ Props 사용 시 주의할 점",
      exp: 10,
      isComplete: false,
      content: "Props를 처음 사용할 때\n자주 발생하는 실수들이 있습니다.\n\n---\n\n### ❌ 실수 1. Props를 직접 수정하려고 하기\n\n```jsx\nprops.text = '변경'; // ❌ 잘못된 코드\n```\n\nProps는 읽기 전용이기 때문에\n직접 수정하면 안 됩니다.\n\n---\n\n### ❌ 실수 2. Props와 State를 헷갈리기\n\n> \"이 값은 Props일까, State일까?\"\n\n이렇게 판단하면 됩니다.\n\n> 📌 이 값은 누가 관리해야 할까?\n>\n> - 컴포넌트 자신 → State\n> - 부모 → Props\n\n---\n\n### ❌ 실수 3. 너무 많은 Props 전달하기\n\nProps가 지나치게 많아지면\n컴포넌트가 이해하기 어려워집니다.\n\n이 경우에는\n컴포넌트 분리를 다시 고민해보는 것이 좋습니다."
    },
    {
      type: 0,
      section: 4,
      order: 5,
      id: "props-destructuring-intro",
      title: "Props를 더 간단하게 받는 방법",
      exp: 10,
      isComplete: false,
      content: "지금까지 우리는 Props를 이렇게 사용했습니다.\n\n```jsx\nfunction MyButton(props) {\n  return <button>{props.text}</button>;\n}\n```\n\n이 방식은 전혀 문제가 없고,\nReact를 처음 배울 때 가장 이해하기 쉬운 방법입니다.\n\n---\n\n### ✨ 더 간단한 작성법\n\nJavaScript의 **구조 분해 할당**을 사용하면\nProps를 더 간결하게 받을 수 있습니다.\n\n```jsx\nfunction MyButton({ text }) {\n  return <button>{text}</button>;\n}\n```\n\n---\n\n### 🤔 이게 왜 같은 코드인가요?\n\n아래 두 코드는 완전히 동일하게 동작합니다.\n\n```jsx\nprops.text\n```\n\n```jsx\nconst { text } = props;\n```\n\nReact 문법이 아니라\n**자바스크립트 문법**입니다.\n\n---\n\n### 📌 언제 사용하면 좋을까요?\n\n- Props가 많아질 때\n- 코드 가독성을 높이고 싶을 때\n- 실무 코드 스타일에 익숙해지고 싶을 때\n\n> ❗ 처음에는\n> `props.text` 방식으로 써도 전혀 문제 없습니다.\n> 익숙해지면 천천히 사용해보세요."
    },
    {
      type: 1,
      section: 4,
      order: 6,
      id: "quiz-props-definition",
      title: "Props의 정의 퀴즈",
      question: "다음 중 Props의 올바른 설명은 무엇일까요?",
      options: [
        "컴포넌트가 스스로 관리하는 상태 값",
        "부모 컴포넌트가 자식에게 전달하는 읽기 전용 데이터",
        "자식 컴포넌트가 직접 수정할 수 있는 값",
        "HTML 태그 속성을 의미하는 React 전용 문법"
      ],
      correctAnswerIndex: 1,
      exp: 20,
      isComplete: false
    },
    {
      type: 2,
      section: 4,
      order: 7,
      id: "quiz-props-vs-state",
      title: "Props와 State 구분하기",
      question: "컴포넌트가 직접 관리하는 값은 무엇인가요? (Props 또는 State)",
      correctAnswer: "State",
      exp: 20,
      isComplete: false
    },
    {
      type: 1,
      section: 4,
      order: 8,
      id: "quiz-props-function",
      title: "함수 Props 이해하기",
      question: "다음 중 부모가 자식에게 함수 형태로 Props를 전달하는 이유는 무엇일까요?",
      options: [
        "자식에서 직접 부모 State를 수정하기 위해",
        "자식이 상태를 기억하기 위해",
        "자식에서 이벤트 발생 시 부모의 상태를 변경할 수 있도록 하기 위해",
        "자식 컴포넌트를 독립적으로 만들기 위해"
      ],
      correctAnswerIndex: 2,
      exp: 25,
      isComplete: false
    },
    {
      type: 1,
      section: 4,
      order: 9,
      id: "quiz-props-destructuring",
      title: "Props 구조 분해 퀴즈",
      question: "아래 두 코드 중 동작이 같은 것을 모두 고르세요.\n\nA) props.text\nB) const { text } = props; text",
      options: [
        "둘 다 동작한다",
        "A만 동작한다",
        "B만 동작한다",
        "둘 다 동작하지 않는다"
      ],
      correctAnswerIndex: 0,
      exp: 25,
      isComplete: false
    },
    {
      type: 1,
      section: 4,
      order: 10,
      id: "quiz-props-mistakes",
      title: "Props 사용 시 주의점",
      question: "자식 컴포넌트에서 Props 값을 직접 수정하면 안 되는 이유는 무엇인가요?",
      options: [
        "Props는 읽기 전용이어서 직접 수정하면 컴포넌트 상태 관리가 예측 불가능해지기 때문",
        "Props는 숫자만 담을 수 있기 때문",
        "Props는 자식 컴포넌트에서만 사용할 수 있기 때문",
        "Props를 수정하면 부모 컴포넌트가 사라지기 때문"
      ],
      correctAnswerIndex: 0,
      exp: 30,
      isComplete: false
    },
    {
      type: 0,
      section: 4,
      order: 11,
      id: "props-summary-review",
      title: "Props 마무리 & 복습",
      exp: 15,
      isComplete: false,
      content: "이번 Section에서는 React에서 가장 기본적이면서 중요한 **Props** 개념을 배웠습니다.\n\n---\n\n### 🔑 핵심 요약\n1. **Props란?**\n   - 부모가 자식에게 내려주는 **읽기 전용 데이터**\n   - 자식은 수정할 수 없고, 단지 사용할 수 있음\n\n2. **Props vs State**\n   - **State**: 컴포넌트 자신이 관리하는 값\n   - **Props**: 부모가 전달하는 값\n\n3. **함수도 Props로 전달 가능**\n   - 자식에서 이벤트를 발생시켜 부모의 상태를 변경할 때 사용\n\n4. **구조 분해 할당**\n   - `props.text` ↓↓↓ `{ text }`로 간단히 받기 가능\n\n5. **주의할 점**\n   - Props는 **직접 수정 금지**\n   - Props와 State를 혼동하지 않기\n   - 너무 많은 Props 전달은 피하기\n\n---\n\n### 🧩 복습 체크리스트\n- [ ] 부모 → 자식 데이터 전달 구조 이해하기\n- [ ] State와 Props 차이 명확히 구분하기\n- [ ] 이벤트 함수를 Props로 내려주는 패턴 이해하기\n- [ ] 구조 분해 할당으로 Props 받기\n- [ ] Props를 직접 수정하지 않기\n\n이제 Props 개념을 충분히 이해했으니,\n다음 Section에서는 **리스트 렌더링과 반복되는 데이터를 화면에 보여주는 방법**을 배워보겠습니다."
    },
    {
      id: "event-what-is-event",
      section: 5,
      order: 1,
      type: 0,
      title: "React에서 이벤트(Event)란?",
      exp: 15,
      isComplete: false,
      content: "React에서 **이벤트**(Event)란\n사용자가 화면과 상호작용할 때 발생하는 모든 행동을 의미합니다.\n\n예를 들면 다음과 같습니다.\n\n- 버튼 클릭\n- 입력창에 글자 입력\n- 마우스 올리기\n\n---\n\n### ❓ 이벤트는 왜 중요한가요?\n\nReact 앱은 대부분\n**사용자의 행동에 따라 화면이 바뀌는 구조**입니다.\n\n> 사용자의 행동 → 이벤트 발생 → 함수 실행 → State 변경 → 화면 업데이트\n\n이 흐름의 시작점이 바로 **이벤트**입니다.\n\n---\n\n### 📌 React 이벤트의 특징\n\n- HTML 이벤트와 거의 비슷하지만, **카멜 케이스**(camelCase)를 사용합니다.\n- 문자열이 아닌 **함수**를 전달합니다.\n\n```jsx\n<button onClick={handleClick}>클릭</button>\n```"
    },
    {
      id: "event-html-vs-react",
      section: 5,
      order: 2,
      type: 0,
      title: "HTML 이벤트와 React 이벤트의 차이",
      exp: 15,
      isComplete: false,
      content: 'React 이벤트는 HTML 이벤트와 비슷해 보이지만 중요한 차이가 있습니다.\n\n---\n\n### ❌ HTML 방식\n```html\n<button onclick="handleClick()">클릭</button>\n```\n\n---\n\n### ✅ React 방식\n```jsx\n<button onClick={handleClick}>클릭</button>\n```\n\n---\n\n### 🧠 핵심 차이 정리\n\n- `onclick` ❌ → `onClick` ✅\n- 문자열 ❌ → 함수 전달 ✅\n\n> React에서는\n> **이 함수가 클릭되면 실행돼**라고 전달하는 방식입니다.'
    },
    {
      id: "event-handler-function",
      section: 5,
      order: 3,
      type: 0,
      title: "이벤트 핸들러 함수 만들기",
      exp: 20,
      isComplete: false,
      content: "이벤트가 발생했을 때 실행되는 함수를\n**이벤트 핸들러**(Event Handler)라고 부릅니다.\n\n---\n\n### 기본 예제\n```jsx\nfunction App() {\n  const handleClick = () => {\n    console.log('버튼이 클릭되었습니다');\n  };\n\n  return <button onClick={handleClick}>클릭</button>;\n}\n```\n\n---\n\n### 🔍 코드 해석\n\n- **handleClick**은 **이벤트 핸들러 함수**입니다.\n- 버튼을 클릭하면 React가 이 함수를 실행합니다.\n\n> 📌 이벤트 핸들러 이름은\n> `handleClick` `onSubmit` `onChange`처럼 **의미가 드러나게** 짓는 것이 좋습니다."
    },
    {
      id: "event-function-vs-execution",
      section: 5,
      order: 4,
      type: 0,
      title: "함수를 전달할까? 실행할까?",
      exp: 20,
      isComplete: false,
      content: "React 이벤트에서 초보자가 가장 많이 헷갈리는 부분입니다.\n\n---\n\n### ❌ 잘못된 코드\n```jsx\n<button onClick={handleClick()}>클릭</button>\n```\n\n이 코드는 **렌더링 시점에 바로 함수가 실행**됩니다.\n\n---\n\n### ✅ 올바른 코드\n```jsx\n<button onClick={handleClick}>클릭</button>\n```\n\n---\n\n### 🧠 기억하세요\n\n- `handleClick` → 함수 **전달**\n- `handleClick()` → 함수 **즉시 실행**\n\n> React 이벤트에는 **실행 결과**가 아니라 **함수 자체**를 전달해야 합니다."
    },
    {
      id: "event-state-update",
      section: 5,
      order: 5,
      type: 0,
      title: "이벤트로 State 변경하기",
      exp: 25,
      isComplete: false,
      content: "이벤트는 단순히 콘솔 로그를 찍는 데서 끝나지 않습니다.\n\n가장 중요한 역할은 **State를 변경하는 것**입니다.\n\n---\n\n### 예제: 버튼 클릭 시 숫자 증가\n```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  const increase = () => {\n    setCount(count + 1);\n  };\n\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={increase}>증가</button>\n    </div>\n  );\n}\n```\n\n---\n\n### 🔄 흐름 정리\n\n- 버튼 클릭\n- increase 함수 실행\n- setCount 호출\n- State 변경\n- 화면 재렌더링\n\n> 이 흐름을 이해하면 React의 절반은 이해한 것입니다."
    },
    {
      id: "event-common-mistakes",
      section: 5,
      order: 6,
      type: 0,
      title: "+ 이벤트에서 가장 많이 하는 실수",
      exp: 15,
      isComplete: false,
      content: '이벤트를 처음 다룰 때\n자주 발생하는 실수들을 정리해봅니다.\n\n---\n\n### ❌ 실수 1. 함수를 즉시 실행하기\n```jsx\nonClick={handleClick()} // ❌\n```\n\n---\n\n### ❌ 실수 2. HTML 이벤트 방식 사용하기\n```jsx\nonclick="handleClick()" // ❌\n```\n\n---\n\n### ❌ 실수 3. State를 직접 변경하기\n```jsx\ncount = count + 1 // ❌\n```\n\n> 이벤트 + State는 항상\n> **setter 함수**와 함께 사용하세요.'
    },
    {
      id: "quiz-event-camelcase",
      section: 5,
      order: 7,
      type: 1,
      title: "React 이벤트 문법 퀴즈",
      exp: 20,
      isComplete: false,
      question: "React에서 버튼 클릭 이벤트를 올바르게 작성한 것은 무엇인가요?",
      options: [
        'onclick="handleClick()"',
        "onClick={handleClick}",
        'onClick="handleClick"',
        "onclick={handleClick()}"
      ],
      correctAnswerIndex: 1,
      explanation: "React 이벤트는 camelCase를 사용하며, 문자열이 아닌 함수 자체를 전달해야 합니다."
    },
    {
      id: "quiz-event-function-call",
      section: 5,
      order: 8,
      type: 1,
      title: "이벤트 함수 전달 퀴즈",
      exp: 20,
      isComplete: false,
      question: "다음 중 버튼 클릭 시에만 함수가 실행되는 코드는 무엇인가요?",
      options: [
        "onClick={handleClick()}",
        "onClick={handleClick}",
        'onClick="handleClick"',
        "onClick={handleClick + 1}"
      ],
      correctAnswerIndex: 1
    },
    {
      id: "quiz-event-short-answer",
      section: 5,
      order: 9,
      type: 2,
      title: "이벤트 개념 단답 퀴즈",
      exp: 20,
      isComplete: false,
      question: "React에서 이벤트 핸들러에 전달해야 하는 것은 함수의 실행 결과일까요, 함수 그 자체일까요?",
      correctAnswer: "함수"
    },
    {
      id: "event-summary-review",
      section: 5,
      order: 10,
      type: 0,
      title: "Section 5 마무리: 이벤트 한 번에 정리하기",
      exp: 15,
      isComplete: false,
      content: "이번 Section에서는\nReact에서 **이벤트**(Event)를 다루는 방법을 배웠습니다.\n\n---\n\n### ✅ 핵심 요약\n\n- 이벤트는 **사용자의 행동**입니다\n- React 이벤트는 camelCase를 사용합니다 (**onClick**)\n- 이벤트에는 **함수 자체**를 전달합니다\n- 이벤트를 통해 State를 변경하면 화면이 업데이트됩니다\n\n---\n\n### 🎯 지금 할 수 있는 것\n\n- 버튼 클릭 이벤트 처리하기\n- 이벤트로 State 변경하기\n- 이벤트 문법 실수 피하기\n\n---\n\n이제 다음 Section에서는\n**여러 개의 데이터를 다루는 방법**,\n즉 **List / Object와 불변성**을 배워보겠습니다.\n\n이제 진짜 앱다운 구조로 들어갑니다 🚀"
    },
    {
      id: "list-intro",
      type: 0,
      section: 6,
      order: 1,
      title: "List와 Object 기초 이해하기",
      exp: 10,
      isComplete: false,
      content: "React에서 자주 사용하는 데이터 구조인 **배열 - List**과 **객체 - Object**에 대해 배워봅니다.\n\n---\n\n### 1️⃣ List와 Object의 차이\n- List(배열): 순서가 있는 데이터 묶음, 예: [1, 2, 3]\n- Object(객체): key-value 쌍으로 데이터 저장, 예: {name: '철수', age: 20}\n\n---\n\n### 2️⃣ React에서 List와 Object 사용 이유\n- 화면에 여러 데이터를 반복해서 보여줄 때 배열 사용\n- 한 데이터의 속성을 관리할 때 객체 사용\n- 배열과 객체를 state로 관리하며 동적인 화면을 만들 수 있습니다."
    },
    {
      id: "list-render",
      type: 0,
      section: 6,
      order: 2,
      title: "배열 데이터를 화면에 반복 렌더링하기",
      exp: 15,
      isComplete: false,
      content: "배열을 화면에 반복해서 표시할 때는 JavaScript의 **map()** 함수를 사용합니다.\n\n---\n\n### map() 함수 구조\n`map()` 함수는 배열의 각 항목을 순회하며 새로운 값을 반환합니다.\n```jsx\narray.map((item, index) => {\n  // item: 현재 요소 값\n  // index: 현재 요소 인덱스\n});\n```\n- **첫 번째 인수(item)**: 현재 배열 항목의 값\n- **두 번째 인수(index)**: 현재 배열 항목의 인덱스\n\n---\n\n### 예제\n```jsx\nconst fruits = ['사과', '바나나', '딸기'];\n\nreturn (\n  <ul>\n    {fruits.map((fruit, idx) => (\n      <li key={idx}>{idx + 1}. {fruit}</li>\n    ))}\n  </ul>\n);\n```\n- 위 코드에서 `idx`는 순서 번호를 표시하거나, 상황에 따라 key로 활용할 수 있습니다.\n\n---\n\n### 📌 주의 사항\n- React에서 배열을 렌더링할 때는 항상 **key** 속성을 지정해야 합니다.\n- key는 각 항목을 고유하게 식별하여 업데이트 효율을 높입니다.\n- index를 key로 사용하는 것은 배열이 고정되어 있을 때만 안전합니다. 동적으로 항목이 추가/삭제되는 경우에는 고유한 값을 사용하는 것이 권장됩니다."
    },
    {
      id: "list-key",
      type: 0,
      section: 6,
      order: 3,
      title: "key는 왜 필요할까요?",
      exp: 15,
      isComplete: false,
      content: "배열을 렌더링할 때 key를 주지 않으면 React는 **어떤 항목이 변경되었는지 추적하기 어렵습니다**.\n\n---\n\n### key 사용법\n```jsx\nconst fruits = ['사과', '바나나', '딸기'];\n\nreturn (\n  <ul>\n    {fruits.map((item, index) => (\n      <li key={index}>{fruit}</li>\n    ))}\n  </ul>\n);\n```\n\n- key는 배열 항목의 **고유한 값**이어야 합니다.\n- index를 key로 쓰는 것은 가능하지만, 배열이 변경될 가능성이 있으면 권장하지 않습니다."
    },
    {
      id: "state-array-copy",
      type: 0,
      section: 6,
      order: 4,
      title: "배열/객체 수정: 새 데이터 만들기",
      exp: 15,
      isComplete: false,
      content: "React에서 배열이나 객체를 state로 관리할 때는 **항상 새로운 배열/객체를 만들어야** 합니다.\n\n---\n\n### ❓ 왜 새로운 데이터를 만들어야 할까요?\n- React는 state가 이전 값과 다른지 비교해 **변경이 일어났는지 감지**합니다.\n- 배열이나 객체를 직접 수정하면 **참조(reference)가 변하지 않아** React가 변경을 감지하지 못할 수 있습니다.\n\n---\n\n### 🔹 스프레드 연산자(...)\n- 새로운 배열/객체를 쉽게 만들 수 있는 자바스크립트 문법입니다.\n\n#### 배열 예제\n```jsx\nconst todos = ['우유', '공부'];\nconst newTodos = [...todos, '청소'];\nconsole.log(newTodos);\n```\n**출력:**\n```\n['우유', '공부', '청소']\n```\n\n#### 객체 예제\n```jsx\nconst user = { name: '철수', age: 20 };\nconst newUser = { ...user, age: 21 };\nconsole.log(newUser);\n```\n**출력:**\n```\n{ name: '철수', age: 21 }\n```\n\n> ✅ 이렇게 하면 React가 새로운 참조를 인식하고 화면이 올바르게 업데이트됩니다."
    },
    {
      id: "state-immutability",
      type: 0,
      section: 6,
      order: 5,
      title: "불변성(Immutable)과 React 상태 관리",
      exp: 15,
      isComplete: false,
      content: "React에서 state를 다룰 때 **불변성을 지키는 것이 왜 중요한지** 자세히 알아봅시다.\n\n---\n\n### 1️⃣ 불변성이란?\n- 배열이나 객체를 직접 변경하지 않고, 항상 새로운 배열/객체를 만드는 원칙\n- '값이 바뀌면 새로운 것 생성'이라고 생각하면 이해하기 쉽습니다.\n\n---\n\n### 2️⃣ React가 상태 변화를 감지하는 방법\n- React는 내부적으로 이전 state와 새로운 state를 **얕은 비교(shallow comparison)** 합니다.\n- 배열이나 객체를 직접 수정하면 **참조(reference)가 변하지 않아** React가 '변경 없음'으로 판단합니다.\n- 새 배열/객체를 만들면 참조가 바뀌므로 React가 **변경을 감지하고 재렌더링**을 수행합니다.\n\n---\n\n### 3️⃣ 예제 비교\n// 잘못된 방법 ❌\n`todos.push('청소');`\nsetTodos(todos); // React가 업데이트를 감지하지 못할 수 있음\n\n// 올바른 방법 ✅\n`setTodos([...todos, '청소']);` // 새 배열을 생성, React가 감지하고 화면 갱신\n\n---\n### 4️⃣ 핵심 요약\n- 배열/객체 state를 직접 수정하지 마세요\n- 항상 새 배열/객체를 만들어 setState에 전달하세요\n- 스프레드 연산자(...), map(), filter(), concat() 같은 함수를 활용하면 편리합니다\n- 불변성을 지켜야 React 상태 관리가 안전하고 예측 가능합니다"
    },
    {
      id: "list-quiz-1",
      section: 6,
      order: 6,
      title: "배열 렌더링 함수 이름",
      type: 2,
      exp: 10,
      isComplete: false,
      question: "배열을 화면에 반복 렌더링할 때 사용하는 JavaScript 메서드의 이름을 쓰세요.",
      correctAnswer: "map",
      explanation: "React에서는 배열을 화면에 반복 표시할 때 `map()` 함수를 사용합니다."
    },
    {
      id: "list-quiz-2",
      section: 6,
      order: 7,
      title: "map 함수 인수 의미",
      type: 2,
      exp: 10,
      isComplete: false,
      question: "map 함수에서 두 번째 인수는 무엇을 의미하나요?(영단어로 쓰세요)",
      correctAnswer: "index",
      explanation: "map((item, index) => ...)에서 첫 번째 인수는 배열의 현재 항목, 두 번째 인수는 해당 항목의 인덱스를 의미합니다."
    },
    {
      id: "list-quiz-3",
      section: 6,
      order: 8,
      title: "key 속성 필요성",
      type: 1,
      exp: 15,
      isComplete: false,
      question: "React에서 배열을 렌더링할 때 key 속성을 지정해야 하는 이유는 무엇인가요?",
      options: [
        "배열 항목의 순서를 무조건 고정하기 위해",
        "어떤 항목이 변경되었는지 React가 효율적으로 추적하기 위해",
        "HTML에서 필수 속성이기 때문에",
        "배열의 길이를 계산하기 위해"
      ],
      correctAnswerIndex: 1,
      explanation: "key 속성은 React가 각 항목을 고유하게 식별하고 변경된 항목만 업데이트하도록 돕습니다."
    },
    {
      id: "list-quiz-4",
      section: 6,
      order: 9,
      title: "state 배열/객체 불변성",
      type: 1,
      exp: 15,
      isComplete: false,
      question: "React state에서 배열이나 객체를 직접 수정하지 않고 새로운 배열/객체를 만들어야 하는 이유는 무엇인가요?",
      options: [
        "코드가 더 간결해지기 때문",
        "React가 이전 state와 다른지 비교해 변경 여부를 감지할 수 있도록",
        "브라우저 호환성 문제 때문에",
        "자바스크립트 문법에서 배열/객체는 항상 새로 만들어야 하기 때문"
      ],
      correctAnswerIndex: 1,
      explanation: "React는 state가 이전 값과 다른지를 비교해 변경 여부를 감지합니다. 기존 배열/객체를 직접 수정하면 참조가 그대로여서 변경 감지가 되지 않을 수 있습니다."
    },
    {
      id: "list-quiz-5",
      section: 6,
      order: 10,
      title: "불변성 유지하며 배열 항목 추가하기",
      type: 2,
      exp: 15,
      isComplete: false,
      question: "배열 `const fruits = ['banana', 'apple']`에 불변성을 유지하면서 `orange` 항목이 추가된 const newFruits를 선언하는 코드를 작성하세요.",
      correctAnswer: `const newFruits = [...fruits, 'orange'];,,const newFruits = [...fruits, "orange"];`,
      explanation: "스프레드 연산자를 사용하면 기존 배열을 직접 수정하지 않고 새로운 배열을 만들 수 있습니다. React state를 업데이트할 때 불변성을 유지하면 변경을 React가 올바르게 감지할 수 있습니다."
    },
    {
      id: "list-summary-review",
      type: 0,
      section: 6,
      order: 11,
      title: "Section6 마무리 & 복습: 리스트와 객체 다루기",
      exp: 20,
      isComplete: false,
      content: "이번 Section에서는 React에서 배열과 객체를 다루는 방법을 배웠습니다.\n\n---\n\n### ✅ 핵심 정리\n- **배열/객체 반복 렌더링**\n   - map() 함수를 사용하여 배열 항목을 화면에 반복 표시합니다.\n   - map()의 첫 번째 인수는 항목(item), 두 번째 인수는 index(순서)입니다.\n\n- **key의 중요성**\n   - React가 어떤 항목이 변경되었는지 추적하는 데 필요합니다.\n   - 배열 항목을 고유하게 식별할 수 있는 값으로 지정합니다.\n\n- **State에서 배열/객체 직접 수정 금지**\n   - 기존 배열/객체를 직접 바꾸면 React가 변경을 감지하지 못할 수 있습니다.\n   - 항상 새로운 배열/객체를 만들어서 setState 함수로 업데이트해야 합니다.\n\n- **스프레드 연산자(...) 활용**\n   - 기존 배열/객체를 복사하면서 새로운 항목을 추가하거나 일부 속성을 변경할 때 사용합니다.\n   - React에서 불변성을 유지하면서 state를 업데이트하는 가장 일반적인 패턴입니다.\n\n---\n\n### ⚠️ 자주 하는 실수\n- 배열/객체를 직접 수정하고 setState를 호출함\n- key를 지정하지 않거나 index를 무분별하게 key로 사용함\n- map() 함수의 index를 잘못 활용하여 렌더링 순서가 꼬임\n\n---\n\n### 💡 팁\n- 작은 배열이라도 항상 불변성을 지키는 습관을 들이세요.\n- key는 가능하면 고유 식별자를 사용하고, 불가피하게 index를 쓴다면 배열이 변경되지 않는 경우에만 사용하세요.\n- map(), filter(), spread 연산자 등은 React에서 상태 관리를 할 때 매우 자주 사용되는 도구입니다.\n\n> 🎯 이 섹션에서 배운 내용을 잘 이해하면, 이후 프로젝트에서 리스트와 상태 관리를 훨씬 안전하고 효율적으로 할 수 있습니다."
    },
    {
      id: "form-intro",
      section: 7,
      order: 1,
      type: 0,
      title: "왜 Form 이벤트를 배워야 할까요?",
      exp: 10,
      isComplete: false,
      content: "지금까지 우리는 버튼 클릭 이벤트를 통해 State를 변경하는 방법을 배웠습니다.\n\n하지만 실제 앱에서는 **사용자의 입력값**을 받아야 하는 경우가 훨씬 많습니다.\n\n---\n\n### 예를 들면\n\n- Todo 입력하기\n- 검색어 입력\n- 로그인 폼 작성\n\n이때 반드시 필요한 것이 바로 **Form 이벤트**입니다.\n\n> 📌 Todo-List 앱의 시작은 버튼이 아니라 **input + form** 입니다.\n\n이번 Section에서는 Todo 실습을 시작하기 전에 꼭 필요한\n**입력 이벤트의 기초**를 다뤄봅니다."
    },
    {
      id: "form-controlled-input",
      section: 7,
      order: 2,
      type: 0,
      title: "input 값은 왜 State로 관리할까요?",
      exp: 15,
      isComplete: false,
      content: "React에서 input 요소는 보통 **State와 연결해서 관리**합니다.\n\n이 방식을 **제어 컴포넌트**(Controlled Component)라고 부릅니다.\n\n---\n\n### 기본 구조\n```jsx\nconst [text, setText] = useState('');\n\n<input value={text} />\n```\n\n이 상태에서는\ninput에 아무것도 입력할 수 없습니다.\n\n---\n\n### 왜 그럴까요?\n\n- input의 값은 `value={text}`로 고정되어 있고\n- text는 아직 변경되지 않기 때문입니다.\n\n> 즉, **입력값을 바꾸는 이벤트가 필요합니다.**"
    },
    {
      id: "form-onchange",
      section: 7,
      order: 3,
      type: 0,
      title: "onChange 이벤트로 입력값 처리하기",
      exp: 20,
      isComplete: false,
      content: "input의 값이 바뀔 때마다 실행되는 이벤트가\n바로 **onChange** 입니다.\n\n---\n\n### 기본 예제\n```jsx\nfunction InputExample() {\n  const [text, setText] = useState('');\n\n  const handleChange = (e) => {\n    setText(e.target.value);\n  };\n\n  return (\n    <input\n      value={text}\n      onChange={handleChange}\n    />\n  );\n}\n```\n\n---\n\n### 🧠 코드 흐름 이해하기\n\n- 사용자가 키보드를 입력\n- onChange 이벤트 발생\n- 이벤트 객체(e)가 전달됨\n- e.target.value로 입력값 접근\n- setText로 State 변경\n- 화면 업데이트\n\n> 이 구조는 이후 Todo 입력에서도 그대로 사용됩니다."
    },
    {
      id: "form-event-object",
      section: 7,
      order: 4,
      type: 0,
      title: "이벤트 객체(e)는 무엇인가요?",
      exp: 15,
      isComplete: false,
      content: "onChange, onSubmit 같은 이벤트에는\n항상 **이벤트 객체**가 전달됩니다.\n\n보통 관례적으로 `e` 또는 `event`라고 이름 짓습니다.\n\n---\n\n### 자주 사용하는 속성\n\n```jsx\ne.target.value\n```\n\n- `e.target` 이벤트가 발생한 요소\n- `value` input에 입력된 값\n\n---\n\n### 기억 포인트\n\n> 📌 Form 이벤트에서 가장 많이 사용하는 값은\n> **e.target.value 하나면 충분합니다.**\n\n처음부터 모든 속성을 외울 필요는 없습니다."
    },
    {
      id: "form-submit",
      section: 7,
      order: 5,
      type: 0,
      title: "form과 onSubmit 이벤트",
      exp: 20,
      isComplete: false,
      content: "input과 버튼을 감싸는 태그가 바로 **form** 입니다.\n\nform은 기본적으로 **제출**(submit)이라는 동작을 가지고 있습니다.\n\n---\n\n### 기본 form 구조\n```jsx\n<form onSubmit={handleSubmit}>\n  <input />\n  <button>추가</button>\n</form>\n```\n\n- 버튼 클릭\n- Enter 키 입력\n\n➡️ 모두 submit 이벤트를 발생시킵니다."
    },
    {
      id: "form-prevent-default",
      section: 7,
      order: 6,
      type: 0,
      title: "event.preventDefault()는 왜 필요할까요?",
      exp: 20,
      isComplete: false,
      content: "form의 submit 이벤트가 발생하면\n브라우저는 기본적으로 **페이지를 새로고침**합니다.\n\n하지만 React 앱에서는 이 동작을 원하지 않습니다.\n\n---\n\n### 그래서 사용하는 코드\n```jsx\nconst handleSubmit = (e) => {\n  e.preventDefault();\n};\n```\n\n---\n\n### 🧠 의미 정리\n\n `preventDefault()`\n→ 브라우저의 기본 동작을 막는다\n\n> 📌 Todo 앱에서 이 코드가 없다면\n> 버튼을 누를 때마다 화면이 새로고침됩니다.\n\nForm 이벤트에서 **거의 항상 함께 사용되는 필수 코드**입니다."
    },
    {
      id: "form-submit-example",
      section: 7,
      order: 7,
      type: 0,
      title: "입력 + 제출 전체 흐름 예제",
      exp: 25,
      isComplete: false,
      content: "지금까지 배운 내용을 한 번에 연결해봅시다.\n\n---\n\n### 전체 예제 코드\n```jsx\nfunction SimpleForm() {\n  const [text, setText] = useState('');\n\n  const handleChange = (e) => {\n    setText(e.target.value);\n  };\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log(text);\n    setText('');\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={text} onChange={handleChange} />\n      <button>확인</button>\n    </form>\n  );\n}\n```\n\n---\n\n### 🔄 실행 흐름\n\n- 입력 → onChange → State 저장\n- 제출 → onSubmit → preventDefault\n- 입력값 사용 → State 초기화\n\n> 이 패턴이 **Todo 입력의 기본 뼈대**가 됩니다."
    },
    {
      id: "quiz-form-onchange",
      section: 7,
      order: 8,
      type: 1,
      title: "input 이벤트 퀴즈",
      exp: 20,
      isComplete: false,
      question: "input의 값이 바뀔 때 실행되는 React 이벤트는 무엇인가요?",
      options: ["onClick", "onSubmit", "onChange", "onInput"],
      correctAnswerIndex: 2
    },
    {
      id: "quiz-form-prevent",
      section: 7,
      order: 9,
      type: 2,
      title: "Form 이벤트 단답 퀴즈",
      exp: 25,
      isComplete: false,
      question: "form 제출 시 브라우저의 기본 동작(새로고침)을 막기 위해 호출하는 메서드는 무엇인가요?",
      correctAnswer: "preventDefault"
    },
    {
      id: "form-summary-review",
      section: 7,
      order: 10,
      type: 0,
      title: "Section7 마무리: Form 이벤트 정리",
      exp: 15,
      isComplete: false,
      content: "이번 Section에서는\nReact에서 **Form 이벤트**를 다루는 방법을 배웠습니다.\n\n---\n\n### ✅ 핵심 요약\n\n- input 값은 **State로 관리**합니다\n- 입력 변화는 **onChange**로 처리합니다\n- form 제출은 **onSubmit** 이벤트를 사용합니다\n- submit 시에는 반드시 **preventDefault**()를 호출합니다\n\n---\n\n### 🎯 지금 여러분이 할 수 있는 것\n\n- 입력값을 State로 관리할 수 있습니다\n- form 제출 시 새로고침을 막을 수 있습니다\n- Todo 입력 흐름을 이해할 준비가 되었습니다\n\n---\n\n이제 다음 Section에서는\n지금까지 배운 모든 내용을 종합해\n**Todo-List 프로젝트를 직접 만들어보겠습니다.**\n\n준비되셨나요? 💪"
    },
    {
      id: "todo-intro-structure",
      section: 8,
      order: 1,
      title: "Todo 프로젝트 시작 & 구조 살펴보기",
      type: 0,
      exp: 15,
      isComplete: false,
      content: "이번 섹션에서는 **Todo List 앱을 처음부터 직접 만들어봅니다.**\n\n---\n\n### 📁 프로젝트 진행 방식\n\n- 모든 작업은 **App.tsx 하나에서 시작**합니다.\n- 처음에는 컴포넌트를 나누지 않습니다.\n- 기능이 완성된 후, 점진적으로 컴포넌트로 분리합니다.\n\n---\n\n### 🧭 앞으로 만들 흐름 미리보기\n\n```\nApp.tsx\n ├─ 입력 폼\n ├─ Todo 리스트\n └─ Todo 아이템\n```\n\n지금은 하나의 파일이지만,\n점점 역할별로 나누면서 **왜 컴포넌트가 필요한지** 직접 느끼게 될 것입니다.\n\n> 💡 스타일(CSS)은 이번 강의에서 다루지 않습니다.\n> 기능과 구조에만 집중하세요."
    },
    {
      id: "todo-state-init",
      section: 8,
      order: 2,
      title: "Todo 리스트 상태 만들기",
      type: 0,
      exp: 20,
      isComplete: false,
      content: "가장 먼저 Todo 목록을 저장할 **state**를 만들어봅니다.\n\n---\n\n### 🧠 Todo 데이터 구조\n\nTodo 하나는 다음 정보를 가집니다.\n- id: 고유 값\n- text: 할 일 내용\n\n```jsx\nconst [todos, setTodos] = useState([\n  { id: 1, text: '리액트 공부하기' },\n  { id: 2, text: 'Todo 앱 만들기' },\n]);\n```\n\n---\n\n### 📌 포인트\n- 배열 형태의 state\n- 객체를 요소로 가지는 리스트\n\n> 이 구조는 이후 삭제, 추가 기능에서 계속 사용됩니다."
    },
    {
      id: "todo-render-list",
      section: 8,
      order: 3,
      title: "Todo 리스트 화면에 출력하기",
      type: 0,
      exp: 20,
      isComplete: false,
      content: "이제 Todo 리스트를 화면에 출력해봅니다.\n\n---\n\n### 🔁 map으로 리스트 렌더링\n\n```jsx\n<ul>\n  {todos.map((todo) => (\n    <li key={todo.id}>{todo.text}</li>\n  ))}\n</ul>\n```\n\n---\n\n### 📌 체크 포인트\n- map 함수 사용\n- key는 todo.id\n\n> 이제 화면에 여러 Todo 항목이 보일 것입니다."
    },
    {
      id: "todo-input-state",
      section: 8,
      order: 4,
      title: "입력 폼과 입력 상태 만들기",
      type: 0,
      exp: 20,
      isComplete: false,
      content: "Todo를 추가하기 위해 입력창과 입력값을 저장할 state를 만듭니다.\n\n---\n\n```jsx\nconst [input, setInput] = useState('');\n```\n\n```jsx\n<input\n  value={input}\n  onChange={(e) => setInput(e.target.value)}\n/>\n```\n\n---\n\n### 📌 핵심\n- input은 **제어 컴포넌트**\n- 입력값은 항상 state로 관리\n\n> 이 구조는 React 폼 처리의 기본입니다."
    },
    {
      id: "todo-submit-add",
      section: 8,
      order: 5,
      title: "폼 제출로 Todo 추가하기",
      type: 0,
      exp: 25,
      isComplete: false,
      content: "이제 입력한 값을 Todo 리스트에 추가해봅니다.\n\n---\n\n```jsx\nconst onSubmit = (e) => {\n  e.preventDefault();\n\n  const newTodo = {\n    id: Date.now(),\n    text: input,\n  };\n\n  setTodos([...todos, newTodo]);\n  setInput('');\n};\n```\n\n```jsx\n<form onSubmit={onSubmit}>\n  <input ... />\n  <button>추가</button>\n</form>\n```\n\n---\n\n### ✅ 결과\n- 입력 → 제출 → 리스트 추가\n- 기본 Todo List 완성 🎉"
    },
    {
      id: "todo-split-components",
      section: 8,
      order: 6,
      title: "심화 1: 컴포넌트로 분리해보기",
      type: 0,
      exp: 20,
      isComplete: false,
      content: "이제 코드가 길어졌습니다.\n역할별로 컴포넌트를 나눠봅니다.\n\n---\n\n### ✂️ 분리 대상\n- TodoForm\n- TodoList\n\n```jsx\n<TodoForm />\n<TodoList />\n```\n\n> ⚠️ 이 단계에서는 **아직 props를 전달하지 않습니다.**\n> 에러가 발생하는 것이 정상입니다."
    },
    {
      id: "todo-error-why",
      section: 8,
      order: 7,
      title: "심화 2: 왜 에러가 발생할까요?",
      type: 0,
      exp: 25,
      isComplete: false,
      content: "컴포넌트로 옮긴 후 이런 에러가 발생할 수 있습니다.\n\n> ❌ todos가 정의되지 않았습니다\n\n---\n\n### 🧠 이유 분석\n- state는 App.tsx에 있음\n- 자식 컴포넌트는 해당 값을 모름\n\n> 해결 방법은 단 하나,\n> **부모가 자식에게 데이터를 내려주는 것**입니다."
    },
    {
      id: "todo-pass-props",
      section: 8,
      order: 8,
      title: "심화 3: Props로 문제 해결하기",
      type: 0,
      exp: 25,
      isComplete: false,
      content: "App.tsx에서 자식 컴포넌트로 props를 전달합니다.\n\n---\n\n```jsx\n<TodoForm\n  input={input}\n  setInput={setInput}\n  onSubmit={onSubmit}\n/>\n\n<TodoList todos={todos} />\n```\n\n---\n\n### 📌 핵심 정리\n- state는 부모가 관리\n- 자식은 props로 사용\n- 데이터 흐름은 항상 **위 → 아래**"
    },
    {
      id: "todo-delete-filter",
      section: 8,
      order: 9,
      title: "심화 4: filter로 Todo 삭제하기",
      type: 0,
      exp: 30,
      isComplete: false,
      content: "각 Todo에 삭제 버튼을 추가해봅니다.\n\n---\n\n```jsx\nconst onDelete = (id) => {\n  setTodos(todos.filter((todo) => todo.id !== id));\n};\n```\n\n```jsx\n<button onClick={() => onDelete(todo.id)}>삭제</button>\n```\n\n---\n\n### 🧠 이 단계에서 배운 것\n- 배열 불변성 유지\n- filter를 이용한 삭제\n- 함수 props 패턴"
    },
    {
      id: "todo-section8-summary",
      section: 8,
      order: 10,
      title: "Section 8 마무리: Todo 앱 완성",
      type: 0,
      exp: 20,
      isComplete: false,
      content: "🎉 축하합니다!\n\n이번 섹션에서 여러분은 **Todo List 앱을 처음부터 끝까지 직접 만들었습니다.**\n\n---\n\n### ✅ 완성한 기능\n- Todo 목록 출력\n- 입력 & 추가\n- 컴포넌트 분리\n- props로 데이터 전달\n- filter로 삭제 처리\n\n---\n\n### 🧠 핵심 메시지\n\n> React는\n> **작은 컴포넌트와 명확한 데이터 흐름**으로\n> 하나의 앱을 만들어갑니다.\n\n이제 여러분은\nReact 앱의 기본 골자를 정확히 이해했습니다 👏"
    },
    {
      title: "useEffect: 컴포넌트의 탄생과 죽음",
      content: "**useEffect**는 컴포넌트가 처음 화면에 나타날 때 실행할 코드를 작성하는 곳입니다.\n\n```jsx\nuseEffect(() => {\n  console.log('앱이 실행되었습니다!');\n}, []);\n```\n\n서버 통신, 타이머 설정 등\n사이드 이펙트를 처리할 때 사용합니다.",
      section: 9,
      type: 0,
      id: "bonus-useeffect-lifecycle",
      isComplete: false,
      exp: 20,
      order: 1
    }
  ]
);
const contentsQueryAtom = atom(mockContents);
atom(0);
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function Popover({
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Root, { "data-slot": "popover", ...props });
}
function PopoverTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    PopoverPrimitive.Content,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      ),
      ...props
    }
  ) });
}
function Avatar({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Root,
    {
      "data-slot": "avatar",
      className: cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      ),
      ...props
    }
  );
}
function AvatarFallback({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Fallback,
    {
      "data-slot": "avatar-fallback",
      className: cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      ),
      ...props
    }
  );
}
const deleteImageByUrl = async (imageUrl) => {
  const imageRef = ref(storage, imageUrl);
  await deleteObject(imageRef);
};
const getPosts = async (currentUserId, postOrder = "new") => {
  const postsCollection = collection(firestore, "posts");
  const q = query(postsCollection, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const posts = [];
  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    const likesSnapshot = await getDocs(collection(docSnap.ref, "likes"));
    const likedUserIds = likesSnapshot.docs.map((likeDoc) => likeDoc.id);
    posts.push({
      id: docSnap.id,
      title: data.title,
      content: data.content,
      projectLink: data.projectLink,
      imageUrl: data.imageUrl,
      likeCount: data.likeCount || likedUserIds.length,
      name: data.name,
      createdAt: data.createdAt.toDate(),
      isLiked: currentUserId ? likedUserIds.includes(currentUserId) : false,
      userId: data.userId
    });
  }
  if (postOrder === "new") {
    posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } else if (postOrder === "popular") {
    posts.sort((a, b) => b.likeCount - a.likeCount);
  }
  return posts;
};
const addPost = async (post, userId) => {
  const newPost = {
    ...post,
    userId,
    createdAt: Timestamp.now(),
    likeCount: 0
  };
  const docRef = await addDoc(collection(firestore, "posts"), newPost);
  return {
    ...newPost,
    id: docRef.id,
    likeCount: 0,
    isLiked: false
  };
};
const updatePost = async (id, prevPost, post) => {
  const postRef = doc(firestore, "posts", id);
  if (prevPost.imageUrl && post.imageUrl !== prevPost.imageUrl) {
    try {
      await deleteImageByUrl(prevPost.imageUrl);
    } catch (e) {
      console.warn("기존 이미지 삭제 실패", e);
    }
  }
  await updateDoc(postRef, post);
};
const deletePost = async (post) => {
  if (post.imageUrl) {
    try {
      await deleteImageByUrl(post.imageUrl);
    } catch (e) {
      console.warn("이미지 삭제 실패", e);
    }
  }
  const postRef = doc(firestore, "posts", post.id);
  await deleteDoc(postRef);
};
const likePost = async (postId, userId) => {
  if (!userId) return;
  const postRef = doc(firestore, "posts", postId);
  const likeRef = doc(collection(postRef, "likes"), userId);
  const likeSnapshot = await getDoc(likeRef);
  const postSnapshot = await getDoc(postRef);
  if (!postSnapshot.exists()) return;
  const data = postSnapshot.data();
  let likeCount = data.likeCount || 0;
  if (!likeSnapshot.exists()) {
    await setDoc(likeRef, { createdAt: Timestamp.now() });
    likeCount++;
  } else {
    await deleteDoc(likeRef);
    likeCount--;
  }
  await updateDoc(postRef, { likeCount });
};
const refetchAtom = atom(0);
const postOrderAtom = atom("new");
const MAX_FILE_SIZE = 0.5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const postsAtom = atomWithQuery((get) => ({
  queryKey: [
    "posts",
    get(postOrderAtom),
    get(refetchAtom),
    get(currentUserAtom)
  ],
  queryFn: async ({ queryKey }) => {
    const [, postOrder, , currentUser] = queryKey;
    const posts = await getPosts(currentUser?.uid, postOrder);
    return posts;
  }
}));
const branzeBadge = "/react_leaning/assets/bronze-B42Ok8GS.png";
const silverBadge = "/react_leaning/assets/silver-BqgWu_5d.png";
const goldBadge = "/react_leaning/assets/gold-CoW9W6W-.png";
const platinumBadge = "/react_leaning/assets/platinum-CuV9BZUp.png";
const diamondBadge = "/react_leaning/assets/diamond-Cm62xbzR.png";
const getFirstContentId = (contentList) => {
  if (contentList.length === 0) return null;
  return contentList[0].id;
};
const getLastContentId = (contentList) => {
  if (contentList.length === 0) return null;
  return contentList[contentList.length - 1].id;
};
const getNextContentId = (contentList, currentId) => {
  const currentLesson = contentList.find((item) => item.id === currentId);
  if (!currentLesson) return null;
  const sameSectionNextLesson = contentList.find(
    (item) => item.section === currentLesson.section && item.order === currentLesson.order + 1
  );
  if (sameSectionNextLesson) return sameSectionNextLesson.id;
  const nextSectionFirstLesson = contentList.find(
    (item) => item.section === currentLesson.section + 1 && item.order === 1
  );
  if (nextSectionFirstLesson) return nextSectionFirstLesson.id;
  return null;
};
const getPreviousContentId = (contentList, currentId) => {
  const currentLesson = contentList.find((item) => item.id === currentId);
  if (!currentLesson) return null;
  const sameSectionPrevLesson = contentList.find(
    (item) => item.section === currentLesson.section && item.order === currentLesson.order - 1
  );
  if (sameSectionPrevLesson) return sameSectionPrevLesson.id;
  const prevSectionLessons = contentList.filter((item) => item.section === currentLesson.section - 1).sort((a, b) => b.order - a.order);
  if (prevSectionLessons.length > 0) return prevSectionLessons[0].id;
  return null;
};
const mappingTitlebySection = (section) => {
  switch (section) {
    case 1:
      return "Section 1 : What is React?";
    case 2:
      return "Section 2 : Basic React Concepts";
    case 3:
      return "Section 3 : State";
    case 4:
      return "Section 4 : Props";
    case 5:
      return "Section 5 : Events";
    case 6:
      return "Section 6 : Lists / Objects";
    case 7:
      return "Section 7 : Forms";
    case 8:
      return "Section 8 : Todo List Project";
    case 9:
      return "*Bonus : Lifecycle";
    default:
      return "";
  }
};
const groupContentBySection = (contentList) => {
  const groupedBySection = Object.values(
    contentList.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    }, {})
  );
  groupedBySection.forEach((sectionArray) => {
    sectionArray.sort((a, b) => a.order - b.order);
  });
  return groupedBySection;
};
const isCompleteCourse = (content, currentUser) => {
  if (!currentUser) return false;
  return currentUser.contentStatus.has(content.id);
};
const checkShortAnswer = (correctAnswerString, userAnswer) => {
  const possibleAnswers = correctAnswerString.split(",,").map((ans) => ans.trim().toLowerCase());
  const normalizedUserAnswer = userAnswer.trim().toLowerCase();
  const isCorrect = possibleAnswers.some((ans) => ans === normalizedUserAnswer);
  const firstCorrectAnswer = possibleAnswers[0] || "";
  return { isCorrect, firstCorrectAnswer };
};
const validateImageFile = (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "JPEG, PNG, WEBP 形式の画像のみアップロード可能です。";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "画像のサイズは5MB以下でなければなりません。";
  }
  return null;
};
const getUserMedal = (grade) => {
  switch (grade) {
    case "Bronze":
      return branzeBadge;
    case "Silver":
      return silverBadge;
    case "Gold":
      return goldBadge;
    case "Platinum":
      return platinumBadge;
    case "Diamond":
      return diamondBadge;
    default:
      return "";
  }
};
const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
const logout = () => {
  return signOut(auth);
};
const store$1 = getDefaultStore();
let authListenerInitialized = false;
function initAuthListener() {
  if (authListenerInitialized) return;
  authListenerInitialized = true;
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const profile = await getUserProfile(firebaseUser.uid);
      store$1.set(currentUserAtom, profile);
    } else {
      store$1.set(currentUserAtom, null);
    }
    store$1.set(authLoadingAtom, false);
  });
}
function HeaderMenu() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const contents2 = useAtomValue(contentsQueryAtom);
  const handleClickNavigate = (path) => {
    navigate(`/${path}`);
  };
  const handleClickSignOut = () => {
    if (confirm("ログアウトしますか？")) {
      logout();
      setCurrentUser(null);
      navigate("/login");
    }
  };
  return /* @__PURE__ */ jsxs(Popover, { children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx("div", { className: "fixed top-3 right-8 w-10 h-10 z-50", children: /* @__PURE__ */ jsx(Avatar, { className: cn("w-10 h-10 cursor-pointer border-4"), children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-black text-white select-none", children: /* @__PURE__ */ jsx("span", { className: "", children: currentUser?.name ? currentUser?.name.charAt(0).toUpperCase() : "?" }) }) }) }) }),
    /* @__PURE__ */ jsxs(PopoverContent, { className: "flex flex-col gap-4 items-center justify-center w-12", children: [
      /* @__PURE__ */ jsx(
        House,
        {
          className: "cursor-pointer",
          onClick: () => handleClickNavigate("")
        }
      ),
      /* @__PURE__ */ jsx(
        BookOpen,
        {
          className: "cursor-pointer",
          onClick: () => {
            const firstContentId = getFirstContentId(contents2 ?? []);
            handleClickNavigate(`contents/${firstContentId}`);
          }
        }
      ),
      /* @__PURE__ */ jsx(
        UsersRound,
        {
          className: `${currentUser?.authority === "user" ? "hidden" : ""} cursor-pointer`,
          onClick: () => handleClickNavigate("users")
        }
      ),
      /* @__PURE__ */ jsx(
        MessagesSquare,
        {
          className: "cursor-pointer",
          onClick: () => handleClickNavigate("community")
        }
      ),
      /* @__PURE__ */ jsx(LogOut, { className: "cursor-pointer", onClick: handleClickSignOut }),
      /* @__PURE__ */ jsx(Link, { to: "/test", className: "mt-2 text-sm text-gray-500", children: "TEST" }),
      currentUser && /* @__PURE__ */ jsx(
        "img",
        {
          src: getUserMedal(currentUser.grade),
          alt: "user medal",
          className: "min-w-40 h-20 absolute -bottom-20"
        }
      )
    ] })
  ] });
}
const confirmAtom = atom({
  open: false,
  options: {
    message: "",
    icon: 0,
    size: "sm"
  }
});
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(AlertDialogPrimitive.Root, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(AlertDialogPrimitive.Portal, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Overlay,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsx(
      AlertDialogPrimitive.Content,
      {
        "data-slot": "alert-dialog-content",
        "data-size": size,
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className
      ),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Title,
    {
      "data-slot": "alert-dialog-title",
      className: cn(
        "text-lg font-semibold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className
      ),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Description,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(Button, { variant, size, asChild: true, children: /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Action,
    {
      "data-slot": "alert-dialog-action",
      className: cn(className),
      ...props
    }
  ) });
}
function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(Button, { variant, size, asChild: true, children: /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Cancel,
    {
      "data-slot": "alert-dialog-cancel",
      className: cn(className),
      ...props
    }
  ) });
}
function CommonAlert() {
  const [confirmContent, setConfirmContent] = useAtom(confirmAtom);
  const handleClose = async (result) => {
    if (confirmContent.resolver) {
      confirmContent.resolver(result);
    }
    setConfirmContent({ ...confirmContent, open: false });
  };
  return /* @__PURE__ */ jsx(AlertDialog, { open: confirmContent.open, children: /* @__PURE__ */ jsxs(AlertDialogContent, { size: confirmContent.options.size, children: [
    /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
      /* @__PURE__ */ jsx(AlertDialogTitle, { children: confirmContent.options.icon === 0 ? /* @__PURE__ */ jsx(Info, {}) : confirmContent.options.icon === 1 ? /* @__PURE__ */ jsx(TriangleAlert, {}) : /* @__PURE__ */ jsx(Ban, {}) }),
      /* @__PURE__ */ jsx(AlertDialogDescription, { children: confirmContent.options.message })
    ] }),
    /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
      /* @__PURE__ */ jsx(AlertDialogAction, { onClick: () => handleClose(true), children: "OK" }),
      /* @__PURE__ */ jsx(AlertDialogCancel, { onClick: () => handleClose(false), children: "Cancel" })
    ] })
  ] }) });
}
function Spinner({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    LoaderIcon,
    {
      role: "status",
      "aria-label": "Loading",
      className: cn("size-36 animate-spin opacity-50", className),
      ...props
    }
  );
}
function BackgroundSpinner() {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
      ),
      children: /* @__PURE__ */ jsx(Spinner, {})
    }
  );
}
const links = () => [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com"
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  // Inter
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  },
  // Google Sans
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap"
  }
];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  const loading = useAtomValue(authLoadingAtom);
  const currentUser = useAtomValue(currentUserAtom);
  useEffect(() => {
    initAuthListener();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsx(BackgroundSpinner, {});
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "relative",
    children: [currentUser && /* @__PURE__ */ jsx(HeaderMenu, {}), /* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(CommonAlert, {})]
  });
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
const buttonGroupVariants = cva(
  "flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>*]:focus-visible:relative [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md has-[>[data-slot=button-group]]:gap-2",
  {
    variants: {
      orientation: {
        horizontal: "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical: "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none"
      }
    },
    defaultVariants: {
      orientation: "horizontal"
    }
  }
);
function ButtonGroup({
  className,
  orientation,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "group",
      "data-slot": "button-group",
      "data-orientation": orientation,
      className: cn(buttonGroupVariants({ orientation }), className),
      ...props
    }
  );
}
function HomeSelectCourse() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const courseOptions = ["Beginner", "Intermediate", "Advanced"];
  const [selectedCourse, setSelectedCourse] = useState(
    currentUser?.course
  );
  const handleClickChangeCourse = async () => {
    if (!currentUser) return;
    if (confirm(`コースを「${selectedCourse}」に変更しますか？`)) {
      try {
        await updateUserCourse(currentUser.uid, selectedCourse);
        setCurrentUser({ ...currentUser, course: selectedCourse });
        alert("コースが変更されました");
      } catch (error) {
        console.error("Failed to update course:", error);
        alert("コースの変更に失敗しました。");
      }
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ButtonGroup, { orientation: "vertical", className: "my-4 gap-1", children: courseOptions.map((course, index) => /* @__PURE__ */ jsx(
      Button,
      {
        variant: selectedCourse === course ? "default" : "outline",
        onClick: () => setSelectedCourse(course),
        disabled: index === 1 || index === 2,
        children: course === "Beginner" ? "Beginner - 初心者コース" : course === "Intermediate" ? "Intermediate - 中級者コース（準備中）" : "Advanced - 上級者コース（準備中）"
      },
      course
    )) }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: handleClickChangeCourse, disabled: true, children: "変更" })
  ] });
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function CardFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-footer",
      className: cn("flex items-center px-6 [.border-t]:pt-6", className),
      ...props
    }
  );
}
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    ScrollAreaPrimitive.Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          ScrollAreaPrimitive.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsx(ScrollBar, {}),
        /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    ScrollAreaPrimitive.ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        ScrollAreaPrimitive.ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
const noticeAtom = atomWithQuery((get) => ({
  queryKey: ["notice", get(refetchAtom), get(currentUserAtom)],
  queryFn: async ({ queryKey }) => {
    const [, , currentUser] = queryKey;
    if (!currentUser) return null;
    const notice = await getNotices();
    return notice;
  }
}));
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Trigger, { "data-slot": "dialog-trigger", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs(
            DialogPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsx(XIcon, {}),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    CheckboxPrimitive.Root,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        CheckboxPrimitive.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "grid place-content-center text-current transition-none",
          children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-3.5" })
        }
      )
    }
  );
}
const store = getDefaultStore();
function confirm$1(options) {
  return new Promise((resolve) => {
    store.set(confirmAtom, {
      open: true,
      options,
      resolver: resolve
    });
  });
}
function HomeAddNoticeDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [loading, setLoading] = useState(false);
  const setRefetch = useSetAtom(refetchAtom);
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      await confirm$1({
        icon: 1,
        message: "タイトルと内容を入力してください。",
        size: "sm"
      });
      return;
    }
    try {
      setLoading(true);
      await addNotice(title, content, true, isImportant);
      await confirm$1({
        icon: 0,
        message: "お知らせが登録されました。",
        size: "sm"
      });
      setOpen(false);
      setTitle("");
      setContent("");
      setIsImportant(false);
      setRefetch((prev) => prev + 1);
    } catch (e) {
      await confirm$1({
        icon: 2,
        message: "お知らせの登録に失敗しました。",
        size: "sm"
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { size: "sm", children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }) }) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-lg", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "공지사항 작성" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "title", children: "제목" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "title",
              value: title,
              onChange: (e) => setTitle(e.target.value),
              placeholder: "공지 제목을 입력하세요"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "content", children: "내용" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "content",
              value: content,
              onChange: (e) => setContent(e.target.value),
              placeholder: "공지 내용을 입력하세요",
              rows: 6
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              id: "important",
              checked: isImportant,
              onCheckedChange: (checked) => setIsImportant(checked === true)
            }
          ),
          /* @__PURE__ */ jsx(Label, { htmlFor: "important", children: "중요 공지" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { onClick: handleSubmit, disabled: loading, children: "등록" }) })
    ] })
  ] });
}
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Alert({
  className,
  variant,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert",
      role: "alert",
      className: cn(alertVariants({ variant }), className),
      ...props
    }
  );
}
function AlertTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-title",
      className: cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      ),
      ...props
    }
  );
}
function HomeNoticeDetail({
  selectedNotice,
  setSelectedNotice
}) {
  const currentUser = useAtomValue(currentUserAtom);
  const setRefetch = useSetAtom(refetchAtom);
  const handleDeleteNotice = async () => {
    if (!selectedNotice) return;
    const ok = await confirm$1({
      icon: 1,
      message: "このお知らせを削除しますか？",
      size: "sm"
    });
    if (!ok) return;
    try {
      await deleteNotice(selectedNotice.id);
      await confirm$1({
        icon: 1,
        message: "お知らせが削除されました。",
        size: "sm"
      }).then(() => {
      });
      await rendingAlert();
      setSelectedNotice(null);
      setRefetch((prev) => prev + 1);
    } catch (e) {
      await confirm$1({
        icon: 0,
        message: "お知らせの削除に失敗しました。",
        size: "sm"
      }).then(() => {
      });
      return;
    }
  };
  const rendingAlert = async () => {
    return /* @__PURE__ */ jsx(Alert, { children: /* @__PURE__ */ jsx(AlertTitle, { children: "お知らせが削除されました。" }) });
  };
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      open: !!selectedNotice,
      onOpenChange: () => setSelectedNotice(null),
      children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-lg", children: selectedNotice && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: selectedNotice.title }) }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-4", children: selectedNotice.createdAt.toLocaleDateString() }),
        /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap text-sm mb-6", children: selectedNotice.content }),
        (currentUser?.authority === "admin" || currentUser?.authority === "instructor") && /* @__PURE__ */ jsxs(DialogFooter, { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => {
                console.log("edit notice");
              },
              children: [
                /* @__PURE__ */ jsx(Pencil, { className: "w-4 h-4 mr-1" }),
                "修正"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "destructive",
              size: "sm",
              onClick: handleDeleteNotice,
              children: [
                /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 mr-1" }),
                "削除"
              ]
            }
          )
        ] })
      ] }) })
    }
  );
}
function HomeNotice() {
  const currentUser = useAtomValue(currentUserAtom);
  const [{ data: notices, isPending }] = useAtom(noticeAtom);
  const [selectedNotice, setSelectedNotice] = useState(null);
  if (isPending) return /* @__PURE__ */ jsx(BackgroundSpinner, {});
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Card, { className: "w-1/3 max-w-1/3", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Notice" }),
        (currentUser?.authority === "admin" || currentUser?.authority === "instructor") && /* @__PURE__ */ jsx(HomeAddNoticeDialog, {})
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(ScrollArea, { className: "h-50 pr-4", children: /* @__PURE__ */ jsxs("ul", { className: "space-y-3", children: [
        notices?.map((notice) => /* @__PURE__ */ jsxs(
          "li",
          {
            onClick: () => setSelectedNotice(notice),
            className: "cursor-pointer rounded-md border p-3 hover:bg-muted",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                notice.isImportant && /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "중요" }),
                notice.isNew && /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "NEW" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: notice.title }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: notice.createdAt.toLocaleDateString() })
            ]
          },
          notice.id
        )),
        notices?.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground text-center py-10", children: "등록된 공지사항이 없습니다." })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx(
      HomeNoticeDetail,
      {
        selectedNotice,
        setSelectedNotice
      }
    )
  ] });
}
const H1_STYLE = "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance";
const H2_STYLE = "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0";
const H3_STYLE = "scroll-m-20 text-2xl font-semibold tracking-tight";
const SEPERATOR_STYLE = "my-8 max-w-1/3";
function meta({}) {
  return [{
    title: "React Learning by Ryan"
  }, {
    name: "React Learning",
    content: "Welcome to React Learning App!"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  const navigate = useNavigate();
  const currentUser = useAtomValue(currentUserAtom);
  const contents2 = useAtomValue(contentsQueryAtom);
  const handleClick = () => {
    if (contents2) {
      const firstContentId = getFirstContentId(contents2);
      if (firstContentId) {
        navigate(`/contents/${firstContentId}`);
      }
    }
  };
  if (!currentUser) {
    return /* @__PURE__ */ jsx(Navigate, {
      to: "/login",
      replace: true
    });
  }
  if (!contents2) {
    return /* @__PURE__ */ jsx("main", {
      className: "p-8 flex flex-col justify-center items-center gap-2",
      children: /* @__PURE__ */ jsx("p", {
        children: "コンテンツを読み込み中..."
      })
    });
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "p-8 flex flex-col justify-center items-center gap-2",
    children: [/* @__PURE__ */ jsxs("h1", {
      className: `${H1_STYLE} flex items-center gap-3 tracking-wide`,
      children: [/* @__PURE__ */ jsx(FaReact, {
        id: "react-icon",
        className: "text-blue-600 animate-spin"
      }), /* @__PURE__ */ jsx("span", {
        children: "React Learning"
      })]
    }), /* @__PURE__ */ jsx(Separator, {
      className: SEPERATOR_STYLE
    }), currentUser && /* @__PURE__ */ jsxs(Fragment, {
      children: [/* @__PURE__ */ jsxs("h3", {
        className: `${H3_STYLE}`,
        children: ["ようこそ ", currentUser?.name, "さん!"]
      }), /* @__PURE__ */ jsx(HomeSelectCourse, {})]
    }), /* @__PURE__ */ jsx(Separator, {
      className: SEPERATOR_STYLE
    }), /* @__PURE__ */ jsx(HomeNotice, {}), /* @__PURE__ */ jsx(Separator, {
      className: SEPERATOR_STYLE
    }), /* @__PURE__ */ jsxs(ButtonGroup, {
      className: "gap-2",
      children: [/* @__PURE__ */ jsxs(Button, {
        onClick: handleClick,
        children: [/* @__PURE__ */ jsx(BookOpen, {
          className: "w-4 h-4 mr-2"
        }), /* @__PURE__ */ jsx("span", {
          children: "React学習"
        })]
      }), /* @__PURE__ */ jsxs(Button, {
        onClick: () => navigate("/community"),
        children: [/* @__PURE__ */ jsx(MessagesSquare, {
          className: "w-4 h-4 mr-2"
        }), /* @__PURE__ */ jsx("span", {
          children: "コミュニティ"
        })]
      })]
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(
    void 0
  );
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsx(XIcon, { className: "size-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function SheetDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Description,
    {
      "data-slot": "sheet-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TooltipPrimitive.Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Root, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    TooltipPrimitive.Content,
    {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(TooltipPrimitive.Arrow, { className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    }
  ) });
}
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = React.createContext(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
  }, [isMobile, setOpen, setOpenMobile]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);
  const state = open ? "expanded" : "collapsed";
  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );
  return /* @__PURE__ */ jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-wrapper",
      style: {
        "--sidebar-width": SIDEBAR_WIDTH,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        ...style
      },
      className: cn(
        "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
        className
      ),
      ...props,
      children
    }
  ) }) });
}
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  if (collapsible === "none") {
    return /* @__PURE__ */ jsx(
      "div",
      {
        "data-slot": "sidebar",
        className: cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        ),
        ...props,
        children
      }
    );
  }
  if (isMobile) {
    return /* @__PURE__ */ jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsxs(
      SheetContent,
      {
        "data-sidebar": "sidebar",
        "data-slot": "sidebar",
        "data-mobile": "true",
        className: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
        style: {
          "--sidebar-width": SIDEBAR_WIDTH_MOBILE
        },
        side,
        children: [
          /* @__PURE__ */ jsxs(SheetHeader, { className: "sr-only", children: [
            /* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }),
            /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col", children })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "group peer text-sidebar-foreground hidden md:block",
      "data-state": state,
      "data-collapsible": state === "collapsed" ? collapsible : "",
      "data-variant": variant,
      "data-side": side,
      "data-slot": "sidebar",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "sidebar-gap",
            className: cn(
              "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "sidebar-container",
            className: cn(
              "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
              side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
              // Adjust the padding for floating and inset variants.
              variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
              className
            ),
            ...props,
            children: /* @__PURE__ */ jsx(
              "div",
              {
                "data-sidebar": "sidebar",
                "data-slot": "sidebar-inner",
                className: "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm",
                children
              }
            )
          }
        )
      ]
    }
  );
}
function SidebarTrigger({
  className,
  onClick,
  ...props
}) {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon",
      className: cn("size-7", className),
      onClick: (event) => {
        onClick?.(event);
        toggleSidebar();
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx(PanelLeftIcon, {}),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
}
function SidebarInset({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "main",
    {
      "data-slot": "sidebar-inset",
      className: cn(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      ),
      ...props
    }
  );
}
function SidebarHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
}
function SidebarContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      className: cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
}
function SidebarGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      ...props
    }
  );
}
function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "div";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "sidebar-group-label",
      "data-sidebar": "group-label",
      className: cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      ),
      ...props
    }
  );
}
function SidebarGroupContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-group-content",
      "data-sidebar": "group-content",
      className: cn("w-full text-sm", className),
      ...props
    }
  );
}
function SidebarMenu({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "ul",
    {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      className: cn("flex w-full min-w-0 flex-col gap-1", className),
      ...props
    }
  );
}
function SidebarMenuItem({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "li",
    {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      className: cn("group/menu-item relative", className),
      ...props
    }
  );
}
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();
  const button = /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      ...props
    }
  );
  if (!tooltip) {
    return button;
  }
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip
    };
  }
  return /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: button }),
    /* @__PURE__ */ jsx(
      TooltipContent,
      {
        side: "right",
        align: "center",
        hidden: state !== "collapsed" || isMobile,
        ...tooltip
      }
    )
  ] });
}
function Progress({
  className,
  value,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    ProgressPrimitive.Root,
    {
      "data-slot": "progress",
      className: cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        ProgressPrimitive.Indicator,
        {
          "data-slot": "progress-indicator",
          className: "h-full w-full flex-1 transition-all bg-blue-400",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
    }
  );
}
function AppSidebar() {
  const lectureId = useParams().id;
  const sideBarItemRef = useRef(null);
  const currentUser = useAtomValue(currentUserAtom);
  const contents2 = useAtomValue(contentsQueryAtom);
  const [progress, setProgress] = useState(0);
  const CONTENT = contents2 ? groupContentBySection(contents2) : [];
  useEffect(() => {
    const contentLength = contents2?.length || 0;
    if (!currentUser || !contents2) return;
    const completedCount = currentUser?.contentStatus?.size || 0;
    const calculatedProgress = Math.floor(
      completedCount / contentLength * 100
    );
    setProgress(calculatedProgress);
  }, [currentUser, contents2]);
  useEffect(() => {
    if (!sideBarItemRef.current) return;
    sideBarItemRef.current.scrollIntoView({
      block: "center",
      behavior: "smooth"
    });
  }, [lectureId]);
  if (!contents2) {
    return /* @__PURE__ */ jsx(Sidebar, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx("p", { children: "ローディング中..." }) });
  }
  return /* @__PURE__ */ jsxs(Sidebar, { className: "", children: [
    /* @__PURE__ */ jsxs(SidebarHeader, { className: "p-4", children: [
      /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-3 text-xl font-bold tracking-tight", children: [
        /* @__PURE__ */ jsx(FaReact, { id: "react-icon", className: "text-blue-600 animate-spin" }),
        /* @__PURE__ */ jsxs("span", { children: [
          currentUser?.course,
          " Class"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Progress, { value: progress, className: "w-full" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
          progress,
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SidebarContent, { children: CONTENT.map((section) => /* @__PURE__ */ jsxs(SidebarGroup, { children: [
      /* @__PURE__ */ jsx(SidebarGroupLabel, { className: "px-2 mb-1 text-blue-400 font-semibold text-sm ", children: mappingTitlebySection(section[0].section) }),
      /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: section.map((content) => /* @__PURE__ */ jsx(
        SidebarMenuItem,
        {
          ref: lectureId === content.id ? sideBarItemRef : null,
          className: "px-2",
          children: /* @__PURE__ */ jsx(Link, { to: `/contents/${content.id}`, children: /* @__PURE__ */ jsxs(
            SidebarMenuButton,
            {
              className: `${lectureId === content.id ? "bg-blue-400 text-white" : ""} `,
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs", children: content.title }),
                /* @__PURE__ */ jsx(
                  Check,
                  {
                    className: `${isCompleteCourse(content, currentUser) ? "block" : "hidden"} ml-auto h-4 w-4 text-white bg-blue-400 rounded-full`
                  }
                )
              ]
            }
          ) })
        },
        content.id
      )) }) })
    ] }, `section${section[0].section}`)) })
  ] });
}
function ContentFooter() {
  const lectureId = useParams().id;
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const contents2 = useAtomValue(contentsQueryAtom);
  if (!contents2) {
    return null;
  }
  const handleClickFirst = () => {
    const firstContentId = getFirstContentId(contents2);
    if (firstContentId) navigate(`/contents/${firstContentId}`);
  };
  const handleClickPrevious = () => {
    const prevContentId = getPreviousContentId(contents2, lectureId ?? "");
    if (prevContentId) navigate(`/contents/${prevContentId}`);
  };
  const handleClickNext = () => {
    const nextContentId = getNextContentId(contents2, lectureId ?? "");
    if (nextContentId) navigate(`/contents/${nextContentId}`);
  };
  const handleClickLast = () => {
    const lastContentId = getLastContentId(contents2);
    if (lastContentId) navigate(`/contents/${lastContentId}`);
  };
  const handleClickComplete = async () => {
    if (!currentUser || !lectureId) return;
    try {
      const contentStatusDocRef = doc(
        firestore,
        "users",
        currentUser.uid,
        "contentStatus",
        lectureId
      );
      await setDoc(contentStatusDocRef, {
        createdAt: serverTimestamp()
      });
      const updatedContentStatus = new Set(currentUser.contentStatus).add(
        lectureId
      );
      setCurrentUser({
        ...currentUser,
        contentStatus: updatedContentStatus
      });
      alert("このレクチャーを完了しました！");
    } catch (error) {
      console.error("Error completing lecture:", error);
      alert("レクチャーの完了に失敗しました。");
    }
  };
  const isCompleted = lectureId && currentUser?.contentStatus?.has(lectureId) ? true : false;
  const hasPrevious = !!getPreviousContentId(contents2, lectureId ?? "");
  const hasNext = !!getNextContentId(contents2, lectureId ?? "");
  return /* @__PURE__ */ jsx(ButtonGroup, { children: /* @__PURE__ */ jsxs(ButtonGroup, { className: "flex", children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        size: "icon",
        "aria-label": "Go First",
        disabled: !hasPrevious,
        onClick: handleClickFirst,
        children: /* @__PURE__ */ jsx(ChevronsLeft, {})
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        size: "icon",
        "aria-label": "Go Previous",
        disabled: !hasPrevious,
        onClick: handleClickPrevious,
        children: /* @__PURE__ */ jsx(ChevronLeft, {})
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        size: "icon",
        "aria-label": "Complete",
        onClick: handleClickComplete,
        disabled: isCompleted,
        children: /* @__PURE__ */ jsx(Check, {})
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        size: "icon",
        "aria-label": "Go Next",
        disabled: !hasNext,
        onClick: handleClickNext,
        children: /* @__PURE__ */ jsx(ChevronRight, {})
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        size: "icon",
        "aria-label": "Go Forward",
        disabled: !hasNext,
        onClick: handleClickLast,
        children: /* @__PURE__ */ jsx(ChevronsRight, {})
      }
    )
  ] }) });
}
function FieldSet({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "fieldset",
    {
      "data-slot": "field-set",
      className: cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      ),
      ...props
    }
  );
}
function FieldLegend({
  className,
  variant = "legend",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "legend",
    {
      "data-slot": "field-legend",
      "data-variant": variant,
      className: cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
        className
      ),
      ...props
    }
  );
}
const fieldVariants = cva(
  "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        ],
        responsive: [
          "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        ]
      }
    },
    defaultVariants: {
      orientation: "vertical"
    }
  }
);
function Field({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "group",
      "data-slot": "field",
      "data-orientation": orientation,
      className: cn(fieldVariants({ orientation }), className),
      ...props
    }
  );
}
function FieldLabel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Label,
    {
      "data-slot": "field-label",
      className: cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        className
      ),
      ...props
    }
  );
}
function FieldDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "p",
    {
      "data-slot": "field-description",
      className: cn(
        "text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      ),
      ...props
    }
  );
}
function RadioGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Root,
    {
      "data-slot": "radio-group",
      className: cn("grid gap-3", className),
      ...props
    }
  );
}
function RadioGroupItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    {
      "data-slot": "radio-group-item",
      className: cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        RadioGroupPrimitive.Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "relative flex items-center justify-center",
          children: /* @__PURE__ */ jsx(CircleIcon, { className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" })
        }
      )
    }
  );
}
const userAnswersAtom = atom("");
const isSubmittedAtom = atom(false);
const isCorrectAtom = atom(false);
const showFeedbackAtom = atom(false);
const displayedCorrectAnswerAtom = atom("");
function ContentQuiz({
  quiz,
  onQuizComplete
}) {
  const [userAnswer, setUserAnswer] = useAtom(userAnswersAtom);
  const [isSubmitted, setIsSubmitted] = useAtom(isSubmittedAtom);
  const [isCorrect, setIsCorrect] = useAtom(isCorrectAtom);
  const [showFeedback, setShowFeedback] = useAtom(showFeedbackAtom);
  const [displayedCorrectAnswer, setDisplayedCorrectAnswer] = useAtom(
    displayedCorrectAnswerAtom
  );
  const handleAnswerChange = (value) => {
    if (!isSubmitted) {
      setUserAnswer(value);
    }
  };
  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowFeedback(true);
    let correct = false;
    if (quiz.type === 1) {
      const selectedIndex = quiz.options.findIndex(
        (option) => option === userAnswer
      );
      correct = selectedIndex === quiz.correctAnswerIndex;
    } else if (quiz.type === 2) {
      const { isCorrect: shortAnswerCorrect, firstCorrectAnswer } = checkShortAnswer(quiz.correctAnswer, userAnswer);
      correct = shortAnswerCorrect;
      setDisplayedCorrectAnswer(firstCorrectAnswer);
    }
    setIsCorrect(correct);
    if (correct && onQuizComplete) {
      onQuizComplete(quiz.id);
    }
  };
  const handleRetry = () => {
    setUserAnswer("");
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowFeedback(false);
    setDisplayedCorrectAnswer("");
  };
  const isButtonDisabled = !userAnswer || isSubmitted && isCorrect;
  return /* @__PURE__ */ jsxs("div", { children: [
    quiz.type === 1 && /* @__PURE__ */ jsxs(FieldSet, { className: "w-full", children: [
      /* @__PURE__ */ jsx(FieldLegend, { variant: "label", children: "Quiz" }),
      /* @__PURE__ */ jsx(FieldDescription, { children: quiz.question }),
      /* @__PURE__ */ jsx(
        RadioGroup,
        {
          value: userAnswer,
          onValueChange: handleAnswerChange,
          disabled: isSubmitted,
          children: quiz.options.map((option, index) => /* @__PURE__ */ jsxs(Field, { orientation: "horizontal", children: [
            /* @__PURE__ */ jsx(
              RadioGroupItem,
              {
                value: option,
                id: `${quiz.id}-${index}`,
                className: "bg-white"
              }
            ),
            /* @__PURE__ */ jsx(
              FieldLabel,
              {
                htmlFor: `${quiz.id}-${index}`,
                className: cn(
                  "font-normal",
                  showFeedback && isSubmitted && index === quiz.correctAnswerIndex && "text-green-600 font-bold",
                  showFeedback && isSubmitted && !isCorrect && option === userAnswer && "text-red-600"
                ),
                children: option
              }
            )
          ] }, index))
        }
      )
    ] }),
    quiz.type === 2 && /* @__PURE__ */ jsxs(Field, { children: [
      /* @__PURE__ */ jsx(FieldLabel, { htmlFor: `quiz-input-${quiz.id}`, children: quiz.question }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: `quiz-input-${quiz.id}`,
          className: cn(
            "max-w-sm bg-white",
            showFeedback && isSubmitted && isCorrect && "border-green-500",
            showFeedback && isSubmitted && !isCorrect && "border-red-500"
          ),
          type: "text",
          placeholder: "解答を入力してください",
          value: userAnswer,
          onChange: (e) => handleAnswerChange(e.target.value),
          disabled: isSubmitted
        }
      ),
      showFeedback && isSubmitted && !isCorrect && displayedCorrectAnswer && /* @__PURE__ */ jsxs("p", { className: "text-sm text-green-600 mt-1", children: [
        "正解は: ",
        displayedCorrectAnswer
      ] })
    ] }),
    showFeedback && isSubmitted && /* @__PURE__ */ jsx(
      "p",
      {
        className: cn(
          "text-lg font-semibold mt-4",
          isCorrect ? "text-green-600" : "text-red-600"
        ),
        children: isCorrect ? "正解です！" : "残念、不正解です。"
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        className: "mt-4 float-right",
        onClick: isSubmitted && !isCorrect ? handleRetry : handleSubmit,
        disabled: isButtonDisabled,
        children: isSubmitted && !isCorrect ? "再試行" : "提出"
      }
    )
  ] });
}
function Contents({ lectureId, onQuizComplete }) {
  const contents2 = useAtomValue(contentsQueryAtom);
  const [currentContent, setCurrentContent] = useState(null);
  useEffect(() => {
    if (!lectureId || !contents2) return;
    const foundContent = contents2.find((item) => item.id === lectureId);
    setCurrentContent(foundContent ?? null);
  }, [lectureId, contents2]);
  const renderContent = () => {
    if (!currentContent) {
      return /* @__PURE__ */ jsx("p", { children: "No content available for this lecture." });
    }
    switch (currentContent.type) {
      case 0:
        return /* @__PURE__ */ jsx(
          ReactMarkdown,
          {
            remarkPlugins: [remarkGfm],
            components: {
              code({ className, children }) {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  // 코드 (```)
                  /* @__PURE__ */ jsx(
                    Prism,
                    {
                      style: nord,
                      language: match[1],
                      PreTag: "div",
                      children: String(children).replace(/\n$/, "").replace(/\n&nbsp;\n/g, "").replace(/\n&nbsp\n/g, "")
                    }
                  )
                ) : /* @__PURE__ */ jsx(
                  Prism,
                  {
                    style: nord,
                    background: "green",
                    language: "textile",
                    PreTag: "div",
                    children: String(children).replace(/\n$/, "")
                  }
                );
              },
              // 인용문 (>)
              blockquote({ children, ...props }) {
                return /* @__PURE__ */ jsx(
                  "blockquote",
                  {
                    style: {
                      background: "#deeaff",
                      padding: "1px 15px",
                      borderRadius: "10px"
                    },
                    ...props,
                    children
                  }
                );
              },
              img({ ...props }) {
                return /* @__PURE__ */ jsx(
                  "img",
                  {
                    style: { maxWidth: "40vw" },
                    src: props.src?.replace("../../../../public/", "/"),
                    alt: "MarkdownRenderer__Image"
                  }
                );
              },
              em({ children, ...props }) {
                return /* @__PURE__ */ jsx("span", { style: { fontStyle: "italic" }, ...props, children });
              }
            },
            children: currentContent.content.replace(/\n/gi, "\n\n")
          }
        );
      case 1:
      case 2:
        return /* @__PURE__ */ jsx(ContentQuiz, { quiz: currentContent, onQuizComplete });
      default:
        return /* @__PURE__ */ jsx("p", { children: "Unknown content type." });
    }
  };
  return /* @__PURE__ */ jsx(
    Card,
    {
      id: "content-scroll-inner",
      className: "p-8 mb-8 z-0 w-full bg-gray-950/5 shadow-2xl",
      children: renderContent()
    }
  );
}
function GoTopButton() {
  const lectureId = useParams().id;
  const handleClick = () => {
    const scrollView = document.getElementById("contentScroll");
    if (scrollView) {
      scrollView.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };
  useEffect(() => {
    if (!lectureId) return;
    handleClick();
  }, [lectureId]);
  return /* @__PURE__ */ jsx(
    Button,
    {
      className: "rounded-[50%] fixed bottom-8 right-8 p-3 z-50",
      onClick: handleClick,
      children: /* @__PURE__ */ jsx(ArrowUp, {})
    }
  );
}
const migrateContentToFirestore = async () => {
  if (!mockContents || mockContents.length === 0) {
    const message = "No mock data found to migrate.";
    console.error(message);
    alert(message);
    return;
  }
  console.log("Starting content migration to Firestore...");
  try {
    const batch = writeBatch(firestore);
    const contentsCollectionRef = collection(firestore, "contents");
    console.log(`Found ${mockContents.length} content items to migrate.`);
    mockContents.forEach((content) => {
      const docRef = doc(contentsCollectionRef, content.id);
      batch.set(docRef, content);
    });
    await batch.commit();
    const successMessage = "Successfully migrated content data to Firestore!";
    console.log(successMessage);
    alert(successMessage);
  } catch (error) {
    const errorMessage = `Content migration failed: ${error}`;
    console.error(errorMessage);
    alert(errorMessage);
  }
};
const contents = UNSAFE_withComponentProps(function LectureLayout() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const contents2 = useAtomValue(contentsQueryAtom);
  const lectureId = useParams().id;
  const [headerTitle, setHeaderTitle] = useState("");
  const setUserAnswer = useSetAtom(userAnswersAtom);
  const setIsSubmitted = useSetAtom(isSubmittedAtom);
  const setIsCorrect = useSetAtom(isCorrectAtom);
  const setShowFeedback = useSetAtom(showFeedbackAtom);
  const setDisplayedCorrectAnswer = useSetAtom(displayedCorrectAnswerAtom);
  const resetQuizState = () => {
    setUserAnswer("");
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowFeedback(false);
    setDisplayedCorrectAnswer("");
  };
  useEffect(() => {
    if (!lectureId || !contents2) return;
    console.log(contents2);
    const foundContent = contents2.find((item) => item.id === lectureId);
    if (foundContent) {
      setHeaderTitle(foundContent.title);
    }
    resetQuizState();
  }, [lectureId, contents2]);
  const handleQuizCompletion = async (contentId) => {
    if (!currentUser) return;
    try {
      if (currentUser.contentStatus.has(contentId)) {
        console.log(`Content ${contentId} already marked as complete.`);
        return;
      }
      const contentStatusDocRef = doc(firestore, "users", currentUser.uid, "contentStatus", contentId);
      await setDoc(contentStatusDocRef, {
        createdAt: serverTimestamp()
      });
      const updatedContentStatus = new Set(currentUser.contentStatus).add(contentId);
      setCurrentUser({
        ...currentUser,
        contentStatus: updatedContentStatus
      });
      console.log(`Content ${contentId} marked as complete successfully.`);
    } catch (error) {
      console.error("Error marking content as complete:", error);
      alert("コンテンツ完了処理中にエラーが発生しました。");
    }
  };
  if (!currentUser) {
    return /* @__PURE__ */ jsx(Navigate, {
      to: "/login",
      replace: true
    });
  }
  return /* @__PURE__ */ jsx(SidebarProvider, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "relative flex h-screen w-full",
      children: [/* @__PURE__ */ jsx(AppSidebar, {}), /* @__PURE__ */ jsx(SidebarInset, {
        className: "flex flex-1 flex-col",
        children: /* @__PURE__ */ jsxs("div", {
          id: "contentScroll",
          className: "flex-1 max-h-screen",
          children: [/* @__PURE__ */ jsxs("header", {
            className: "sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 z-10 bg-white",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(SidebarTrigger, {}), /* @__PURE__ */ jsx("div", {
                className: "font-semibold",
                children: headerTitle
              })]
            }), /* @__PURE__ */ jsx(Button, {
              onClick: migrateContentToFirestore,
              variant: "outline",
              children: "Migrate Data"
            })]
          }), /* @__PURE__ */ jsx(ScrollArea, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "h-full flex flex-col gap-4 items-center justify-center mx-auto max-w-4xl p-6 md:p-10",
              children: [/* @__PURE__ */ jsx(Contents, {
                lectureId,
                onQuizComplete: handleQuizCompletion
              }), /* @__PURE__ */ jsx(ContentFooter, {})]
            })
          })]
        })
      }), /* @__PURE__ */ jsx(GoTopButton, {})]
    })
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: contents
}, Symbol.toStringTag, { value: "Module" }));
const MAX_IMAGE_SIZE_MB = 0.5;
const ALLOWED_IMAGE_TYPES = ["jpeg", "png", "webp"];
function PostForm({ editPost, onClose, onSave }) {
  const [title, setTitle] = useState(editPost?.title || "");
  const [content, setContent] = useState(editPost?.content || "");
  const [projectLink, setProjectLink] = useState(editPost?.projectLink || "");
  const [imageFile, setImageFile] = useState(null);
  const currentUser = useAtomValue(currentUserAtom);
  const handleSave = async () => {
    if (!title.trim()) {
      await confirm$1({
        icon: 0,
        message: "タイトルを入力してください。",
        size: "sm"
      });
      return;
    }
    let imageUrl;
    if (imageFile) {
      const imageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    } else {
      imageUrl = null;
    }
    onSave({
      title,
      content,
      projectLink,
      imageUrl,
      name: currentUser?.nickname || "Anonymous",
      userId: currentUser?.uid || "Anonymous"
    });
    onClose();
  };
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      await confirm$1({
        icon: 0,
        message: error,
        size: "sm"
      });
      e.target.value = "";
      return;
    }
    setImageFile(file);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "title", children: "タイトル" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "title",
          placeholder: "タイトルを入力してください",
          value: title,
          onChange: (e) => setTitle(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "content", children: "内容" }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          id: "content",
          placeholder: "内容を入力してください",
          value: content,
          onChange: (e) => setContent(e.target.value),
          rows: 4
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "projectLink", children: "プロジェクトリンク" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "projectLink",
          placeholder: "https://",
          value: projectLink,
          onChange: (e) => setProjectLink(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "image", children: "プレビューイメージ" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "image",
          type: "file",
          accept: "image/jpeg,image/png,image/webp",
          onChange: handleFileChange
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx("span", { children: "アップロード制限:" }),
        /* @__PURE__ */ jsxs(Badge, { variant: "secondary", children: [
          MAX_IMAGE_SIZE_MB,
          "MB 以下"
        ] }),
        ALLOWED_IMAGE_TYPES.map((type) => /* @__PURE__ */ jsx(Badge, { variant: "outline", children: type }, type))
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: onClose, children: "キャンセル" }),
      /* @__PURE__ */ jsx(Button, { onClick: handleSave, children: editPost ? "修正" : "保存" })
    ] })
  ] });
}
function Community() {
  const currentUser = useAtomValue(currentUserAtom);
  const setRefetch = useSetAtom(refetchAtom);
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [postOrder, setPostOrder] = useAtom(postOrderAtom);
  const [{
    data: initialPosts,
    isPending,
    isError
  }] = useAtom(postsAtom);
  useEffect(() => {
    if (!initialPosts) return;
    const sortPosts = async () => {
      await Promise.resolve();
      let sortedPosts = [...initialPosts];
      if (postOrder === "new") {
        sortedPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        console.log("Sorted by new:", sortedPosts);
      } else if (postOrder === "popular") {
        sortedPosts.sort((a, b) => b.likeCount - a.likeCount);
      }
      setPosts(sortedPosts);
    };
    sortPosts();
  }, [initialPosts, postOrder]);
  const handleDelete = async (post) => {
    const ok = await confirm$1({
      icon: 1,
      message: "削除しますか？",
      size: "sm"
    });
    if (!ok) return;
    await deletePost(post);
    setRefetch((c) => c + 1);
  };
  const handleSave = async (post) => {
    if (editingPost) {
      await updatePost(editingPost.id, editingPost, post);
    } else {
      await addPost(post, post.userId || "Anonymous");
    }
    setRefetch((c) => c + 1);
  };
  const isNewPost = (post) => {
    const oneWeekAgo = /* @__PURE__ */ new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return post.createdAt >= oneWeekAgo;
  };
  const handleClickLikeButton = async (post) => {
    if (!currentUser) return;
    setPosts((prev) => prev.map((p) => p.id === post.id ? {
      ...p,
      likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1,
      isLiked: !p.isLiked
    } : p));
    try {
      await likePost(post.id, currentUser.uid);
    } catch (err) {
      console.error("Like update failed, reverting:", err);
      setRefetch((c) => c + 1);
    }
  };
  if (isPending) return /* @__PURE__ */ jsx(BackgroundSpinner, {});
  if (!currentUser) {
    return /* @__PURE__ */ jsx(Navigate, {
      to: "/login",
      replace: true
    });
  }
  return (
    /* 전체 배경 + 양옆 여백 */
    /* @__PURE__ */ jsxs("div", {
      className: "min-h-screen w-full bg-muted/40",
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex justify-center",
        children: /* @__PURE__ */ jsxs("main", {
          className: "w-full max-w-xl md:max-w-2xl px-4 py-10 space-y-10",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex justify-between items-center",
            children: [/* @__PURE__ */ jsxs(ButtonGroup, {
              className: "gap-0.5",
              children: [/* @__PURE__ */ jsx(Button, {
                onClick: () => setPostOrder("new"),
                variant: postOrder === "new" ? "default" : "secondary",
                children: "最新"
              }), /* @__PURE__ */ jsx(Button, {
                onClick: () => setPostOrder("popular"),
                variant: postOrder === "popular" ? "default" : "secondary",
                children: "人気"
              })]
            }), /* @__PURE__ */ jsxs(Button, {
              className: "flex items-center gap-2",
              onClick: () => {
                setEditingPost(null);
                setShowForm(true);
              },
              children: [/* @__PURE__ */ jsx(PlusIcon, {
                className: "w-4 h-4"
              }), "ポスト作成"]
            })]
          }), posts.map((post) => /* @__PURE__ */ jsxs(Card, {
            className: "shadow-sm relative",
            children: [/* @__PURE__ */ jsx(CardHeader, {
              children: /* @__PURE__ */ jsxs(CardTitle, {
                className: "text-lg flex justify-between items-center",
                children: [/* @__PURE__ */ jsx("span", {
                  children: post.title
                }), /* @__PURE__ */ jsxs("div", {
                  className: "text-sm flex flex-col items-end space-y-0.5",
                  children: [/* @__PURE__ */ jsx("span", {
                    children: post.name
                  }), /* @__PURE__ */ jsx("span", {
                    children: post.createdAt.toLocaleDateString()
                  })]
                })]
              })
            }), /* @__PURE__ */ jsxs(CardContent, {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: post.content
              }), post.projectLink && /* @__PURE__ */ jsx("a", {
                href: post.projectLink,
                target: "_blank",
                className: "text-sm text-blue-600 underline",
                children: "プロジェクトリンク"
              }), post.imageUrl && /* @__PURE__ */ jsx("div", {
                className: "aspect-video overflow-hidden rounded-md",
                children: /* @__PURE__ */ jsx("img", {
                  src: post.imageUrl,
                  alt: "",
                  className: "h-full w-full object-cover"
                })
              })]
            }), /* @__PURE__ */ jsxs(CardFooter, {
              className: "flex justify-between",
              children: [/* @__PURE__ */ jsxs(Button, {
                variant: "ghost",
                size: "sm",
                className: "flex items-center gap-1",
                onClick: () => handleClickLikeButton(post),
                children: [/* @__PURE__ */ jsx(HeartIcon, {
                  className: "w-4 h-4",
                  fill: post.isLiked ? "red" : "none"
                }), post.likeCount]
              }), (currentUser.authority === "admin" || currentUser.authority === "instructor" || currentUser.uid === post.userId) && /* @__PURE__ */ jsxs("div", {
                className: "flex gap-2",
                children: [/* @__PURE__ */ jsx(Button, {
                  variant: "secondary",
                  size: "sm",
                  onClick: () => {
                    setEditingPost(post);
                    setShowForm(true);
                  },
                  children: "修正"
                }), /* @__PURE__ */ jsx(Button, {
                  variant: "destructive",
                  size: "sm",
                  onClick: () => handleDelete(post),
                  children: "削除"
                })]
              })]
            }), isNewPost(post) && /* @__PURE__ */ jsx(Badge, {
              className: "absolute top-0 left-0 animate-bounce",
              children: "New"
            })]
          }, post.id))]
        })
      }), /* @__PURE__ */ jsx(Dialog, {
        open: showForm,
        onOpenChange: setShowForm,
        children: /* @__PURE__ */ jsxs(DialogContent, {
          children: [/* @__PURE__ */ jsx(DialogHeader, {
            children: /* @__PURE__ */ jsx(DialogTitle, {
              children: editingPost ? "ポスト修正" : "ポスト作成"
            })
          }), /* @__PURE__ */ jsx(PostForm, {
            editPost: editingPost,
            onClose: () => setShowForm(false),
            onSave: handleSave
          })]
        })
      })]
    })
  );
}
const community = UNSAFE_withComponentProps(function CommunityPage() {
  return /* @__PURE__ */ jsx(Community, {});
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: community
}, Symbol.toStringTag, { value: "Module" }));
const settings = UNSAFE_withComponentProps(function Settings() {
  return /* @__PURE__ */ jsx("div", {
    children: "Settings"
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: settings
}, Symbol.toStringTag, { value: "Module" }));
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsx(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function UserForm({ user, onSave, setOpen }) {
  const [name, setName] = useState(user?.name ?? "");
  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [course, setCourse] = useState(user?.course ?? "Beginner");
  const [grade, setGrade] = useState(user?.grade ?? "Bronze");
  const [authority, setAuthority] = useState(
    user?.authority ?? "user"
  );
  const [exp, setExp] = useState(user?.exp ?? 0);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      uid: user?.uid ?? Date.now().toString(),
      name,
      nickname,
      email,
      course,
      grade,
      exp,
      authority,
      contentStatus: user?.contentStatus ?? /* @__PURE__ */ new Set()
    });
    setOpen?.(false);
  };
  return /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-120", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: user ? "Edit User" : "Add User" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: user ? "Update user information." : "Create a new user account." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Name" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "name",
            value: name,
            onChange: (e) => setName(e.target.value),
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "nickname", children: "Nickname" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "nickname",
            value: nickname,
            onChange: (e) => setNickname(e.target.value),
            required: true
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "email",
          type: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "course", children: "Course" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          id: "course",
          className: "w-full h-9 rounded-md border border-input bg-background px-3 text-sm",
          value: course,
          onChange: (e) => setCourse(e.target.value),
          children: [
            /* @__PURE__ */ jsx("option", { value: "Beginner", children: "Beginner" }),
            /* @__PURE__ */ jsx("option", { value: "Intermediate", children: "Intermediate" }),
            /* @__PURE__ */ jsx("option", { value: "Advanced", children: "Advanced" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "grade", children: "Grade" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "grade",
            className: "w-full h-9 rounded-md border border-input bg-background px-3 text-sm",
            value: grade,
            onChange: (e) => setGrade(e.target.value),
            children: [
              /* @__PURE__ */ jsx("option", { value: "Bronze", children: "Bronze" }),
              /* @__PURE__ */ jsx("option", { value: "Silver", children: "Silver" }),
              /* @__PURE__ */ jsx("option", { value: "Gold", children: "Gold" }),
              /* @__PURE__ */ jsx("option", { value: "Platinum", children: "Platinum" }),
              /* @__PURE__ */ jsx("option", { value: "Diamond", children: "Diamond" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "authority", children: "Authority" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "authority",
            className: "w-full h-9 rounded-md border border-input bg-background px-3 text-sm",
            value: authority,
            onChange: (e) => setAuthority(e.target.value),
            children: [
              /* @__PURE__ */ jsx("option", { value: "user", children: "User" }),
              /* @__PURE__ */ jsx("option", { value: "operator", children: "Operator" }),
              /* @__PURE__ */ jsx("option", { value: "admin", children: "Admin" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "exp", children: "EXP" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "exp",
            type: "number",
            min: 0,
            value: exp,
            onChange: (e) => setExp(Number(e.target.value)),
            required: true
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", children: "Save" }) })
  ] }) });
}
const users = UNSAFE_withComponentProps(function UserManagementPage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useAtomValue(currentUserAtom);
  const [users2, setUsers] = useAtom(usersAtom);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("사용자 정보를 불러오는데 실패했습니다.");
        setUsers(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [setUsers]);
  const filteredUsers = users2?.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.nickname.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()));
  const handleDelete = async (id) => {
    if (!window.confirm("本当にこのユーザーを削除しますか？")) return;
    const prevUsers = users2;
    setUsers((currentUsers) => currentUsers ? currentUsers.filter((user) => user.uid !== id) : null);
    try {
      await deleteUserFromFirestore(id);
      alert("ユーザーが正常に削除されました。");
    } catch (err) {
      console.error("ユーザー削除に失敗しました:", err);
      setError("ユーザー削除に失敗しました。");
      setUsers(prevUsers);
    }
  };
  const handleSave = async (user) => {
    const isNewUser = !users2?.some((u) => u.uid === user.uid);
    const prevUsers = users2;
    setUsers((currentUsers) => {
      if (!currentUsers) return [user];
      const existingIndex = currentUsers.findIndex((u) => u.uid === user.uid);
      if (existingIndex !== -1) {
        const updated = [...currentUsers];
        updated[existingIndex] = user;
        return updated;
      } else {
        return [...currentUsers, user];
      }
    });
    try {
      if (isNewUser) {
        await addUserToFirestore(user);
        alert("ユーザーが正常に追加されました。");
      } else {
        await updateUserInFirestore(user.uid, user);
        alert("ユーザー情報が正常に更新されました。");
      }
    } catch (err) {
      console.error("ユーザー情報の保存に失敗しました:", err);
      setError("ユーザー情報の保存に失敗しました。");
      setUsers(prevUsers);
    } finally {
      setOpenAdd(false);
      setOpenEdit(false);
    }
  };
  if (!currentUser) {
    return /* @__PURE__ */ jsx(Navigate, {
      to: "/login",
      replace: true
    });
  }
  if (currentUser?.authority !== "admin" && currentUser?.authority !== "instructor") {
    return /* @__PURE__ */ jsx(Navigate, {
      to: "/",
      replace: true
    });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", {
      className: "p-6 max-w-7xl mx-auto text-center text-lg",
      children: "ユーザー情報を読み込み中..."
    });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", {
      className: "p-6 max-w-7xl mx-auto text-center text-red-500 text-lg",
      children: ["エラー: ", error]
    });
  }
  if (!users2) {
    return /* @__PURE__ */ jsx("div", {
      className: "p-6 max-w-7xl mx-auto text-center text-lg",
      children: "ユーザー情報が存在しません。"
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "p-6 max-w-7xl mx-auto space-y-6",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-2xl font-bold",
        children: "ユーザー管理"
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex gap-2 w-full sm:w-auto",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "relative flex-1 sm:w-64",
          children: [/* @__PURE__ */ jsx(Search, {
            className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          }), /* @__PURE__ */ jsx(Input, {
            placeholder: "Search by name, nickname, email...",
            className: "pl-9",
            value: search,
            onChange: (e) => setSearch(e.target.value)
          })]
        }), /* @__PURE__ */ jsxs(Dialog, {
          open: openAdd,
          onOpenChange: setOpenAdd,
          children: [/* @__PURE__ */ jsx(DialogTrigger, {
            asChild: true,
            children: /* @__PURE__ */ jsxs(Button, {
              children: [/* @__PURE__ */ jsx(Plus, {
                className: "h-4 w-4 mr-2"
              }), " ユーザーを追加"]
            })
          }), /* @__PURE__ */ jsx(UserForm, {
            onSave: handleSave
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "rounded-xl border bg-background shadow-sm overflow-x-auto",
      children: /* @__PURE__ */ jsxs(Table, {
        children: [/* @__PURE__ */ jsx(TableHeader, {
          children: /* @__PURE__ */ jsxs(TableRow, {
            children: [/* @__PURE__ */ jsx(TableHead, {
              children: "Name"
            }), /* @__PURE__ */ jsx(TableHead, {
              children: "Nickname"
            }), /* @__PURE__ */ jsx(TableHead, {
              children: "Email"
            }), /* @__PURE__ */ jsx(TableHead, {
              children: "Course"
            }), /* @__PURE__ */ jsx(TableHead, {
              children: "Grade"
            }), /* @__PURE__ */ jsx(TableHead, {
              children: "Authority"
            }), /* @__PURE__ */ jsx(TableHead, {
              children: "EXP"
            }), /* @__PURE__ */ jsx(TableHead, {
              className: "text-right",
              children: "Actions"
            })]
          })
        }), /* @__PURE__ */ jsxs(TableBody, {
          children: [filteredUsers?.map((user) => /* @__PURE__ */ jsxs(TableRow, {
            children: [/* @__PURE__ */ jsx(TableCell, {
              className: "font-medium",
              children: user.name
            }), /* @__PURE__ */ jsx(TableCell, {
              children: user.nickname
            }), /* @__PURE__ */ jsx(TableCell, {
              children: user.email
            }), /* @__PURE__ */ jsx(TableCell, {
              className: "capitalize",
              children: user.course
            }), /* @__PURE__ */ jsx(TableCell, {
              children: /* @__PURE__ */ jsx(Badge, {
                variant: "outline",
                className: "capitalize",
                children: user.grade
              })
            }), /* @__PURE__ */ jsx(TableCell, {
              children: /* @__PURE__ */ jsx(Badge, {
                variant: user.authority === "admin" ? "default" : user.authority === "instructor" ? "secondary" : "outline",
                className: "capitalize",
                children: user.authority
              })
            }), /* @__PURE__ */ jsx(TableCell, {
              className: "tabular-nums",
              children: user.exp.toLocaleString()
            }), /* @__PURE__ */ jsx(TableCell, {
              className: "text-right",
              children: /* @__PURE__ */ jsxs("div", {
                className: "flex justify-end gap-2",
                children: [/* @__PURE__ */ jsxs(Dialog, {
                  open: user === selectedUser,
                  onOpenChange: (open) => setSelectedUser(open ? user : null),
                  children: [/* @__PURE__ */ jsx(DialogTrigger, {
                    asChild: true,
                    children: /* @__PURE__ */ jsx(Button, {
                      variant: "ghost",
                      size: "icon",
                      onClick: () => setSelectedUser(user),
                      children: /* @__PURE__ */ jsx(UserCog, {
                        className: "h-4 w-4"
                      })
                    })
                  }), /* @__PURE__ */ jsx(UserForm, {
                    user,
                    onSave: handleSave,
                    setOpen: setOpenEdit
                  })]
                }), /* @__PURE__ */ jsx(Button, {
                  variant: "ghost",
                  size: "icon",
                  className: "text-destructive",
                  onClick: () => handleDelete(user.uid),
                  children: /* @__PURE__ */ jsx(Trash2, {
                    className: "h-4 w-4"
                  })
                })]
              })
            })]
          }, user.uid)), (filteredUsers === void 0 || filteredUsers.length === 0) && /* @__PURE__ */ jsx(TableRow, {
            children: /* @__PURE__ */ jsx(TableCell, {
              colSpan: 7,
              className: "text-center text-muted-foreground py-8",
              children: "No users found."
            })
          })]
        })]
      })
    })]
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: users
}, Symbol.toStringTag, { value: "Module" }));
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const currentUser = useAtomValue(currentUserAtom);
  const handleClickSignUp = () => {
    navigate("/signup");
  };
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
      alert("ログイン成功!");
    } catch (err) {
      setError(err.message);
      alert(`ログイン失敗: ${err.message}`);
    }
  };
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser]);
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen flex items-center justify-center bg-gray-50",
    children: /* @__PURE__ */ jsxs(Card, {
      className: "p-8 w-full max-w-sm shadow-lg",
      children: [/* @__PURE__ */ jsx("h2", {
        className: H2_STYLE + " mb-6 text-center",
        children: "ログイン"
      }), /* @__PURE__ */ jsxs("form", {
        className: "space-y-4",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx(Label, {
            htmlFor: "email",
            children: "メール"
          }), /* @__PURE__ */ jsx(Input, {
            id: "email",
            type: "email",
            placeholder: "you@example.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
            className: "mt-1"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx(Label, {
            htmlFor: "password",
            children: "パスワード "
          }), /* @__PURE__ */ jsx(Input, {
            id: "password",
            type: "password",
            placeholder: "********",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
            className: "mt-1"
          })]
        }), error && /* @__PURE__ */ jsx("p", {
          className: "text-red-500 text-sm",
          children: error
        }), /* @__PURE__ */ jsxs(ButtonGroup, {
          className: "w-full mt-6 flex justify-end",
          children: [/* @__PURE__ */ jsx(Button, {
            type: "button",
            onClick: handleClickSignUp,
            children: "会員登録"
          }), /* @__PURE__ */ jsx(Button, {
            type: "submit",
            onClick: handleSignIn,
            variant: "outline",
            children: "ログイン"
          })]
        })]
      })]
    })
  });
};
const login = UNSAFE_withComponentProps(Login);
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: login
}, Symbol.toStringTag, { value: "Module" }));
const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [{
    data: contents2
  }] = useAtom(contentsQueryAtom);
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    if (!contents2) {
      setError("コンテンツデータがまだ読み込まれていません。もう一度お試しください。");
      return;
    }
    try {
      const userCredential = await signUp(email, password);
      const user = userCredential.user;
      if (!user) throw new Error("User creation failed");
      await setDoc(doc(firestore, "users", user.uid), {
        name,
        nickname,
        email,
        course: "Beginner",
        grade: "Bronze",
        exp: 0,
        authority: "user"
      });
      alert("サインアップに成功しました！ようこそ！");
      navigate("/");
    } catch (err) {
      setError(err.message);
      alert(`サインアップに失敗しました: ${err.message}`);
    }
  };
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen flex items-center justify-center bg-gray-50",
    children: /* @__PURE__ */ jsxs(Card, {
      className: "p-8 w-full max-w-sm shadow-lg",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-2xl font-bold mb-6 text-center",
        children: "Sign Up"
      }), /* @__PURE__ */ jsxs("form", {
        onSubmit: handleSignUp,
        className: "space-y-4",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx(Label, {
            htmlFor: "name",
            children: "Name"
          }), /* @__PURE__ */ jsx(Input, {
            id: "name",
            type: "text",
            placeholder: "REACT TARO",
            value: name,
            onChange: (e) => setName(e.target.value),
            required: true,
            className: "mt-1"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx(Label, {
            htmlFor: "nickname",
            children: "Nickname"
          }), /* @__PURE__ */ jsx(Input, {
            id: "nickname",
            type: "text",
            placeholder: "React Machine",
            value: nickname,
            onChange: (e) => setNickname(e.target.value),
            required: true,
            className: "mt-1"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx(Label, {
            htmlFor: "email",
            children: "Email"
          }), /* @__PURE__ */ jsx(Input, {
            id: "email",
            type: "email",
            placeholder: "you@example.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
            className: "mt-1"
          })]
        }), /* @__PURE__ */ jsx(Label, {
          className: "text-red-400 text-xs",
          children: "*必ず実在するメールアドレスを入力してください。"
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx(Label, {
            htmlFor: "password",
            children: "Password (6文字以上)"
          }), /* @__PURE__ */ jsx(Input, {
            id: "password",
            type: "password",
            placeholder: "********",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
            className: "mt-1"
          })]
        }), error && /* @__PURE__ */ jsx("p", {
          className: "text-red-500 text-sm",
          children: error
        }), /* @__PURE__ */ jsx(Button, {
          type: "submit",
          className: "w-full mt-4",
          children: "Submit"
        })]
      })]
    })
  });
};
const signup = UNSAFE_withComponentProps(SignUp);
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: signup
}, Symbol.toStringTag, { value: "Module" }));
const test = UNSAFE_withComponentProps(function TestPage() {
  const markdown = '\nJSX는 자바스크립트 코드 안에서 **HTML처럼 보이는 문법**을 쓰는 것입니다.\n\n```jsx\nconst element = <h1 className="title">반가워요</h1>;\n```\n\n- HTML과 비슷하지만 `class` 대신 `className`을 씁니다.\n- `{ }`를 사용하면 자바스크립트 변수를 HTML 안에 넣을 수 있습니다.';
  return /* @__PURE__ */ jsx("div", {
    className: "h-screen flex flex-col justify-center items-center p-8",
    children: /* @__PURE__ */ jsx("div", {
      children: /* @__PURE__ */ jsx(ReactMarkdown, {
        remarkPlugins: [remarkGfm],
        components: {
          code({
            className,
            children
          }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              // 코드 (```)
              /* @__PURE__ */ jsx(Prism, {
                style: nord,
                language: match[1],
                PreTag: "div",
                children: String(children).replace(/\n$/, "").replace(/\n&nbsp;\n/g, "").replace(/\n&nbsp\n/g, "")
              })
            ) : /* @__PURE__ */ jsx(Prism, {
              style: nord,
              background: "green",
              language: "textile",
              PreTag: "div",
              children: String(children).replace(/\n$/, "")
            });
          },
          // 인용문 (>)
          blockquote({
            children,
            ...props
          }) {
            return /* @__PURE__ */ jsx("blockquote", {
              style: {
                background: "#7afca19b",
                padding: "1px 15px",
                borderRadius: "10px"
              },
              ...props,
              children
            });
          },
          img({
            ...props
          }) {
            return /* @__PURE__ */ jsx("img", {
              style: {
                maxWidth: "40vw"
              },
              src: props.src?.replace("../../../../public/", "/"),
              alt: "MarkdownRenderer__Image"
            });
          },
          em({
            children,
            ...props
          }) {
            return /* @__PURE__ */ jsx("span", {
              style: {
                fontStyle: "italic"
              },
              ...props,
              children
            });
          }
        },
        children: markdown.replace(/\n/gi, "\n\n").replace(/\*\*/gi, "@$_%!^").replace(/@\$_%!\^/gi, "**").replace(/<\/?u>/gi, "*")
      })
    })
  });
});
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: test
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/react_leaning/assets/entry.client-CKhUeF8J.js", "imports": ["/react_leaning/assets/chunk-EPOLDU6W-K4piUF01.js", "/react_leaning/assets/index-HXCuKcVE.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/react_leaning/assets/root-Cc7fJFln.js", "imports": ["/react_leaning/assets/chunk-EPOLDU6W-K4piUF01.js", "/react_leaning/assets/index-HXCuKcVE.js", "/react_leaning/assets/button-CAZCDkQr.js", "/react_leaning/assets/contentData-Rc0Y-FW7.js", "/react_leaning/assets/index-mZfcMAy8.js", "/react_leaning/assets/index-CL96kxSx.js", "/react_leaning/assets/helper-qGNXvysJ.js", "/react_leaning/assets/auth-CUidWPWI.js", "/react_leaning/assets/messages-square-CT5lqp-g.js", "/react_leaning/assets/BackgroundSpinner-C8qNac8V.js", "/react_leaning/assets/index-D1YKpAVZ.js", "/react_leaning/assets/firestore_utils-BxLobnBG.js"], "css": ["/react_leaning/assets/root-DHz5pIdt.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/react_leaning/assets/home-CU9HyEey.js", "imports": ["/react_leaning/assets/chunk-EPOLDU6W-K4piUF01.js", "/react_leaning/assets/button-CAZCDkQr.js", "/react_leaning/assets/contentData-Rc0Y-FW7.js", "/react_leaning/assets/button-group-BUyBRTz3.js", "/react_leaning/assets/index-HXCuKcVE.js", "/react_leaning/assets/firestore_utils-BxLobnBG.js", "/react_leaning/assets/card-gxypV0ip.js", "/react_leaning/assets/index-Dg8rowGk.js", "/react_leaning/assets/dialog-oaqZQNbR.js", "/react_leaning/assets/helper-qGNXvysJ.js", "/react_leaning/assets/input-Dkyvn_pA.js", "/react_leaning/assets/confirm-Dr8fUyKG.js", "/react_leaning/assets/index-mZfcMAy8.js", "/react_leaning/assets/index-D1YKpAVZ.js", "/react_leaning/assets/BackgroundSpinner-C8qNac8V.js", "/react_leaning/assets/trash-2-CEdILdvB.js", "/react_leaning/assets/commonStyle-CMqu6ffv.js", "/react_leaning/assets/messages-square-CT5lqp-g.js", "/react_leaning/assets/x-B083jXCI.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/contents": { "id": "routes/contents", "parentId": "root", "path": "contents/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/react_leaning/assets/contents-BQ6FyhrP.js", "imports": ["/react_leaning/assets/chunk-EPOLDU6W-K4piUF01.js", "/react_leaning/assets/contentData-Rc0Y-FW7.js", "/react_leaning/assets/button-CAZCDkQr.js", "/react_leaning/assets/index-Dg8rowGk.js", "/react_leaning/assets/index-mZfcMAy8.js", "/react_leaning/assets/x-B083jXCI.js", "/react_leaning/assets/index-CL96kxSx.js", "/react_leaning/assets/index-HXCuKcVE.js", "/react_leaning/assets/helper-qGNXvysJ.js", "/react_leaning/assets/button-group-BUyBRTz3.js", "/react_leaning/assets/card-gxypV0ip.js", "/react_leaning/assets/input-Dkyvn_pA.js", "/react_leaning/assets/index-D1YKpAVZ.js", "/react_leaning/assets/index-CMv0XofT.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/community": { "id": "routes/community", "parentId": "root", "path": "community", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/react_leaning/assets/community--0YMQzFk.js", "imports": ["/react_leaning/assets/chunk-EPOLDU6W-K4piUF01.js", "/react_leaning/assets/button-CAZCDkQr.js", "/react_leaning/assets/helper-qGNXvysJ.js", "/react_leaning/assets/card-gxypV0ip.js", "/react_leaning/assets/dialog-oaqZQNbR.js", "/react_leaning/assets/button-group-BUyBRTz3.js", "/react_leaning/assets/input-Dkyvn_pA.js", "/react_leaning/assets/confirm-Dr8fUyKG.js", "/react_leaning/assets/BackgroundSpinner-C8qNac8V.js", "/react_leaning/assets/index-mZfcMAy8.js", "/react_leaning/assets/x-B083jXCI.js", "/react_leaning/assets/index-HXCuKcVE.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/settings": { "id": "routes/settings", "parentId": "root", "path": "settings", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/react_leaning/assets/settings-C90A8BPC.js", "imports": ["/react_leaning/assets/chunk-EPOLDU6W-K4piUF01.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/users": { "id": "routes/users", "parentId": "root", "path": "users", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/react_leaning/assets/users-DR_4l6lw.js", "imports": ["/react_leaning/assets/chunk-EPOLDU6W-K4piUF01.js", "/react_leaning/assets/input-Dkyvn_pA.js", "/react_leaning/assets/dialog-oaqZQNbR.js", "/react_leaning/assets/button-CAZCDkQr.js", "/react_leaning/assets/firestore_utils-BxLobnBG.js", "/react_leaning/assets/index-mZfcMAy8.js", "/react_leaning/assets/trash-2-CEdILdvB.js", "/react_leaning/assets/index-HXCuKcVE.js", "/react_leaning/assets/x-B083jXCI.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/react_leaning/assets/login-9_auBD8v.js", "imports": ["/react_leaning/assets/chunk-EPOLDU6W-K4piUF01.js", "/react_leaning/assets/commonStyle-CMqu6ffv.js", "/react_leaning/assets/button-CAZCDkQr.js", "/react_leaning/assets/button-group-BUyBRTz3.js", "/react_leaning/assets/card-gxypV0ip.js", "/react_leaning/assets/input-Dkyvn_pA.js", "/react_leaning/assets/auth-CUidWPWI.js", "/react_leaning/assets/index-HXCuKcVE.js", "/react_leaning/assets/firestore_utils-BxLobnBG.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/signup": { "id": "routes/signup", "parentId": "root", "path": "signup", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/react_leaning/assets/signup-B_NGE_DG.js", "imports": ["/react_leaning/assets/chunk-EPOLDU6W-K4piUF01.js", "/react_leaning/assets/contentData-Rc0Y-FW7.js", "/react_leaning/assets/button-CAZCDkQr.js", "/react_leaning/assets/card-gxypV0ip.js", "/react_leaning/assets/input-Dkyvn_pA.js", "/react_leaning/assets/auth-CUidWPWI.js", "/react_leaning/assets/index-HXCuKcVE.js", "/react_leaning/assets/firestore_utils-BxLobnBG.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/test": { "id": "routes/test", "parentId": "root", "path": "test", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/react_leaning/assets/test-D8ok1bqJ.js", "imports": ["/react_leaning/assets/chunk-EPOLDU6W-K4piUF01.js", "/react_leaning/assets/index-CMv0XofT.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/react_leaning/assets/manifest-50ae6284.js", "version": "50ae6284", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/react_leaning/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/react_leaning/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/contents": {
    id: "routes/contents",
    parentId: "root",
    path: "contents/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/community": {
    id: "routes/community",
    parentId: "root",
    path: "community",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/settings": {
    id: "routes/settings",
    parentId: "root",
    path: "settings",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/users": {
    id: "routes/users",
    parentId: "root",
    path: "users",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/signup": {
    id: "routes/signup",
    parentId: "root",
    path: "signup",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/test": {
    id: "routes/test",
    parentId: "root",
    path: "test",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
