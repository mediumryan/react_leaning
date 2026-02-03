import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { getContents } from "~/lib/firestore_utils";

// 0: 설명, 1: 객관식, 2: 주관식
export type ContentType = 0 | 1 | 2;

export interface BaseContent {
  id: string; // 고유 ID
  section: number; // 속한 섹션
  order: number; // 섹션 내 순서
  title: string; // 콘텐츠 제목
  type: ContentType; // 콘텐츠 유형
  exp: number; // 완료 시 획득 경험치
  isComplete: boolean; // 완료 여부
}

export interface DescriptiveContent extends BaseContent {
  type: 0;
  youtubeId?: string;
  content: string;
}

export interface MultipleChoiceQuiz extends BaseContent {
  type: 1;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface ShortAnswerQuiz extends BaseContent {
  type: 2;
  question: string;
  correctAnswer: string;
  explanation?: string;
}

export const mockContents: Content[] =
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
      content:
        '안녕하세요 👋\n\n이 강의에 오신 것을 환영합니다.\n\n이 강의에서는 **React를 처음 접하는 분들도**, 하나의 완성된 웹 애플리케이션을 직접 만들어보는 것을 목표로 합니다.\n\n---\n\n### 🧠 수강 전 알아두면 좋아요\n\n이 강의는 React 입문 강의이지만,\n아래와 같은 **기본적인 웹 개발 지식**을 알고 계시면 훨씬 수월하게 따라올 수 있습니다.\n\n> 📌 **필요한 선수 지식**\n>\n> - 기본적인 **HTML 구조** (태그, 속성 등)\n> - **JavaScript 기초 문법** (변수, 함수, 배열)\n>\n> React 문법 자체는 강의에서 차근차근 설명드리니,\n> 너무 걱정하지 않으셔도 괜찮습니다.\n\n---\n\n### 🎯 강의 컨셉\n\n> - React의 핵심 개념을 **직접 만들면서** 이해합니다.\n> - 복잡한 이론보다, "왜 이렇게 쓰는지"에 집중합니다.\n\n---\n\n### 📚 이 강의에서 배우게 될 내용\n\n1. React의 기본 개념과 동작 원리\n2. 컴포넌트와 JSX 문법\n3. State와 Props를 이용한 데이터 관리\n4. 리스트 렌더링과 이벤트 처리\n5. 최종 프로젝트: **Todo-List 앱 완성**\n\n---\n\n### 🧩 최종 목표 미리보기\n\n아래와 같은 Todo-List 애플리케이션을\n**혼자서도 만들 수 있게 되는 것**이 이 강의의 목표입니다.\n\n![Todo Template]( )\n\n --- \n\n그럼, 이제 차근차근 시작해볼까요?',
    },
    {
      type: 0,
      section: 1,
      order: 1,
      id: "intro-what-is-react",
      title: "React.js란 무엇인가?",
      exp: 10,
      isComplete: false,
      content:
        'React는 **사용자 인터페이스**(UI)를 만들기 위한 JavaScript 라이브러리입니다.\n\nReact는 **Meta**(구 Facebook)에서 개발했으며,\n현재 전 세계에서 가장 널리 사용되는 프론트엔드 기술 중 하나입니다.\n\n웹페이지에서 버튼을 클릭하거나 입력값이 바뀔 때,\n화면이 전체가 아닌 **필요한 부분만** 업데이트되는 경험을 해보셨나요?\n\n이러한 동적인 화면을 **효율적으로 구현하기 위해** React가 사용됩니다.\n\n---\n\n### 🧠 React의 핵심 개념 미리보기\n\n> 📌 React를 이해하기 위한 핵심 키워드\n>\n> - **컴포넌트(Component)**: UI를 작은 단위로 나눈 조각\n> - **State**: 컴포넌트가 기억하는 상태 값\n> - **Props**: 컴포넌트 간에 전달되는 데이터\n\n이 개념들을 조합해\n복잡한 화면도 **체계적으로 관리**할 수 있습니다.\n\n---\n\n### 📦 라이브러리란 무엇일까요?\n\nReact는 프레임워크가 아닌 **라이브러리**입니다.\n\n즉, 모든 규칙을 강요하기보다는\n"필요한 부분만 선택해서" 사용할 수 있다는 장점이 있습니다.\n\n> 그래서 React는\n> 작은 프로젝트부터 대규모 서비스까지\n> 폭넓게 사용됩니다.',
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
      isComplete: false,
    },
    {
      type: 0,
      section: 1,
      order: 3,
      id: "intro-why-react",
      title: "왜 React를 배워야 할까요?",
      exp: 10,
      isComplete: false,
      content:
        "전 세계적으로 React가 널리 사용되는 데에는 분명한 이유가 있습니다.\n\n1. **컴포넌트 재사용**  \n   한 번 만든 UI를 여러 화면에서 반복해서 사용할 수 있습니다.\n\n2. **거대한 생태계**  \n   수많은 라이브러리와 자료가 이미 준비되어 있습니다.\n\n3. **선언적 프로그래밍**  \n   화면이 *어떻게* 바뀌는지보다,\n   *무엇을 보여줄지*에 집중할 수 있습니다.\n\n> React를 배우면\n> 단순히 문법 하나가 아니라,\n> 현대적인 프론트엔드 사고방식을 익히게 됩니다.",
    },
    {
      type: 0,
      section: 1,
      order: 4,
      id: "app-creation-vite",
      title: "앱 생성하기 - Vite",
      exp: 15,
      isComplete: false,
      content:
        "이제 실제로 React 애플리케이션을 만들어볼 차례입니다.\n\n가장 빠르고 현대적인 개발 도구인 **Vite**를 사용합니다.\n\n터미널을 열고 아래 명령어를 입력해보세요.\n\n```bash\nnpm create vite@latest my-todo-app -- --template react\n```\n\n명령이 완료되면,\nReact 개발을 시작할 준비가 모두 끝납니다.",
    },
    {
      type: 0,
      section: 1,
      order: 5,
      id: "section1-summary",
      title: "섹션 1 정리: React의 큰 그림",
      exp: 5,
      isComplete: false,
      content:
        "이번 섹션에서는 React를 시작하기 전에 꼭 알아야 할 **큰 그림**을 살펴봤습니다.\n\n---\n\n### ✅ 이번 섹션에서 배운 것\n\n- React는 **사용자 인터페이스(UI)**를 만들기 위한 JavaScript **라이브러리**라는 점\n- React가 왜 많은 개발자들에게 선택받는지\n- React 프로젝트를 시작하는 기본 환경 (Vite)\n\n---\n\n### 🎯 지금 여러분이 할 수 있는 것\n\n- React가 어떤 역할을 하는 도구인지 설명할 수 있습니다.\n- React 프로젝트를 직접 생성하고 실행할 수 있습니다.\n\n---\n\n다음 섹션부터는\nReact의 핵심인 **컴포넌트와 JSX**를 하나씩 직접 다뤄보게 됩니다.\n\n이제 진짜 React 개발이 시작됩니다 🚀",
    },
    {
      isComplete: false,
      exp: 10,
      order: 1,
      type: 0,
      id: "basic-understanding-components",
      title: "컴포넌트(Components) 이해하기",
      section: 2,
      content:
        "컴포넌트는 UI를 구성하는 **독립적인 블록**입니다.\n\nReact에서 컴포넌트는 사실 **JavaScript 함수**입니다.\n\n```jsx\nfunction Welcome() {\n  return <h1>안녕, 리액트!</h1>;\n}\n```\n\n아래와 같이 태그 형태로 사용할 수 있습니다.\n\n```jsx\n<Welcome />\n```\n\n> ⚠️ **주의**\n>\n> 컴포넌트 이름의 첫 글자는 반드시 **대문자**여야 합니다.",
    },
    {
      type: 0,
      section: 2,
      order: 2,
      id: "basic-jsx-syntax",
      title: "JSX: 자바스크립트 속 HTML",
      exp: 10,
      isComplete: false,
      content:
        "\n\nJSX는 **자바스크립트 안에서 HTML처럼 보이는 문법**을 사용할 수 있게 해주는 React의 특수한 문법입니다.\n\n즉, HTML과 JavaScript를 자연스럽게 섞어 쓸 수 있도록 해줍니다.\n\n> 📌 핵심 특징\n> - HTML 태그처럼 생겼지만, 실제로는 자바스크립트 코드입니다.\n> - JSX 안에서는 **자바스크립트 표현식**을 `{ }` 안에 넣어 사용할 수 있습니다.\n> - `class` 대신 `className`, `for` 대신 `htmlFor` 등 일부 속성 이름이 React 규칙으로 바뀌었습니다.\n\n---\n\n### 기본 JSX 예제\n```jsx\nconst element = <h1 className=\"title\">안녕하세요, React!</h1>;\n```\n- HTML과 거의 동일하게 작성할 수 있지만, 클래스는 `className`으로 작성해야 합니다.\n\n---\n\n### 자바스크립트 표현식 사용\nJSX에서는 `{ }`를 사용해 자바스크립트 변수를 직접 넣을 수 있습니다.\n```jsx\nconst name = '철수';\nconst element = <h1>안녕하세요, {name}님!</h1>;\n```\n- 위 코드에서는 `{name}`이 변수 `name`의 값을 출력합니다.\n\n---\n\n### 더 다양한 표현식 사용 예제\n```jsx\nconst a = 10;\nconst b = 20;\nconst element = <p>{a} + {b} = {a + b}</p>;\n```\n- `{a + b}`처럼 수학 연산도 바로 JSX 안에서 처리할 수 있습니다.\n\n```jsx\nconst isLoggedIn = true;\nconst message = <p>{isLoggedIn ? '환영합니다!' : '로그인이 필요합니다.'}</p>;\n```\n- 삼항 연산자를 활용해 조건부 렌더링도 가능합니다.\n\n---\n\n### JSX에서 주의할 점\n- JSX 내부에서 **자바스크립트 문(statement)**는 사용할 수 없습니다. 표현식(expression)만 가능\n  - 예: `if`, `for` 문은 JSX 안에서 직접 쓸 수 없음\n  - 대신 `{condition ? <A /> : <B />}` 또는 `map()` 등을 사용\n---\n- 여러 요소를 반환할 때는 반드시 **하나의 부모 태그**로 감싸야 합니다.\n```jsx\nreturn (\n  <div>\n    <h1>안녕하세요</h1>\n    <p>JSX 연습 중입니다.</p>\n  </div>\n);\n```\n\n---\n\nJSX를 이해하면, React 컴포넌트 안에서 **UI를 자바스크립트처럼 조작**할 수 있는 강력한 능력을 갖게 됩니다. \n다음 강의에서는 이 JSX를 사용해 **컴포넌트를 구성하는 방법**을 배워보겠습니다.",
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
        "React 전용의 스타일링 문법",
      ],
      correctAnswerIndex: 2,
      exp: 20,
      isComplete: false,
    },
    {
      type: 1,
      section: 2,
      order: 4,
      id: "quiz-jsx-expression",
      title: "JSX 표현식 퀴즈",
      question:
        "JSX 안에서 자바스크립트 변수를 출력할 때 사용하는 올바른 방법은 무엇입니까?",
      options: [
        "<p>name</p>",
        "<p>${name}</p>",
        "<p>{name}</p>",
        "<p>(name)</p>",
      ],
      correctAnswerIndex: 2,
      exp: 20,
      isComplete: false,
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
        "변수 값 출력",
      ],
      correctAnswerIndex: 2,
      exp: 25,
      isComplete: false,
    },
    {
      type: 0,
      section: 2,
      order: 6,
      id: "section2-summary",
      title: "섹션 2 정리: 컴포넌트와 JSX",
      exp: 5,
      isComplete: false,
      content:
        "이번 섹션에서는 React의 가장 핵심적인 개념인\n**컴포넌트와 JSX**를 배웠습니다.\n\n---\n\n### ✅ 이번 섹션에서 배운 것\n\n- 컴포넌트는 UI를 구성하는 **독립적인 단위**라는 점\n- JSX는 자바스크립트 안에서 HTML처럼 작성하는 문법이라는 점\n- JSX 안에서는 `{ }`를 사용해 자바스크립트 **표현식**을 사용할 수 있다는 점\n\n---\n\n### 🎯 지금 여러분이 할 수 있는 것\n\n- 간단한 React 컴포넌트를 직접 작성할 수 있습니다.\n- JSX 문법을 읽고, 어떤 화면이 나올지 예상할 수 있습니다.\n\n---\n\n다음 섹션에서는\n컴포넌트가 **기억을 가지게 만드는 방법**,\n즉 **State**에 대해 알아보겠습니다.",
    },
    {
      exp: 15,
      id: "state-what-is-state",
      title: "State란 무엇인가?",
      section: 3,
      order: 1,
      type: 0,
      isComplete: false,
      content:
        "React에서 **State**는 컴포넌트가 **기억하고 있는 값**입니다.\n\n이 값은 시간이 지나면서\n또는 사용자와의 상호작용에 따라 **변경될 수 있는 데이터**를 의미합니다.\n\n---\n\n### ❓ 왜 일반 변수로는 안 될까요?\n\n아래 코드를 먼저 살펴봅시다.\n\n```jsx\nlet count = 0;\n\nfunction Counter() {\n  const increase = () => {\n    count = count + 1;\n    console.log(count);\n  };\n\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={increase}>증가</button>\n    </div>\n  );\n}\n```\n\n버튼을 눌러도 화면의 숫자는 바뀌지 않습니다.\n\n> 값은 바뀌었지만,\n> **React는 화면을 다시 그려야 한다는 사실을 알지 못하기 때문**입니다.\n\n---\n\n### ✅ 그래서 State가 필요합니다\n\nState는 단순한 값이 아니라,\n**값이 변경되었을 때 화면을 다시 그리도록 React에게 알려주는 역할**을 합니다.\n\nState가 변경되면 React는\n해당 컴포넌트를 **자동으로 다시 렌더링**합니다.\n\n---\n\n### 🧠 useState 기본 구조\n\n```jsx\nconst [count, setCount] = useState(0);\n```\n\n- `count` : 현재 상태 값\n- `setCount` : 상태를 변경하는 함수\n- `useState(0)` : 상태의 초기값\n\n> 📌 **중요**\n>\n> State 값은 반드시 `setCount` 같은\n> **상태 변경 함수로만 수정**해야 합니다.\n\n---\n\n### ✋ 꼭 기억하세요\n\n- State는 컴포넌트마다 **독립적으로 존재**합니다.\n- State가 바뀌면 컴포넌트는 **자동으로 다시 실행**됩니다.\n- 일반 변수와 다르게, State는 **화면과 연결된 값**입니다.",
    },
    {
      type: 0,
      content:
        "이번에는 **State를 사용해 실제로 화면이 바뀌는 예제**를 살펴봅니다.\n\n아래 코드는 버튼을 클릭할 때마다\n숫자가 1씩 증가하는 간단한 카운터 앱입니다.\n\n```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        증가\n      </button>\n    </div>\n  );\n}\n```\n\n---\n\n### 🔄 버튼을 누르면 무슨 일이 일어날까요?\n\n1.버튼 클릭 이벤트가 발생합니다.\n2.이벤트는 아래의 코드를 실행시킵니다.`setCount(count + 1)`\n3.State 값이 변경됩니다.\n4.React가 **컴포넌트를 다시 실행**합니다.\n5.변경된 **count** 값이 화면에 반영됩니다.\n\n---\n\n> ⚠️ **주의**\n>\n> React 이벤트는 HTML과 다르게\n> `onclick`이 아닌 **`onClick`** 입니다.",
      isComplete: false,
      exp: 25,
      id: "state-counter-practice",
      section: 3,
      order: 2,
      title: "카운터 앱 실습: 버튼 이벤트",
    },
    {
      type: 2,
      section: 3,
      order: 3,
      id: "quiz-state-description",
      title: "State 개념 이해 퀴즈",
      question:
        "컴포넌트가 기억하고 있으며, 값이 변경되면 화면이 다시 렌더링되도록 만드는 React의 데이터는 무엇입니까?",
      correctAnswer: "State",
      exp: 20,
      isComplete: false,
    },
    {
      type: 2,
      section: 3,
      order: 4,
      id: "quiz-state-update-code",
      title: "State 변경 코드 퀴즈",
      question:
        "다음 상태가 선언되어 있을 때,\n\nconst [number, setNumber] = useState(0);\n\nnumber의 값을 5로 변경하는 코드를 작성하세요.",
      correctAnswer: "setNumber(5)",
      exp: 30,
      isComplete: false,
    },
    {
      type: 1,
      section: 3,
      order: 5,
      id: "quiz-state-change-effect",
      title: "State 변경 결과 퀴즈",
      question:
        "State의 값이 변경되면 React 컴포넌트에는 어떤 일이 발생합니까?",
      options: [
        "아무 일도 일어나지 않는다",
        "전체 페이지가 새로고침된다",
        "해당 컴포넌트가 다시 렌더링된다",
        "에러가 발생한다",
      ],
      correctAnswerIndex: 2,
      exp: 20,
      isComplete: false,
    },
    {
      type: 1,
      section: 3,
      order: 6,
      id: "quiz-state-vs-variable",
      title: "State와 변수 비교 퀴즈",
      question:
        "다음 중 React에서 State와 일반 변수의 차이점으로 올바른 것은 무엇입니까?",
      options: [
        "State는 자바스크립트 문법이 아니다",
        "일반 변수는 값이 변경되면 자동으로 화면이 바뀐다",
        "State는 값이 변경되면 화면에 반영된다",
        "State는 컴포넌트 밖에서만 사용할 수 있다",
      ],
      correctAnswerIndex: 2,
      exp: 25,
      isComplete: false,
    },
    {
      type: 1,
      section: 3,
      order: 7,
      id: "quiz-state-update-rule-final",
      title: "State 변경 규칙 퀴즈",
      question:
        "React에서 State 값을 직접 수정하면 안 되는 이유로 가장 적절한 것은 무엇입니까?",
      options: [
        "문법 오류가 발생하기 때문에",
        "JavaScript에서 금지된 문법이기 때문에",
        "React가 상태 변경을 감지하지 못해 화면이 갱신되지 않을 수 있기 때문에",
        "코드 스타일 가이드에 어긋나기 때문에",
      ],
      correctAnswerIndex: 2,
      exp: 30,
      isComplete: false,
    },
    {
      type: 0,
      section: 3,
      order: 8,
      id: "state-common-mistakes",
      title: "+ State에서 가장 많이 하는 실수들",
      exp: 20,
      isComplete: false,
      content:
        "State는 React에서 가장 중요한 개념인 만큼,\n처음 배울 때 실수도 가장 많이 발생합니다.\n\n이번 강의에서는 **초보자가 가장 자주 하는 State 실수 3가지**를 살펴봅니다.\n\n---\n\n### ❌ 실수 1. State를 직접 수정하기\n\n```jsx\ncount = count + 1; // ❌ 잘못된 방법\n```\n\nState를 직접 수정하면 값은 바뀔 수 있지만,\nReact는 이 변화를 **감지하지 못합니다**.\n\n```jsx\nsetCount(count + 1); // ✅ 올바른 방법\n```\n\n> 📌 State는 반드시\n> **상태 변경 함수 - setter**로만 수정해야 합니다.\n\n---\n\n### ❌ 실수 2. State가 즉시 바뀔 거라고 생각하기\n\n```jsx\nsetCount(count + 1);\nconsole.log(count);\n```\n\n위 코드에서 console.log는 **변경되기 전 값**을 출력할 수 있습니다.\n\n> State 변경은 즉시 반영되지 않고,\n> React의 렌더링 흐름에 따라 처리됩니다.\n\n---\n\n### ❌ 실수 3. State를 너무 많이 만들기\n\n처음에는 모든 값을 State로 만들고 싶어집니다.\n\n하지만 화면에 영향을 주지 않는 값까지 State로 만들 필요는 없습니다.\n\n> 📌 **기준은 하나입니다**\n>\n> 이 값이 바뀌면 화면이 바뀌어야 하는가?\n>\n> - YES → State\n> - NO → 일반 변수\n\n---\n\n이 실수들만 피해도 React 코드는 훨씬 안정적으로 동작하게 됩니다.",
    },
    {
      type: 0,
      section: 3,
      order: 9,
      id: "state-summary-review",
      title: "Section 3 마무리: State 한 번에 정리하기",
      exp: 15,
      isComplete: false,
      content:
        '이번 섹션에서는 React의 핵심 개념인 **State**에 대해 배웠습니다.\n\n이제 중요한 내용을 차분하게 한 번 정리해봅시다.\n\n---\n\n### 🧠 State 핵심 요약\n\n> 📌 State란?\n>\n> - 컴포넌트가 기억하는 값\n> - 값이 변경되면 화면이 다시 렌더링됨\n\n> --- \n\n > --- \n\n > 📌 State 사용 규칙\n>\n> - State는 **useState**로 선언한다\n> - 값은 반드시 상태 변경 함수로만 수정한다\n> - State 변경 → 컴포넌트 재실행\n\n---\n\n### 🔄 State 사고방식 정리\n\nReact에서는 이렇게 생각하면 됩니다.\n\n> "값이 바뀌면, 화면도 함께 바뀌어야 한다면\n> 그 값은 State다."\n\n이 기준만 기억해도\nState를 언제 써야 할지 헷갈리지 않게 됩니다.\n\n---\n\n### ▶️ 다음 섹션 예고\n\n다음 섹션에서는\n**Props**를 사용해 컴포넌트 간에\n데이터를 전달하는 방법을 배웁니다.\n\nState를 이해했다면,\nProps는 훨씬 쉽게 느껴질 것입니다.\n\n수고하셨습니다 👏\n이제 한 단계 더 React에 가까워졌습니다.',
    },
    {
      title: "Props로 데이터 전달하기",
      type: 0,
      order: 1,
      section: 4,
      exp: 20,
      isComplete: false,
      id: "props-passing-data",
      content:
        'React에서 **Props**는\n부모 컴포넌트가 자식 컴포넌트에게 전달하는 **데이터**입니다.\n\n쉽게 말해,\n> 부모가 자식에게 주는 **읽기 전용 값**입니다.\n\n---\n\n### ❓ 왜 Props가 필요할까요?\n\n컴포넌트는 혼자서만 존재하지 않습니다.\n대부분의 경우, 여러 컴포넌트가 **함께 협력**하며 하나의 화면을 만듭니다.\n\n이때 컴포넌트 간에 데이터를 주고받아야 하는데,\n그 역할을 하는 것이 바로 **Props**입니다.\n\n---\n\n### 👨‍👩‍👧 부모 → 자식 구조 이해하기\n\n아래 예제를 살펴봅시다.\n\n```jsx\n// 부모 컴포넌트\n<MyButton text="저장하기" />\n```\n\n부모 컴포넌트는\n`text`라는 이름의 Props를 자식에게 전달합니다.\n\n```jsx\n// 자식 컴포넌트\nfunction MyButton(props) {\n  return <button>{props.text}</button>;\n}\n```\n\n- `props.text` → 부모가 전달한 값\n- 자식 컴포넌트는 이 값을 **사용만 할 수 있고 수정할 수는 없습니다**.\n\n---\n\n### 📌 꼭 기억하세요\n\n- Props는 **위에서 아래로**만 전달됩니다 (부모 → 자식)\n- 자식 컴포넌트는 Props를 **변경할 수 없습니다**\n- 화면에 표시되는 데이터의 대부분은 Props로 전달됩니다',
    },
    {
      type: 0,
      section: 4,
      order: 2,
      id: "props-vs-state",
      title: "Props와 State의 차이점 이해하기",
      exp: 15,
      isComplete: false,
      content:
        'Props와 State는 둘 다\n컴포넌트에서 사용하는 데이터이지만,\n역할은 완전히 다릅니다.\n\n---\n\n### 🧠 한 문장으로 정리하면\n\n> - **State**: 컴포넌트가 스스로 관리하는 값\n> - **Props**: 부모가 내려주는 값\n\n---\n\n### 📊 Props vs State 비교\n\n- State는 컴포넌트 안에서 선언됩니다\n- Props는 컴포넌트 밖(부모)에서 전달됩니다\n\n```jsx\n// 부모\nfunction App() {\n  return <MyButton text="확인" />;\n}\n\n// 자식\nfunction MyButton(props) {\n  return <button>{props.text}</button>;\n}\n```\n\n- `text`는 MyButton의 State가 아닙니다\n- 부모(App)가 결정한 값입니다\n\n---\n\n### ❗ 초보자가 가장 많이 하는 착각\n\n> ❌ "Props도 State처럼 바꾸면 되지 않나요?"\n\n아닙니다.\n\nProps는 **읽기 전용**이며,\n자식 컴포넌트는 받은 값을 변경할 수 없습니다.\n\n이 규칙 덕분에\n컴포넌트 구조가 훨씬 예측 가능해집니다.',
    },
    {
      id: "props-pass-setstate",
      type: 0,
      section: 4,
      order: 3,
      title: "함수도 Props로 전달할 수 있어요",
      exp: 20,
      isComplete: false,
      content:
        "Props로는 문자열이나 숫자뿐만 아니라\n**함수도 전달할 수 있습니다**.\n\n이 방식은 React에서\n아주 자주 사용되는 중요한 패턴입니다.\n\n---\n\n### ❓ 왜 함수까지 전달할까요?\n\nState는 부모가 가지고 있지만,\n버튼 클릭 같은 이벤트는 자식에서 발생하는 경우가 많습니다.\n\n이때,\n> 자식이 부모의 State를 직접 바꿀 수는 없기 때문에\n> **부모가 만든 함수를 Props로 내려줍니다**.\n\n---\n\n### 🔄 구조 예제\n\n```jsx\n// 부모 컴포넌트\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  return <CounterButton onIncrease={() => setCount(count + 1)} />;\n}\n\n// 자식 컴포넌트\nfunction CounterButton(props) {\n  return <button onClick={props.onIncrease}>증가</button>;\n}\n```\n\n---\n\n### 🧠 이 구조의 핵심\n\n- State는 여전히 **부모가 관리**합니다\n- 자식은 이벤트만 발생시킵니다\n- 실제 상태 변경은 부모에서 이루어집니다\n\n> 이 패턴을 이해하면\n> React 컴포넌트 구조가 한눈에 보이기 시작합니다.",
    },
    {
      type: 0,
      section: 4,
      order: 4,
      id: "props-common-mistakes",
      title: "+ Props 사용 시 주의할 점",
      exp: 10,
      isComplete: false,
      content:
        "Props를 처음 사용할 때\n자주 발생하는 실수들이 있습니다.\n\n---\n\n### ❌ 실수 1. Props를 직접 수정하려고 하기\n\n```jsx\nprops.text = '변경'; // ❌ 잘못된 코드\n```\n\nProps는 읽기 전용이기 때문에\n직접 수정하면 안 됩니다.\n\n---\n\n### ❌ 실수 2. Props와 State를 헷갈리기\n\n> \"이 값은 Props일까, State일까?\"\n\n이렇게 판단하면 됩니다.\n\n> 📌 이 값은 누가 관리해야 할까?\n>\n> - 컴포넌트 자신 → State\n> - 부모 → Props\n\n---\n\n### ❌ 실수 3. 너무 많은 Props 전달하기\n\nProps가 지나치게 많아지면\n컴포넌트가 이해하기 어려워집니다.\n\n이 경우에는\n컴포넌트 분리를 다시 고민해보는 것이 좋습니다.",
    },
    {
      type: 0,
      section: 4,
      order: 5,
      id: "props-destructuring-intro",
      title: "Props를 더 간단하게 받는 방법",
      exp: 10,
      isComplete: false,
      content:
        "지금까지 우리는 Props를 이렇게 사용했습니다.\n\n```jsx\nfunction MyButton(props) {\n  return <button>{props.text}</button>;\n}\n```\n\n이 방식은 전혀 문제가 없고,\nReact를 처음 배울 때 가장 이해하기 쉬운 방법입니다.\n\n---\n\n### ✨ 더 간단한 작성법\n\nJavaScript의 **구조 분해 할당**을 사용하면\nProps를 더 간결하게 받을 수 있습니다.\n\n```jsx\nfunction MyButton({ text }) {\n  return <button>{text}</button>;\n}\n```\n\n---\n\n### 🤔 이게 왜 같은 코드인가요?\n\n아래 두 코드는 완전히 동일하게 동작합니다.\n\n```jsx\nprops.text\n```\n\n```jsx\nconst { text } = props;\n```\n\nReact 문법이 아니라\n**자바스크립트 문법**입니다.\n\n---\n\n### 📌 언제 사용하면 좋을까요?\n\n- Props가 많아질 때\n- 코드 가독성을 높이고 싶을 때\n- 실무 코드 스타일에 익숙해지고 싶을 때\n\n> ❗ 처음에는\n> `props.text` 방식으로 써도 전혀 문제 없습니다.\n> 익숙해지면 천천히 사용해보세요.",
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
        "HTML 태그 속성을 의미하는 React 전용 문법",
      ],
      correctAnswerIndex: 1,
      exp: 20,
      isComplete: false,
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
      isComplete: false,
    },
    {
      type: 1,
      section: 4,
      order: 8,
      id: "quiz-props-function",
      title: "함수 Props 이해하기",
      question:
        "다음 중 부모가 자식에게 함수 형태로 Props를 전달하는 이유는 무엇일까요?",
      options: [
        "자식에서 직접 부모 State를 수정하기 위해",
        "자식이 상태를 기억하기 위해",
        "자식에서 이벤트 발생 시 부모의 상태를 변경할 수 있도록 하기 위해",
        "자식 컴포넌트를 독립적으로 만들기 위해",
      ],
      correctAnswerIndex: 2,
      exp: 25,
      isComplete: false,
    },
    {
      type: 1,
      section: 4,
      order: 9,
      id: "quiz-props-destructuring",
      title: "Props 구조 분해 퀴즈",
      question:
        "아래 두 코드 중 동작이 같은 것을 모두 고르세요.\n\nA) props.text\nB) const { text } = props; text",
      options: [
        "둘 다 동작한다",
        "A만 동작한다",
        "B만 동작한다",
        "둘 다 동작하지 않는다",
      ],
      correctAnswerIndex: 0,
      exp: 25,
      isComplete: false,
    },
    {
      type: 1,
      section: 4,
      order: 10,
      id: "quiz-props-mistakes",
      title: "Props 사용 시 주의점",
      question:
        "자식 컴포넌트에서 Props 값을 직접 수정하면 안 되는 이유는 무엇인가요?",
      options: [
        "Props는 읽기 전용이어서 직접 수정하면 컴포넌트 상태 관리가 예측 불가능해지기 때문",
        "Props는 숫자만 담을 수 있기 때문",
        "Props는 자식 컴포넌트에서만 사용할 수 있기 때문",
        "Props를 수정하면 부모 컴포넌트가 사라지기 때문",
      ],
      correctAnswerIndex: 0,
      exp: 30,
      isComplete: false,
    },
    {
      type: 0,
      section: 4,
      order: 11,
      id: "props-summary-review",
      title: "Props 마무리 & 복습",
      exp: 15,
      isComplete: false,
      content:
        "이번 Section에서는 React에서 가장 기본적이면서 중요한 **Props** 개념을 배웠습니다.\n\n---\n\n### 🔑 핵심 요약\n1. **Props란?**\n   - 부모가 자식에게 내려주는 **읽기 전용 데이터**\n   - 자식은 수정할 수 없고, 단지 사용할 수 있음\n\n2. **Props vs State**\n   - **State**: 컴포넌트 자신이 관리하는 값\n   - **Props**: 부모가 전달하는 값\n\n3. **함수도 Props로 전달 가능**\n   - 자식에서 이벤트를 발생시켜 부모의 상태를 변경할 때 사용\n\n4. **구조 분해 할당**\n   - `props.text` ↓↓↓ `{ text }`로 간단히 받기 가능\n\n5. **주의할 점**\n   - Props는 **직접 수정 금지**\n   - Props와 State를 혼동하지 않기\n   - 너무 많은 Props 전달은 피하기\n\n---\n\n### 🧩 복습 체크리스트\n- [ ] 부모 → 자식 데이터 전달 구조 이해하기\n- [ ] State와 Props 차이 명확히 구분하기\n- [ ] 이벤트 함수를 Props로 내려주는 패턴 이해하기\n- [ ] 구조 분해 할당으로 Props 받기\n- [ ] Props를 직접 수정하지 않기\n\n이제 Props 개념을 충분히 이해했으니,\n다음 Section에서는 **리스트 렌더링과 반복되는 데이터를 화면에 보여주는 방법**을 배워보겠습니다.",
    },
    {
      id: "event-what-is-event",
      section: 5,
      order: 1,
      type: 0,
      title: "React에서 이벤트(Event)란?",
      exp: 15,
      isComplete: false,
      content:
        "React에서 **이벤트**(Event)란\n사용자가 화면과 상호작용할 때 발생하는 모든 행동을 의미합니다.\n\n예를 들면 다음과 같습니다.\n\n- 버튼 클릭\n- 입력창에 글자 입력\n- 마우스 올리기\n\n---\n\n### ❓ 이벤트는 왜 중요한가요?\n\nReact 앱은 대부분\n**사용자의 행동에 따라 화면이 바뀌는 구조**입니다.\n\n> 사용자의 행동 → 이벤트 발생 → 함수 실행 → State 변경 → 화면 업데이트\n\n이 흐름의 시작점이 바로 **이벤트**입니다.\n\n---\n\n### 📌 React 이벤트의 특징\n\n- HTML 이벤트와 거의 비슷하지만, **카멜 케이스**(camelCase)를 사용합니다.\n- 문자열이 아닌 **함수**를 전달합니다.\n\n```jsx\n<button onClick={handleClick}>클릭</button>\n```",
    },
    {
      id: "event-html-vs-react",
      section: 5,
      order: 2,
      type: 0,
      title: "HTML 이벤트와 React 이벤트의 차이",
      exp: 15,
      isComplete: false,
      content:
        'React 이벤트는 HTML 이벤트와 비슷해 보이지만 중요한 차이가 있습니다.\n\n---\n\n### ❌ HTML 방식\n```html\n<button onclick="handleClick()">클릭</button>\n```\n\n---\n\n### ✅ React 방식\n```jsx\n<button onClick={handleClick}>클릭</button>\n```\n\n---\n\n### 🧠 핵심 차이 정리\n\n- `onclick` ❌ → `onClick` ✅\n- 문자열 ❌ → 함수 전달 ✅\n\n> React에서는\n> **이 함수가 클릭되면 실행돼**라고 전달하는 방식입니다.',
    },
    {
      id: "event-handler-function",
      section: 5,
      order: 3,
      type: 0,
      title: "이벤트 핸들러 함수 만들기",
      exp: 20,
      isComplete: false,
      content:
        "이벤트가 발생했을 때 실행되는 함수를\n**이벤트 핸들러**(Event Handler)라고 부릅니다.\n\n---\n\n### 기본 예제\n```jsx\nfunction App() {\n  const handleClick = () => {\n    console.log('버튼이 클릭되었습니다');\n  };\n\n  return <button onClick={handleClick}>클릭</button>;\n}\n```\n\n---\n\n### 🔍 코드 해석\n\n- **handleClick**은 **이벤트 핸들러 함수**입니다.\n- 버튼을 클릭하면 React가 이 함수를 실행합니다.\n\n> 📌 이벤트 핸들러 이름은\n> `handleClick` `onSubmit` `onChange`처럼 **의미가 드러나게** 짓는 것이 좋습니다.",
    },
    {
      id: "event-function-vs-execution",
      section: 5,
      order: 4,
      type: 0,
      title: "함수를 전달할까? 실행할까?",
      exp: 20,
      isComplete: false,
      content:
        "React 이벤트에서 초보자가 가장 많이 헷갈리는 부분입니다.\n\n---\n\n### ❌ 잘못된 코드\n```jsx\n<button onClick={handleClick()}>클릭</button>\n```\n\n이 코드는 **렌더링 시점에 바로 함수가 실행**됩니다.\n\n---\n\n### ✅ 올바른 코드\n```jsx\n<button onClick={handleClick}>클릭</button>\n```\n\n---\n\n### 🧠 기억하세요\n\n- `handleClick` → 함수 **전달**\n- `handleClick()` → 함수 **즉시 실행**\n\n> React 이벤트에는 **실행 결과**가 아니라 **함수 자체**를 전달해야 합니다.",
    },
    {
      id: "event-state-update",
      section: 5,
      order: 5,
      type: 0,
      title: "이벤트로 State 변경하기",
      exp: 25,
      isComplete: false,
      content:
        "이벤트는 단순히 콘솔 로그를 찍는 데서 끝나지 않습니다.\n\n가장 중요한 역할은 **State를 변경하는 것**입니다.\n\n---\n\n### 예제: 버튼 클릭 시 숫자 증가\n```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  const increase = () => {\n    setCount(count + 1);\n  };\n\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={increase}>증가</button>\n    </div>\n  );\n}\n```\n\n---\n\n### 🔄 흐름 정리\n\n- 버튼 클릭\n- increase 함수 실행\n- setCount 호출\n- State 변경\n- 화면 재렌더링\n\n> 이 흐름을 이해하면 React의 절반은 이해한 것입니다.",
    },
    {
      id: "event-common-mistakes",
      section: 5,
      order: 6,
      type: 0,
      title: "+ 이벤트에서 가장 많이 하는 실수",
      exp: 15,
      isComplete: false,
      content:
        '이벤트를 처음 다룰 때\n자주 발생하는 실수들을 정리해봅니다.\n\n---\n\n### ❌ 실수 1. 함수를 즉시 실행하기\n```jsx\nonClick={handleClick()} // ❌\n```\n\n---\n\n### ❌ 실수 2. HTML 이벤트 방식 사용하기\n```jsx\nonclick="handleClick()" // ❌\n```\n\n---\n\n### ❌ 실수 3. State를 직접 변경하기\n```jsx\ncount = count + 1 // ❌\n```\n\n> 이벤트 + State는 항상\n> **setter 함수**와 함께 사용하세요.',
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
        "onclick={handleClick()}",
      ],
      correctAnswerIndex: 1,
      explanation:
        "React 이벤트는 camelCase를 사용하며, 문자열이 아닌 함수 자체를 전달해야 합니다.",
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
        "onClick={handleClick + 1}",
      ],
      correctAnswerIndex: 1,
    },
    {
      id: "quiz-event-short-answer",
      section: 5,
      order: 9,
      type: 2,
      title: "이벤트 개념 단답 퀴즈",
      exp: 20,
      isComplete: false,
      question:
        "React에서 이벤트 핸들러에 전달해야 하는 것은 함수의 실행 결과일까요, 함수 그 자체일까요?",
      correctAnswer: "함수",
    },
    {
      id: "event-summary-review",
      section: 5,
      order: 10,
      type: 0,
      title: "Section 5 마무리: 이벤트 한 번에 정리하기",
      exp: 15,
      isComplete: false,
      content:
        "이번 Section에서는\nReact에서 **이벤트**(Event)를 다루는 방법을 배웠습니다.\n\n---\n\n### ✅ 핵심 요약\n\n- 이벤트는 **사용자의 행동**입니다\n- React 이벤트는 camelCase를 사용합니다 (**onClick**)\n- 이벤트에는 **함수 자체**를 전달합니다\n- 이벤트를 통해 State를 변경하면 화면이 업데이트됩니다\n\n---\n\n### 🎯 지금 할 수 있는 것\n\n- 버튼 클릭 이벤트 처리하기\n- 이벤트로 State 변경하기\n- 이벤트 문법 실수 피하기\n\n---\n\n이제 다음 Section에서는\n**여러 개의 데이터를 다루는 방법**,\n즉 **List / Object와 불변성**을 배워보겠습니다.\n\n이제 진짜 앱다운 구조로 들어갑니다 🚀",
    },
    {
      id: "list-intro",
      type: 0,
      section: 6,
      order: 1,
      title: "List와 Object 기초 이해하기",
      exp: 10,
      isComplete: false,
      content:
        "React에서 자주 사용하는 데이터 구조인 **배열 - List**과 **객체 - Object**에 대해 배워봅니다.\n\n---\n\n### 1️⃣ List와 Object의 차이\n- List(배열): 순서가 있는 데이터 묶음, 예: [1, 2, 3]\n- Object(객체): key-value 쌍으로 데이터 저장, 예: {name: '철수', age: 20}\n\n---\n\n### 2️⃣ React에서 List와 Object 사용 이유\n- 화면에 여러 데이터를 반복해서 보여줄 때 배열 사용\n- 한 데이터의 속성을 관리할 때 객체 사용\n- 배열과 객체를 state로 관리하며 동적인 화면을 만들 수 있습니다.",
    },
    {
      id: "list-render",
      type: 0,
      section: 6,
      order: 2,
      title: "배열 데이터를 화면에 반복 렌더링하기",
      exp: 15,
      isComplete: false,
      content:
        "배열을 화면에 반복해서 표시할 때는 JavaScript의 **map()** 함수를 사용합니다.\n\n---\n\n### map() 함수 구조\n`map()` 함수는 배열의 각 항목을 순회하며 새로운 값을 반환합니다.\n```jsx\narray.map((item, index) => {\n  // item: 현재 요소 값\n  // index: 현재 요소 인덱스\n});\n```\n- **첫 번째 인수(item)**: 현재 배열 항목의 값\n- **두 번째 인수(index)**: 현재 배열 항목의 인덱스\n\n---\n\n### 예제\n```jsx\nconst fruits = ['사과', '바나나', '딸기'];\n\nreturn (\n  <ul>\n    {fruits.map((fruit, idx) => (\n      <li key={idx}>{idx + 1}. {fruit}</li>\n    ))}\n  </ul>\n);\n```\n- 위 코드에서 `idx`는 순서 번호를 표시하거나, 상황에 따라 key로 활용할 수 있습니다.\n\n---\n\n### 📌 주의 사항\n- React에서 배열을 렌더링할 때는 항상 **key** 속성을 지정해야 합니다.\n- key는 각 항목을 고유하게 식별하여 업데이트 효율을 높입니다.\n- index를 key로 사용하는 것은 배열이 고정되어 있을 때만 안전합니다. 동적으로 항목이 추가/삭제되는 경우에는 고유한 값을 사용하는 것이 권장됩니다.",
    },
    {
      id: "list-key",
      type: 0,
      section: 6,
      order: 3,
      title: "key는 왜 필요할까요?",
      exp: 15,
      isComplete: false,
      content:
        "배열을 렌더링할 때 key를 주지 않으면 React는 **어떤 항목이 변경되었는지 추적하기 어렵습니다**.\n\n---\n\n### key 사용법\n```jsx\nconst fruits = ['사과', '바나나', '딸기'];\n\nreturn (\n  <ul>\n    {fruits.map((item, index) => (\n      <li key={index}>{fruit}</li>\n    ))}\n  </ul>\n);\n```\n\n- key는 배열 항목의 **고유한 값**이어야 합니다.\n- index를 key로 쓰는 것은 가능하지만, 배열이 변경될 가능성이 있으면 권장하지 않습니다.",
    },
    {
      id: "state-array-copy",
      type: 0,
      section: 6,
      order: 4,
      title: "배열/객체 수정: 새 데이터 만들기",
      exp: 15,
      isComplete: false,
      content:
        "React에서 배열이나 객체를 state로 관리할 때는 **항상 새로운 배열/객체를 만들어야** 합니다.\n\n---\n\n### ❓ 왜 새로운 데이터를 만들어야 할까요?\n- React는 state가 이전 값과 다른지 비교해 **변경이 일어났는지 감지**합니다.\n- 배열이나 객체를 직접 수정하면 **참조(reference)가 변하지 않아** React가 변경을 감지하지 못할 수 있습니다.\n\n---\n\n### 🔹 스프레드 연산자(...)\n- 새로운 배열/객체를 쉽게 만들 수 있는 자바스크립트 문법입니다.\n\n#### 배열 예제\n```jsx\nconst todos = ['우유', '공부'];\nconst newTodos = [...todos, '청소'];\nconsole.log(newTodos);\n```\n**출력:**\n```\n['우유', '공부', '청소']\n```\n\n#### 객체 예제\n```jsx\nconst user = { name: '철수', age: 20 };\nconst newUser = { ...user, age: 21 };\nconsole.log(newUser);\n```\n**출력:**\n```\n{ name: '철수', age: 21 }\n```\n\n> ✅ 이렇게 하면 React가 새로운 참조를 인식하고 화면이 올바르게 업데이트됩니다.",
    },
    {
      id: "state-immutability",
      type: 0,
      section: 6,
      order: 5,
      title: "불변성(Immutable)과 React 상태 관리",
      exp: 15,
      isComplete: false,
      content:
        "React에서 state를 다룰 때 **불변성을 지키는 것이 왜 중요한지** 자세히 알아봅시다.\n\n---\n\n### 1️⃣ 불변성이란?\n- 배열이나 객체를 직접 변경하지 않고, 항상 새로운 배열/객체를 만드는 원칙\n- '값이 바뀌면 새로운 것 생성'이라고 생각하면 이해하기 쉽습니다.\n\n---\n\n### 2️⃣ React가 상태 변화를 감지하는 방법\n- React는 내부적으로 이전 state와 새로운 state를 **얕은 비교(shallow comparison)** 합니다.\n- 배열이나 객체를 직접 수정하면 **참조(reference)가 변하지 않아** React가 '변경 없음'으로 판단합니다.\n- 새 배열/객체를 만들면 참조가 바뀌므로 React가 **변경을 감지하고 재렌더링**을 수행합니다.\n\n---\n\n### 3️⃣ 예제 비교\n// 잘못된 방법 ❌\n`todos.push('청소');`\nsetTodos(todos); // React가 업데이트를 감지하지 못할 수 있음\n\n// 올바른 방법 ✅\n`setTodos([...todos, '청소']);` // 새 배열을 생성, React가 감지하고 화면 갱신\n\n---\n### 4️⃣ 핵심 요약\n- 배열/객체 state를 직접 수정하지 마세요\n- 항상 새 배열/객체를 만들어 setState에 전달하세요\n- 스프레드 연산자(...), map(), filter(), concat() 같은 함수를 활용하면 편리합니다\n- 불변성을 지켜야 React 상태 관리가 안전하고 예측 가능합니다",
    },
    {
      id: "list-quiz-1",
      section: 6,
      order: 6,
      title: "배열 렌더링 함수 이름",
      type: 2,
      exp: 10,
      isComplete: false,
      question:
        "배열을 화면에 반복 렌더링할 때 사용하는 JavaScript 메서드의 이름을 쓰세요.",
      correctAnswer: "map",
      explanation:
        "React에서는 배열을 화면에 반복 표시할 때 `map()` 함수를 사용합니다.",
    },
    {
      id: "list-quiz-2",
      section: 6,
      order: 7,
      title: "map 함수 인수 의미",
      type: 2,
      exp: 10,
      isComplete: false,
      question:
        "map 함수에서 두 번째 인수는 무엇을 의미하나요?(영단어로 쓰세요)",
      correctAnswer: "index",
      explanation:
        "map((item, index) => ...)에서 첫 번째 인수는 배열의 현재 항목, 두 번째 인수는 해당 항목의 인덱스를 의미합니다.",
    },
    {
      id: "list-quiz-3",
      section: 6,
      order: 8,
      title: "key 속성 필요성",
      type: 1,
      exp: 15,
      isComplete: false,
      question:
        "React에서 배열을 렌더링할 때 key 속성을 지정해야 하는 이유는 무엇인가요?",
      options: [
        "배열 항목의 순서를 무조건 고정하기 위해",
        "어떤 항목이 변경되었는지 React가 효율적으로 추적하기 위해",
        "HTML에서 필수 속성이기 때문에",
        "배열의 길이를 계산하기 위해",
      ],
      correctAnswerIndex: 1,
      explanation:
        "key 속성은 React가 각 항목을 고유하게 식별하고 변경된 항목만 업데이트하도록 돕습니다.",
    },
    {
      id: "list-quiz-4",
      section: 6,
      order: 9,
      title: "state 배열/객체 불변성",
      type: 1,
      exp: 15,
      isComplete: false,
      question:
        "React state에서 배열이나 객체를 직접 수정하지 않고 새로운 배열/객체를 만들어야 하는 이유는 무엇인가요?",
      options: [
        "코드가 더 간결해지기 때문",
        "React가 이전 state와 다른지 비교해 변경 여부를 감지할 수 있도록",
        "브라우저 호환성 문제 때문에",
        "자바스크립트 문법에서 배열/객체는 항상 새로 만들어야 하기 때문",
      ],
      correctAnswerIndex: 1,
      explanation:
        "React는 state가 이전 값과 다른지를 비교해 변경 여부를 감지합니다. 기존 배열/객체를 직접 수정하면 참조가 그대로여서 변경 감지가 되지 않을 수 있습니다.",
    },
    {
      id: "list-quiz-5",
      section: 6,
      order: 10,
      title: "불변성 유지하며 배열 항목 추가하기",
      type: 2,
      exp: 15,
      isComplete: false,
      question:
        "배열 `const fruits = ['banana', 'apple']`에 불변성을 유지하면서 `orange` 항목이 추가된 const newFruits를 선언하는 코드를 작성하세요.",
      correctAnswer:
        "const newFruits = [...fruits, 'orange'];,,const newFruits = [...fruits, \"orange\"];",
      explanation:
        "스프레드 연산자를 사용하면 기존 배열을 직접 수정하지 않고 새로운 배열을 만들 수 있습니다. React state를 업데이트할 때 불변성을 유지하면 변경을 React가 올바르게 감지할 수 있습니다.",
    },
    {
      id: "list-summary-review",
      type: 0,
      section: 6,
      order: 11,
      title: "Section6 마무리 & 복습: 리스트와 객체 다루기",
      exp: 20,
      isComplete: false,
      content:
        "이번 Section에서는 React에서 배열과 객체를 다루는 방법을 배웠습니다.\n\n---\n\n### ✅ 핵심 정리\n- **배열/객체 반복 렌더링**\n   - map() 함수를 사용하여 배열 항목을 화면에 반복 표시합니다.\n   - map()의 첫 번째 인수는 항목(item), 두 번째 인수는 index(순서)입니다.\n\n- **key의 중요성**\n   - React가 어떤 항목이 변경되었는지 추적하는 데 필요합니다.\n   - 배열 항목을 고유하게 식별할 수 있는 값으로 지정합니다.\n\n- **State에서 배열/객체 직접 수정 금지**\n   - 기존 배열/객체를 직접 바꾸면 React가 변경을 감지하지 못할 수 있습니다.\n   - 항상 새로운 배열/객체를 만들어서 setState 함수로 업데이트해야 합니다.\n\n- **스프레드 연산자(...) 활용**\n   - 기존 배열/객체를 복사하면서 새로운 항목을 추가하거나 일부 속성을 변경할 때 사용합니다.\n   - React에서 불변성을 유지하면서 state를 업데이트하는 가장 일반적인 패턴입니다.\n\n---\n\n### ⚠️ 자주 하는 실수\n- 배열/객체를 직접 수정하고 setState를 호출함\n- key를 지정하지 않거나 index를 무분별하게 key로 사용함\n- map() 함수의 index를 잘못 활용하여 렌더링 순서가 꼬임\n\n---\n\n### 💡 팁\n- 작은 배열이라도 항상 불변성을 지키는 습관을 들이세요.\n- key는 가능하면 고유 식별자를 사용하고, 불가피하게 index를 쓴다면 배열이 변경되지 않는 경우에만 사용하세요.\n- map(), filter(), spread 연산자 등은 React에서 상태 관리를 할 때 매우 자주 사용되는 도구입니다.\n\n> 🎯 이 섹션에서 배운 내용을 잘 이해하면, 이후 프로젝트에서 리스트와 상태 관리를 훨씬 안전하고 효율적으로 할 수 있습니다.",
    },
    {
      id: "form-intro",
      section: 7,
      order: 1,
      type: 0,
      title: "왜 Form 이벤트를 배워야 할까요?",
      exp: 10,
      isComplete: false,
      content:
        "지금까지 우리는 버튼 클릭 이벤트를 통해 State를 변경하는 방법을 배웠습니다.\n\n하지만 실제 앱에서는 **사용자의 입력값**을 받아야 하는 경우가 훨씬 많습니다.\n\n---\n\n### 예를 들면\n\n- Todo 입력하기\n- 검색어 입력\n- 로그인 폼 작성\n\n이때 반드시 필요한 것이 바로 **Form 이벤트**입니다.\n\n> 📌 Todo-List 앱의 시작은 버튼이 아니라 **input + form** 입니다.\n\n이번 Section에서는 Todo 실습을 시작하기 전에 꼭 필요한\n**입력 이벤트의 기초**를 다뤄봅니다.",
    },
    {
      id: "form-controlled-input",
      section: 7,
      order: 2,
      type: 0,
      title: "input 값은 왜 State로 관리할까요?",
      exp: 15,
      isComplete: false,
      content:
        "React에서 input 요소는 보통 **State와 연결해서 관리**합니다.\n\n이 방식을 **제어 컴포넌트**(Controlled Component)라고 부릅니다.\n\n---\n\n### 기본 구조\n```jsx\nconst [text, setText] = useState('');\n\n<input value={text} />\n```\n\n이 상태에서는\ninput에 아무것도 입력할 수 없습니다.\n\n---\n\n### 왜 그럴까요?\n\n- input의 값은 `value={text}`로 고정되어 있고\n- text는 아직 변경되지 않기 때문입니다.\n\n> 즉, **입력값을 바꾸는 이벤트가 필요합니다.**",
    },
    {
      id: "form-onchange",
      section: 7,
      order: 3,
      type: 0,
      title: "onChange 이벤트로 입력값 처리하기",
      exp: 20,
      isComplete: false,
      content:
        "input의 값이 바뀔 때마다 실행되는 이벤트가\n바로 **onChange** 입니다.\n\n---\n\n### 기본 예제\n```jsx\nfunction InputExample() {\n  const [text, setText] = useState('');\n\n  const handleChange = (e) => {\n    setText(e.target.value);\n  };\n\n  return (\n    <input\n      value={text}\n      onChange={handleChange}\n    />\n  );\n}\n```\n\n---\n\n### 🧠 코드 흐름 이해하기\n\n- 사용자가 키보드를 입력\n- onChange 이벤트 발생\n- 이벤트 객체(e)가 전달됨\n- e.target.value로 입력값 접근\n- setText로 State 변경\n- 화면 업데이트\n\n> 이 구조는 이후 Todo 입력에서도 그대로 사용됩니다.",
    },
    {
      id: "form-event-object",
      section: 7,
      order: 4,
      type: 0,
      title: "이벤트 객체(e)는 무엇인가요?",
      exp: 15,
      isComplete: false,
      content:
        "onChange, onSubmit 같은 이벤트에는\n항상 **이벤트 객체**가 전달됩니다.\n\n보통 관례적으로 `e` 또는 `event`라고 이름 짓습니다.\n\n---\n\n### 자주 사용하는 속성\n\n```jsx\ne.target.value\n```\n\n- `e.target` 이벤트가 발생한 요소\n- `value` input에 입력된 값\n\n---\n\n### 기억 포인트\n\n> 📌 Form 이벤트에서 가장 많이 사용하는 값은\n> **e.target.value 하나면 충분합니다.**\n\n처음부터 모든 속성을 외울 필요는 없습니다.",
    },
    {
      id: "form-submit",
      section: 7,
      order: 5,
      type: 0,
      title: "form과 onSubmit 이벤트",
      exp: 20,
      isComplete: false,
      content:
        "input과 버튼을 감싸는 태그가 바로 **form** 입니다.\n\nform은 기본적으로 **제출**(submit)이라는 동작을 가지고 있습니다.\n\n---\n\n### 기본 form 구조\n```jsx\n<form onSubmit={handleSubmit}>\n  <input />\n  <button>추가</button>\n</form>\n```\n\n- 버튼 클릭\n- Enter 키 입력\n\n➡️ 모두 submit 이벤트를 발생시킵니다.",
    },
    {
      id: "form-prevent-default",
      section: 7,
      order: 6,
      type: 0,
      title: "event.preventDefault()는 왜 필요할까요?",
      exp: 20,
      isComplete: false,
      content:
        "form의 submit 이벤트가 발생하면\n브라우저는 기본적으로 **페이지를 새로고침**합니다.\n\n하지만 React 앱에서는 이 동작을 원하지 않습니다.\n\n---\n\n### 그래서 사용하는 코드\n```jsx\nconst handleSubmit = (e) => {\n  e.preventDefault();\n};\n```\n\n---\n\n### 🧠 의미 정리\n\n `preventDefault()`\n→ 브라우저의 기본 동작을 막는다\n\n> 📌 Todo 앱에서 이 코드가 없다면\n> 버튼을 누를 때마다 화면이 새로고침됩니다.\n\nForm 이벤트에서 **거의 항상 함께 사용되는 필수 코드**입니다.",
    },
    {
      id: "form-submit-example",
      section: 7,
      order: 7,
      type: 0,
      title: "입력 + 제출 전체 흐름 예제",
      exp: 25,
      isComplete: false,
      content:
        "지금까지 배운 내용을 한 번에 연결해봅시다.\n\n---\n\n### 전체 예제 코드\n```jsx\nfunction SimpleForm() {\n  const [text, setText] = useState('');\n\n  const handleChange = (e) => {\n    setText(e.target.value);\n  };\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log(text);\n    setText('');\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={text} onChange={handleChange} />\n      <button>확인</button>\n    </form>\n  );\n}\n```\n\n---\n\n### 🔄 실행 흐름\n\n- 입력 → onChange → State 저장\n- 제출 → onSubmit → preventDefault\n- 입력값 사용 → State 초기화\n\n> 이 패턴이 **Todo 입력의 기본 뼈대**가 됩니다.",
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
      correctAnswerIndex: 2,
    },
    {
      id: "quiz-form-prevent",
      section: 7,
      order: 9,
      type: 2,
      title: "Form 이벤트 단답 퀴즈",
      exp: 25,
      isComplete: false,
      question:
        "form 제출 시 브라우저의 기본 동작(새로고침)을 막기 위해 호출하는 메서드는 무엇인가요?",
      correctAnswer: "preventDefault",
    },
    {
      id: "form-summary-review",
      section: 7,
      order: 10,
      type: 0,
      title: "Section7 마무리: Form 이벤트 정리",
      exp: 15,
      isComplete: false,
      content:
        "이번 Section에서는\nReact에서 **Form 이벤트**를 다루는 방법을 배웠습니다.\n\n---\n\n### ✅ 핵심 요약\n\n- input 값은 **State로 관리**합니다\n- 입력 변화는 **onChange**로 처리합니다\n- form 제출은 **onSubmit** 이벤트를 사용합니다\n- submit 시에는 반드시 **preventDefault**()를 호출합니다\n\n---\n\n### 🎯 지금 여러분이 할 수 있는 것\n\n- 입력값을 State로 관리할 수 있습니다\n- form 제출 시 새로고침을 막을 수 있습니다\n- Todo 입력 흐름을 이해할 준비가 되었습니다\n\n---\n\n이제 다음 Section에서는\n지금까지 배운 모든 내용을 종합해\n**Todo-List 프로젝트를 직접 만들어보겠습니다.**\n\n준비되셨나요? 💪",
    },
    {
      id: "todo-intro-structure",
      section: 8,
      order: 1,
      title: "Todo 프로젝트 시작 & 구조 살펴보기",
      type: 0,
      exp: 15,
      isComplete: false,
      content:
        "이번 섹션에서는 **Todo List 앱을 처음부터 직접 만들어봅니다.**\n\n---\n\n### 📁 프로젝트 진행 방식\n\n- 모든 작업은 **App.tsx 하나에서 시작**합니다.\n- 처음에는 컴포넌트를 나누지 않습니다.\n- 기능이 완성된 후, 점진적으로 컴포넌트로 분리합니다.\n\n---\n\n### 🧭 앞으로 만들 흐름 미리보기\n\n```\nApp.tsx\n ├─ 입력 폼\n ├─ Todo 리스트\n └─ Todo 아이템\n```\n\n지금은 하나의 파일이지만,\n점점 역할별로 나누면서 **왜 컴포넌트가 필요한지** 직접 느끼게 될 것입니다.\n\n> 💡 스타일(CSS)은 이번 강의에서 다루지 않습니다.\n> 기능과 구조에만 집중하세요.",
    },

    {
      id: "todo-state-init",
      section: 8,
      order: 2,
      title: "Todo 리스트 상태 만들기",
      type: 0,
      exp: 20,
      isComplete: false,
      content:
        "가장 먼저 Todo 목록을 저장할 **state**를 만들어봅니다.\n\n---\n\n### 🧠 Todo 데이터 구조\n\nTodo 하나는 다음 정보를 가집니다.\n- id: 고유 값\n- text: 할 일 내용\n\n```jsx\nconst [todos, setTodos] = useState([\n  { id: 1, text: '리액트 공부하기' },\n  { id: 2, text: 'Todo 앱 만들기' },\n]);\n```\n\n---\n\n### 📌 포인트\n- 배열 형태의 state\n- 객체를 요소로 가지는 리스트\n\n> 이 구조는 이후 삭제, 추가 기능에서 계속 사용됩니다.",
    },

    {
      id: "todo-render-list",
      section: 8,
      order: 3,
      title: "Todo 리스트 화면에 출력하기",
      type: 0,
      exp: 20,
      isComplete: false,
      content:
        "이제 Todo 리스트를 화면에 출력해봅니다.\n\n---\n\n### 🔁 map으로 리스트 렌더링\n\n```jsx\n<ul>\n  {todos.map((todo) => (\n    <li key={todo.id}>{todo.text}</li>\n  ))}\n</ul>\n```\n\n---\n\n### 📌 체크 포인트\n- map 함수 사용\n- key는 todo.id\n\n> 이제 화면에 여러 Todo 항목이 보일 것입니다.",
    },

    {
      id: "todo-input-state",
      section: 8,
      order: 4,
      title: "입력 폼과 입력 상태 만들기",
      type: 0,
      exp: 20,
      isComplete: false,
      content:
        "Todo를 추가하기 위해 입력창과 입력값을 저장할 state를 만듭니다.\n\n---\n\n```jsx\nconst [input, setInput] = useState('');\n```\n\n```jsx\n<input\n  value={input}\n  onChange={(e) => setInput(e.target.value)}\n/>\n```\n\n---\n\n### 📌 핵심\n- input은 **제어 컴포넌트**\n- 입력값은 항상 state로 관리\n\n> 이 구조는 React 폼 처리의 기본입니다.",
    },

    {
      id: "todo-submit-add",
      section: 8,
      order: 5,
      title: "폼 제출로 Todo 추가하기",
      type: 0,
      exp: 25,
      isComplete: false,
      content:
        "이제 입력한 값을 Todo 리스트에 추가해봅니다.\n\n---\n\n```jsx\nconst onSubmit = (e) => {\n  e.preventDefault();\n\n  const newTodo = {\n    id: Date.now(),\n    text: input,\n  };\n\n  setTodos([...todos, newTodo]);\n  setInput('');\n};\n```\n\n```jsx\n<form onSubmit={onSubmit}>\n  <input ... />\n  <button>추가</button>\n</form>\n```\n\n---\n\n### ✅ 결과\n- 입력 → 제출 → 리스트 추가\n- 기본 Todo List 완성 🎉",
    },

    {
      id: "todo-split-components",
      section: 8,
      order: 6,
      title: "심화 1: 컴포넌트로 분리해보기",
      type: 0,
      exp: 20,
      isComplete: false,
      content:
        "이제 코드가 길어졌습니다.\n역할별로 컴포넌트를 나눠봅니다.\n\n---\n\n### ✂️ 분리 대상\n- TodoForm\n- TodoList\n\n```jsx\n<TodoForm />\n<TodoList />\n```\n\n> ⚠️ 이 단계에서는 **아직 props를 전달하지 않습니다.**\n> 에러가 발생하는 것이 정상입니다.",
    },

    {
      id: "todo-error-why",
      section: 8,
      order: 7,
      title: "심화 2: 왜 에러가 발생할까요?",
      type: 0,
      exp: 25,
      isComplete: false,
      content:
        "컴포넌트로 옮긴 후 이런 에러가 발생할 수 있습니다.\n\n> ❌ todos가 정의되지 않았습니다\n\n---\n\n### 🧠 이유 분석\n- state는 App.tsx에 있음\n- 자식 컴포넌트는 해당 값을 모름\n\n> 해결 방법은 단 하나,\n> **부모가 자식에게 데이터를 내려주는 것**입니다.",
    },

    {
      id: "todo-pass-props",
      section: 8,
      order: 8,
      title: "심화 3: Props로 문제 해결하기",
      type: 0,
      exp: 25,
      isComplete: false,
      content:
        "App.tsx에서 자식 컴포넌트로 props를 전달합니다.\n\n---\n\n```jsx\n<TodoForm\n  input={input}\n  setInput={setInput}\n  onSubmit={onSubmit}\n/>\n\n<TodoList todos={todos} />\n```\n\n---\n\n### 📌 핵심 정리\n- state는 부모가 관리\n- 자식은 props로 사용\n- 데이터 흐름은 항상 **위 → 아래**",
    },

    {
      id: "todo-delete-filter",
      section: 8,
      order: 9,
      title: "심화 4: filter로 Todo 삭제하기",
      type: 0,
      exp: 30,
      isComplete: false,
      content:
        "각 Todo에 삭제 버튼을 추가해봅니다.\n\n---\n\n```jsx\nconst onDelete = (id) => {\n  setTodos(todos.filter((todo) => todo.id !== id));\n};\n```\n\n```jsx\n<button onClick={() => onDelete(todo.id)}>삭제</button>\n```\n\n---\n\n### 🧠 이 단계에서 배운 것\n- 배열 불변성 유지\n- filter를 이용한 삭제\n- 함수 props 패턴",
    },

    {
      id: "todo-section8-summary",
      section: 8,
      order: 10,
      title: "Section 8 마무리: Todo 앱 완성",
      type: 0,
      exp: 20,
      isComplete: false,
      content:
        "🎉 축하합니다!\n\n이번 섹션에서 여러분은 **Todo List 앱을 처음부터 끝까지 직접 만들었습니다.**\n\n---\n\n### ✅ 완성한 기능\n- Todo 목록 출력\n- 입력 & 추가\n- 컴포넌트 분리\n- props로 데이터 전달\n- filter로 삭제 처리\n\n---\n\n### 🧠 핵심 메시지\n\n> React는\n> **작은 컴포넌트와 명확한 데이터 흐름**으로\n> 하나의 앱을 만들어갑니다.\n\n이제 여러분은\nReact 앱의 기본 골자를 정확히 이해했습니다 👏",
    },
    {
      title: "useEffect: 컴포넌트의 탄생과 죽음",
      content:
        "**useEffect**는 컴포넌트가 처음 화면에 나타날 때 실행할 코드를 작성하는 곳입니다.\n\n```jsx\nuseEffect(() => {\n  console.log('앱이 실행되었습니다!');\n}, []);\n```\n\n서버 통신, 타이머 설정 등\n사이드 이펙트를 처리할 때 사용합니다.",
      section: 9,
      type: 0,
      id: "bonus-useeffect-lifecycle",
      isComplete: false,
      exp: 20,
      order: 1,
    },
  ];

export type Content = DescriptiveContent | MultipleChoiceQuiz | ShortAnswerQuiz;

// export const contentsQueryAtom = atomWithQuery<Content[]>((get) => ({
//   queryKey: ["contents"] as const,
//   queryFn: async () => {
//     // 1️⃣ localStorage에서 기존 값 확인
//     const stored = localStorage.getItem("contents");
//     if (stored) {
//       try {
//         const parsed: Content[] = JSON.parse(stored);
//         if (parsed.length > 0) {
//           return parsed; // 서버 fetch 없이 바로 반환
//         }
//       } catch {
//         // parse 실패하면 서버 fetch 진행
//       }
//     }

//     // 2️⃣ storage에 값 없으면 서버 fetch
//     const contents = await getContents();

//     // 3️⃣ fetch 후 storage에 저장
//     if (contents && contents.length > 0) {
//       localStorage.setItem("contents", JSON.stringify(contents));
//     }

//     return contents;
//   },
// }));

export const contentsQueryAtom = atom<Content[]>(mockContents);

export const perAtom = atom(0);
