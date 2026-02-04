import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
import { getContents } from '~/lib/firestore_utils';

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
  time: number; // 예상 소요 시간 (분)
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
      id: 'section1-orientation',
      section: 1,
      order: 0,
      title: '강의 시작하기: 무엇을 만들게 될까요?',
      type: 0,
      exp: 5,
      time: 5,
      isComplete: false,
      content:
        '# 🚀 환영합니다! React의 세계로\n\n안녕하세요 👋 \n\n 여러분은 이 강의를 통해 React.js에 대한 기초 지식을 갖추게 될 것입니다.\n\n 본 강의는 **React를 처음 접하는 분들도** \n\n직접 하나의 완성된 웹 애플리케이션을 만들어보는 것을 목표로 합니다.\n\n---\n\n### 🧠 수강 전 알아두면 좋아요\n\nReact를 배우기 전, 아래와 같은 **기본적인 웹 개발 지식**을 알고 계시면 훨씬 수월합니다.\n\n> 📌 **필요한 선수 지식**\n>\n> - 기본적인 **HTML 구조** (태그, 속성 등)\n> - **JavaScript 기초 문법** (변수, 함수, 배열)\n\n---\n\n### 🎯 강의 컨셉\n\n- React의 핵심 개념을 **직접 만들면서** 이해합니다.\n- 복잡한 이론보다, **"왜 이렇게 쓰는지"** 실용성에 집중합니다.\n\n---\n\n### 🧩 최종 목표 미리보기\n\n우리는 이번 강의를 통해 **Todo-List 애플리케이션**을 밑바닥부터 직접 완성해볼 것입니다.\n\n![Todo Template]( )\n\n자, 그럼 시작해볼까요?',
    },
    {
      id: 'intro-what-is-react',
      section: 1,
      order: 1,
      title: 'React.js란 무엇인가?',
      type: 0,
      exp: 10,
      time: 7,
      isComplete: false,
      content:
        '# ⚛️ React: UI를 만드는 강력한 도구\n\n**React**는 사용자 인터페이스(UI)를 만들기 위한 **JavaScript 라이브러리**입니다. Meta(구 Facebook)에서 개발하여 현재 가장 사랑받는 프론트엔드 기술이죠.\n\n---\n\n### 💡 왜 React인가요?\n\n웹페이지에서 버튼을 클릭할 때, 화면 전체가 새로고침되지 않고 **필요한 부분만** 부드럽게 업데이트되는 경험을 해보셨나요? React는 이런 동적인 화면을 **효율적으로 구현**하기 위해 태어났습니다.\n\n### 📦 라이브러리 vs 프레임워크\n\nReact는 프레임워크가 아닌 **라이브러리**입니다. \n\n> 모든 규칙을 강요하기보다, 개발자가 필요한 부분을 **자유롭게 선택해서** 사용할 수 있다는 것이 가장 큰 매력입니다.',
    },
    {
      id: 'intro-spa-concept',
      section: 1,
      order: 2,
      title: '전체 페이지가 바뀌지 않는 이유 (SPA)',
      type: 0,
      exp: 10,
      time: 5,
      isComplete: false,
      content:
        "# 🪄 페이지가 바뀌지 않는 마법, SPA\n\nReact는 **SPA(Single Page Application)** 방식으로 동작합니다. 화면 전체가 '깜빡'이지 않고도 내용이 부드럽게 바뀌는 비밀이 바로 여기에 있습니다.\n\n---\n\n### 📌 SPA란 무엇일까요?\n\n전통적인 웹사이트는 다른 페이지로 이동할 때마다 서버에서 전체 화면을 다시 받아옵니다. 하지만 SPA는:\n- 딱 **한 개의 페이지(HTML)** 만 로드합니다.\n- 이후에는 JavaScript를 이용해 **필요한 데이터만** 바꿔 끼웁니다.\n\n> **💡 SPA의 장점**\n> 1. 화면 깜빡임이 없어 **앱처럼 매끄러운 경험**을 줍니다.\n> 2. 서버 통신량이 줄어들어 **속도가 매우 빠릅니다.**",
    },
    {
      id: 'quiz-react-definition',
      section: 1,
      order: 3,
      title: 'React의 정의 퀴즈',
      type: 2,
      question: 'React는 JavaScript의 어떤 종류의 도구입니까? (ㄹㅇㅂㄹㄹ)',
      correctAnswer: '라이브러리',
      explanation:
        "React는 UI 구축을 위한 전용 기능을 제공하는 '라이브러리'입니다.",
      exp: 20,
      time: 3,
      isComplete: false,
    },
    {
      id: 'intro-why-react',
      section: 1,
      order: 4,
      title: '왜 React를 배워야 할까요?',
      type: 0,
      exp: 10,
      time: 6,
      isComplete: false,
      content:
        '# 🌟 React를 배워야 하는 3가지 이유\n\n전 세계 수많은 개발팀이 React를 선택하는 데에는 분명한 이유가 있습니다.\n\n1. **컴포넌트 재사용** \n   한 번 잘 만든 UI를 여기저기서 반복해서 쓸 수 있습니다.\n\n2. **압도적인 생태계** \n   모르는 것이 생겼을 때 물어볼 자료와 함께 쓸 도구들이 세상에서 가장 많습니다.\n\n3. **선언적 프로그래밍** \n   화면의 상태가 *어떻게* 변하는지 일일이 명령하지 않고, *무엇을* 보여줄지만 정하면 React가 알아서 그려줍니다.\n\n> React를 배우는 것은 단순히 문법을 익히는 것이 아니라, **현대적인 개발자의 사고방식**을 갖추는 과정입니다.',
    },
    {
      id: 'app-creation-vite',
      section: 1,
      order: 5,
      title: '앱 생성하기 - Vite',
      type: 0,
      exp: 15,
      time: 8,
      isComplete: false,
      content:
        '# 🛠️ 실전! 첫 리액트 앱 만들기\n\n이제 실제로 React 프로젝트를 생성해봅시다. 우리는 가장 빠르고 현대적인 도구인 **Vite**를 사용합니다.\n\n---\n\n### ⌨️ 터미널 명령어를 순서대로 입력하세요\n\n1️⃣ **프로젝트 생성**\n```bash\nnpm create vite@latest my-todo-app -- --template react\n```\n\n2️⃣ **프로젝트 폴더로 이동 및 도구 설치**\n```bash\ncd my-todo-app\nnpm install\n```\n\n3️⃣ **개발 서버 실행**\n```bash\nnpm run dev\n```\n\n서버가 실행되면 터미널에 나온 주소를 브라우저에 입력해보세요. 여러분의 첫 React 화면이 나타납니다!`http://localhost:5173`',
    },
    {
      id: 'section1-summary',
      section: 1,
      order: 6,
      title: '섹션 1 정리: React의 큰 그림',
      type: 0,
      exp: 5,
      time: 4,
      isComplete: false,
      content:
        '# 🏁 섹션 1 정리\n\n이번 섹션에서는 React를 시작하기 전에 꼭 알아야 할 **큰 그림**을 살펴봤습니다.\n\n---\n\n### ✅ 이번 섹션에서 배운 것\n\n- React는 UI를 만드는 **라이브러리**다.\n- **SPA** 방식을 통해 매끄러운 사용자 경험을 제공한다.\n- **Vite**를 이용해 빠르고 현대적인 개발 환경을 구축했다.\n\n---\n\n이제 준비운동은 끝났습니다. \n\n다음 섹션부터는 React의 핵심인 **컴포넌트와 JSX**를 직접 다뤄보며 코드를 작성해보겠습니다! 🚀',
    },
    {
      id: 'basic-understanding-components',
      section: 2,
      order: 0,
      title: '컴포넌트(Components) 이해하기',
      type: 0,
      exp: 10,
      time: 6,
      isComplete: false,
      content:
        '# 🧱 UI의 조각, 컴포넌트(Component)\n\n**컴포넌트**는 UI를 구성하는 **독립적이고 재사용 가능한 블록**입니다. 마치 레고 블록을 조립하듯 웹사이트를 만들 수 있게 해주죠.\n\n---\n\n### 💻 React 컴포넌트는 사실 함수입니다\n\n가장 기본적인 형태의 컴포넌트는 **JavaScript 함수**입니다.\n\n```jsx\nfunction Welcome() {\n  return <h1>안녕, 리액트!</h1>;\n}\n```\n\n이렇게 만든 컴포넌트는 마치 HTML 태그처럼 사용할 수 있습니다.\n\n```jsx\n<Welcome />\n```\n\n---\n\n### 🧠 컴포넌트를 함수로 이해해봅시다\n\n> 📌 **입력값을 받아서 → 화면(UI)을 반환하는 함수**\n\n- 입력값: props (데이터)\n- 반환값: 화면에 보여질 JSX\n\n즉, React에서는 **함수로 화면을 만든다**고 생각해도 괜찮습니다.\n\n> ⚠️ **주의**\n>\n> 컴포넌트 이름의 첫 글자는 반드시 **대문자**여야 합니다. 소문자로 시작하면 React는 이를 일반 HTML 태그로 인식해버립니다.',
    },
    {
      id: 'basic-jsx-syntax',
      section: 2,
      order: 1,
      title: 'JSX: 자바스크립트 속 HTML',
      type: 0,
      exp: 10,
      time: 10,
      isComplete: false,
      content:
        "# 🏗️ JavaScript 확장 문법, JSX\n\n**JSX**는 **자바스크립트 안에서 HTML처럼 보이는 문법**을 사용할 수 있게 해주는 React의 핵심 문법입니다.\n\n---\n\n### ❓ JSX는 왜 필요할까요?\n\nJSX가 없다면 우리는 일일이 복잡한 자바스크립트 함수를 호출해야 합니다.\n\n```js\n// JSX 없이 작성할 때\nReact.createElement('h1', null, '안녕하세요');\n```\n\n---\n\n### 🔀 자바스크립트 값 섞어 쓰기 \n\n JSX의 강력함은 자바스크립트의 변수를 **중괄호**`{ }`를 통해 화면에 바로 뿌릴 수 있다는 점입니다.\n\n```jsx\nfunction App() {\n  const name = '철수';\n  const age = 20;\n\n  return <h2>{name}님은 {age}살입니다.</h2>;\n}\n```\n\n**🖥️ 브라우저 출력 결과:**\n> **철수님은 20살입니다.**\n\n이렇게 중괄호 안의 자바스크립트 변수가 실제 데이터로 치환되어 화면에 나타납니다.",
    },
    {
      id: 'basic-jsx-rules',
      section: 2,
      order: 2,
      title: 'JSX 작성 시 꼭 지켜야 할 규칙',
      type: 0,
      exp: 15,
      time: 8,
      isComplete: false,
      content:
        '# 📏 JSX를 사용할 때 지켜야 할 3가지 약속\n\nJSX는 HTML과 비슷하게 생겼지만, 실제로는 자바스크립트이기 때문에 몇 가지 엄격한 규칙이 있습니다.\n\n### 1️⃣ 반드시 하나의 태그로 감싸기\n두 개 이상의 태그를 나열할 때는 반드시 부모 태그로 감싸야 합니다. 이름 없는 태그인`<> ... </>` **Fragment**를 사용하면 불필요한 div를 줄일 수 있습니다.\n\n```jsx\nreturn (\n  <>\n    <h1>제목</h1>\n    <p>내용</p>\n  </>\n);\n```\n\n### 2️⃣ class가 아니라 className\n자바스크립트에서 `class`라는 단어는 이미 주인이 있는 단어입니다. 따라서 CSS 클래스를 줄 때는 **className**을 사용합니다.\n\n```jsx\n<div className="header">메뉴</div>\n```\n\n### 3️⃣ 모든 태그는 닫혀야 합니다\n\n ```jsx\n<img> \n <input>\n``` \n\n 위의 두 태그와 같이 HTML에서 닫지 않던 태그들도 JSX에서는 반드시 `<img />`와 같이 **Self-closing**하거나 닫아주어야 합니다.',
    },
    {
      id: 'quiz-jsx-definition',
      section: 2,
      order: 3,
      title: 'JSX의 개념 퀴즈',
      type: 1,
      exp: 20,
      time: 3,
      isComplete: false,
      question: '다음 중 JSX에 대한 설명으로 가장 올바른 것은 무엇입니까?',
      options: [
        'HTML 파일을 대체하기 위한 새로운 언어',
        '브라우저에서 직접 실행되는 템플릿 언어',
        '자바스크립트 안에서 HTML처럼 보이는 문법을 사용할 수 있게 해주는 문법',
        'React 전용의 스타일링 문법',
      ],
      correctAnswerIndex: 2,
      explanation:
        'JSX는 JavaScript XML의 약자로, 코드의 가독성을 높여주는 자바스크립트 확장 문법입니다.',
    },
    {
      id: 'quiz-jsx-expression',
      section: 2,
      order: 4,
      title: 'JSX 표현식 퀴즈',
      type: 1,
      exp: 20,
      time: 3,
      isComplete: false,
      question:
        'JSX 안에서 자바스크립트 변수를 출력할 때 사용하는 올바른 방법은 무엇입니까?',
      options: [
        '<p>name</p>',
        '<p>${name}</p>',
        '<p>{name}</p>',
        '<p>(name)</p>',
      ],
      correctAnswerIndex: 2,
      explanation:
        'JSX 내부에서 자바스크립트 변수나 표현식을 사용할 때는 반드시 중괄호 { }를 사용해야 합니다.',
    },
    {
      id: 'quiz-jsx-statement-vs-expression',
      section: 2,
      order: 5,
      title: 'JSX 문법 이해 퀴즈',
      type: 1,
      exp: 25,
      time: 4,
      isComplete: false,
      question: '다음 중 JSX 안에서 **직접 사용할 수 없는 것**은 무엇입니까?',
      options: [
        '삼항 연산자 (condition ? A : B)',
        '숫자 계산 (1 + 2)',
        'if 문',
        '변수 값 출력',
      ],
      correctAnswerIndex: 2,
      explanation:
        "JSX 내의 중괄호에는 결과값이 즉시 반환되는 '표현식'만 올 수 있습니다. if문은 '문(statement)'이므로 중괄호 내부에서 직접 사용할 수 없습니다.",
    },
    {
      id: 'section2-summary',
      section: 2,
      order: 6,
      title: '섹션 2 정리: 컴포넌트와 JSX',
      type: 0,
      exp: 5,
      time: 4,
      isComplete: false,
      content:
        "# 🏁 섹션 2 마무리\n\n고생하셨습니다! 이제 여러분은 리액트 앱의 기초 뼈대를 세우는 방법을 배웠습니다.\n\n---\n\n### ✅ 핵심 요약\n- **컴포넌트**는 UI의 최소 단위이며, 이름은 **대문자**로 시작한다.\n- **JSX**는 자바스크립트와 HTML의 만남이다.\n- JSX는 반드시 **하나의 부모** 태그로 감싸야 하며, **className**을 사용한다.\n\n---\n\n이제 뼈대를 만들었으니, 여기에 **'생명력(데이터의 변화)'을** 불어넣을 차례입니다. 다음 섹션인 **State**에서 만나요! 🚀",
    },
    {
      id: 'state-what-is-state',
      section: 3,
      order: 0,
      title: 'State란 무엇인가?',
      type: 0,
      exp: 15,
      time: 8,
      isComplete: false,
      content:
        '# 🧠 컴포넌트의 기억 장치, State\n\nReact에서 **State**는 컴포넌트가 내부적으로 **기억하고 있는 값**입니다. 사용자와의 상호작용에 따라 언제든 **변경될 수 있는 데이터**를 의미하죠.\n\n---\n\n### ❓ 왜 일반 변수로는 화면이 안 바뀔까요?\n\n```jsx\nlet count = 0;\n\nfunction Counter() {\n  const increase = () => {\n    count = count + 1;\n    console.log(count); // 값은 올라가지만 화면은 그대로!\n  };\n\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={increase}>증가</button>\n    </div>\n  );\n}\n```\n\n일반 변수는 값이 바뀌어도 **React가 화면을 다시 그려야 한다는 사실을 알지 못합니다.** 즉, 컴포넌트를 **렌더링**하지 않기 때문입니다.\n\n---\n\n### ✅ 그래서 State가 필요합니다\n\nState는 단순한 데이터가 아니라, **"값이 바뀌었으니 화면을 다시 그려줘(렌더링해줘)!"** 라고 React에게 보내는 신호입니다.\n\n> 📌 **여기서 \'렌더링(Rendering)\'이란?**\n> \n> 컴포넌트 함수가 다시 호출되고, 그 결과로 변경된 데이터가 반영된 **새로운 화면(UI)이 브라우저에 그려지는 과정**을 말합니다.\n\nState가 변경되면 React는 자동으로 이 렌더링 과정을 수행하여 사용자가 바뀐 값을 볼 수 있게 합니다.',
    },
    {
      id: 'state-counter-practice',
      section: 3,
      order: 1,
      title: '카운터 앱 실습: useState 사용법',
      type: 0,
      exp: 25,
      time: 10,
      isComplete: false,
      content:
        '# 🛠️ useState로 숫자 바꾸기\n\n이제 실제로 화면을 바꾸는 코드를 작성해봅시다. 리액트에서 제공하는 `useState` 도구를 사용합니다.\n\n```jsx\nimport { useState } from \'react\'; // 👈 꼭 불러와야 해요!\n\nfunction Counter() {\n  // [현재값, 변경함수] = useState(초기값);\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>현재 숫자: {count}</p>\n      <button onClick={() => setCount(count + 1)}>증가</button>\n    </div>\n  );\n}\n```\n\n**🖥️ 브라우저 출력 결과:**\n> 현재 숫자: 0  \n> [증가 버튼]\n\n**🔄 버튼을 누르면 일어나는 일:**\n1. `setCount` 함수가 실행되어 `count`가 변경됩니다.\n2. React가 "어? count가 바뀌었네?"라고 감지합니다.\n3. **컴포넌트를 다시 실행(재렌더링)** 하여 화면에 새로운 숫자를 그립니다.',
    },
    {
      id: 'quiz-state-description',
      section: 3,
      order: 2,
      title: 'State 개념 이해 퀴즈',
      type: 2,
      question:
        '컴포넌트가 기억하고 있으며, 값이 변경되면 화면이 다시 렌더링되도록 만드는 React의 데이터는 무엇입니까?',
      correctAnswer: 'State',
      explanation:
        'State는 컴포넌트 내부에서 변할 수 있는 값을 관리하며, 변경 시 렌더링을 유발합니다.',
      exp: 20,
      time: 3,
      isComplete: false,
    },
    {
      id: 'quiz-state-update-code',
      section: 3,
      order: 3,
      title: 'State 변경 코드 퀴즈',
      type: 2,
      question:
        '다음 상태가 선언되어 있을 때, number의 값을 5로 변경하는 함수 호출 코드를 작성하세요.\n\nconst [number, setNumber] = useState(0);',
      correctAnswer: 'setNumber(5)',
      explanation:
        '상태 변경 함수인 setNumber에 원하는 값을 인자로 전달합니다.',
      exp: 30,
      time: 4,
      isComplete: false,
    },
    {
      id: 'quiz-state-change-effect',
      section: 3,
      order: 4,
      title: 'State 변경 결과 퀴즈',
      type: 1,
      question:
        'State의 값이 변경되면 React 컴포넌트에는 어떤 일이 발생합니까?',
      options: [
        '아무 일도 일어나지 않는다',
        '전체 페이지가 새로고침된다',
        '해당 컴포넌트가 다시 렌더링된다',
        '에러가 발생한다',
      ],
      correctAnswerIndex: 2,
      explanation:
        'React는 State의 변화를 감지하여 해당 컴포넌트를 재렌더링합니다.',
      exp: 20,
      time: 3,
      isComplete: false,
    },
    {
      id: 'state-common-mistakes',
      section: 3,
      order: 5,
      title: '+ State에서 가장 많이 하는 실수들',
      type: 0,
      exp: 20,
      time: 15,
      isComplete: false,
      content:
        "# ⚠️ 초보자가 가장 자주 하는 State 실수\n\n### 1️⃣ State를 직접 수정하지 마세요\n```jsx\n// ❌ 절대 안 돼요!\ncount = count + 1;\n\n// ✅ 항상 이렇게 하세요\nsetCount(count + 1);\n```\n직접 수정하면 React는 값이 바뀐 줄 모르고 화면을 그대로 둡니다.\n\n### 2️⃣ State는 '다음 렌더링'에 바뀝니다\n```jsx\nsetCount(count + 1);\nconsole.log(count); // 🧐 여전히 이전 값이 찍힐 거예요!\n```\n`setCount`를 실행하자마자 값이 바뀌는 게 아니라, **재렌더링이 완료되어야** 새로운 값이 적용됩니다.\n\n### 3️⃣ 모든 값을 State로 만들지 마세요\n바뀌었을 때 **화면(UI)도 같이 바뀌어야 하는 값**만 State로 만드세요. 그렇지 않은 값은 일반 변수로 충분합니다.\n\n ```jsx\n const\n let \n``` \n\n",
    },
    {
      id: 'section3-summary',
      section: 3,
      order: 6,
      title: 'Section 3 마무리: State 한 번에 정리하기',
      type: 0,
      exp: 15,
      time: 6,
      isComplete: false,
      content:
        '# 🏁 섹션 3 마무리\n\n축하합니다! 이제 리액트의 가장 중요한 심장인 **State**를 마스터하셨습니다.\n\n---\n\n### ✅ 핵심 요약\n- **State**는 컴포넌트의 기억 장치다.\n- 상태 변경은 반드시 **전용 함수(setter)** 를 사용해야 한다.\n- 상태가 바뀌면 **재렌더링**이 일어난다.\n\n---\n\n이제 나의 컴포넌트가 데이터를 가질 수 있게 되었습니다. 그렇다면 이 데이터를 **다른 컴포넌트에게 전달**하려면 어떻게 해야 할까요? 다음 섹션인 **Props**에서 확인해봅시다! 🎁',
    },
    {
      id: 'props-passing-data',
      section: 4,
      order: 0,
      title: 'Props로 데이터 전달하기',
      type: 0,
      exp: 20,
      time: 12,
      isComplete: false,
      content:
        '# 🎁 컴포넌트에게 주는 선물, Props\n\nReact에서 **Props**는 부모 컴포넌트가 자식 컴포넌트에게 전달하는 **데이터**입니다. \n\n> 쉽게 말해, 부모가 자식에게 주는 **읽기 전용 값**입니다.\n\n---\n\n### ❓ 왜 Props가 필요할까요?\n\n웹사이트는 수많은 컴포넌트의 조립으로 만들어집니다. \n\n 이때 컴포넌트끼리 서로 정보를 주고받아야 화면이 완성되는데, 그 통로 역할을 하는 것이 바로 Props입니다.\n\n---\n\n### 👨‍👩‍👧 부모 → 자식 구조 이해하기\n\n```jsx\n// 부모 컴포넌트 (App.jsx)\nfunction App() {\n  return <MyButton text="저장하기" />;\n}\n\n// 자식 컴포넌트 (MyButton.jsx)\nfunction MyButton(props) {\n  return <button>{props.text}</button>;\n}\n```\n\n**🖥️ 브라우저 출력 결과:**\n> [저장하기]\n\n `props.text` 부모(App)가 보낸 "저장하기"라는 값을 자식이 받아서 사용합니다.\n 자식 컴포넌트는 이 값을 **사용만 할 수 있고, 직접 수정할 수는 없습니다.**',
    },
    {
      id: 'props-destructuring-intro',
      section: 4,
      order: 1,
      title: 'Props를 더 간단하게 받는 방법',
      type: 0,
      exp: 10,
      time: 10,
      isComplete: false,
      content:
        '# ✨ 더 깔끔한 코드, 구조 분해 할당\n\n매번 `props.ooo`라고 쓰는 대신, JavaScript의 **구조 분해 할당** 문법을 쓰면 코드가 훨씬 간결해집니다.\n\n---\n\n### 🔄 어떻게 바뀌나요?\n\n**기존 방식:**\n```jsx\nfunction MyButton(props) {\n  return <button>{props.text}</button>;\n}\n```\n\n**구조 분해 할당 방식:**\n```jsx\nfunction MyButton({ text }) {\n  return <button>{text}</button>;\n}\n```\n\n- 함수의 매개변수 자리에 직접 `{ text }`를 적어줍니다.\n- `props.text`와 완전히 동일하게 동작하지만, 읽기가 훨씬 편해집니다.\n- 전달받는 Props가 여러 개일 때 특히 빛을 발하는 방식입니다.',
    },
    {
      id: 'props-pass-setstate',
      section: 4,
      order: 2,
      title: '함수도 Props로 전달할 수 있어요',
      type: 0,
      exp: 20,
      time: 15,
      isComplete: false,
      content:
        '# ⚡ 부모의 함수를 자식에게 전달하기\n\nProps로는 글자나 숫자뿐만 아니라 **함수도 전달할 수 있습니다.** \n\n부모가 가진 State를 자식 쪽에서 바꾸고 싶을 때 이 방식을 사용합니다.\n\n---\n\n### ⌨️ 예제로 살펴보기\n\n```jsx\n// 부모 컴포넌트\nfunction App() {\n  const [count, setCount] = useState(0);\n  \n  return <CounterButton onIncrease={() => setCount(count + 1)} />;\n}\n\n// 자식 컴포넌트\nfunction CounterButton({ onIncrease }) {\n  return <button onClick={onIncrease}>증가</button>;\n}\n```\n\n- **데이터 관리**: 부모(App)가 담당\n- **행동(클릭)**: 자식(CounterButton)이 담당\n- 자식에서 버튼을 누르면 부모가 준 함수가 실행되어 부모의 State가 바뀝니다!',
    },
    {
      id: 'props-common-mistakes',
      section: 4,
      order: 3,
      title: '+ Props 사용 시 주의할 점',
      type: 0,
      exp: 10,
      time: 8,
      isComplete: false,
      content:
        '# ⚠️ Props 사용 시 자주 하는 실수\n\n### 1️⃣ Props를 직접 수정하지 마세요\n```jsx\nfunction Child(props) {\n  props.text = "변경"; // ❌ 에러 발생!\n  return <div>{props.text}</div>;\n}\n```\nProps는 부모가 주는 \'선물\'과 같아서 자식이 마음대로 바꿀 수 없습니다. 값을 바꾸고 싶다면 부모에게 요청(함수 실행)해야 합니다.\n\n### 2️⃣ Props와 State 구분하기\n- **컴포넌트 스스로** 값을 만들고 관리한다면? 👉 **State**\n- **부모로부터** 값을 받아서 보여주기만 한다면? 👉 **Props**\n\n### 3️⃣ 문자열 외의 값은 중괄호`{ }` 사용\n```jsx\n<MyButton text="저장" /> // 문자열은 따옴표\n<Counter count={10} /> // 숫자, 변수, 함수는 중괄호\n```',
    },
    {
      id: 'quiz-props-definition',
      section: 4,
      order: 4,
      title: 'Props의 정의 퀴즈',
      type: 1,
      question: '다음 중 Props의 올바른 설명은 무엇일까요?',
      options: [
        '컴포넌트가 스스로 관리하는 상태 값',
        '부모 컴포넌트가 자식에게 전달하는 읽기 전용 데이터',
        '자식 컴포넌트가 직접 수정할 수 있는 값',
        'HTML 태그 속성을 의미하는 React 전용 문법',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Props는 상위(부모) 컴포넌트가 하위(자식) 컴포넌트에게 전달하는 읽기 전용 데이터입니다.',
      exp: 20,
      time: 5,
      isComplete: false,
    },
    {
      id: 'quiz-props-vs-state',
      section: 4,
      order: 5,
      title: 'Props와 State 구분하기',
      type: 2,
      question:
        '컴포넌트가 직접 관리하며 변경 시 렌더링을 유발하는 값은 무엇인가요? (Props 또는 State)',
      correctAnswer: 'State',
      explanation:
        'State는 컴포넌트 내부 상태이며, Props는 외부로부터 받는 설정값입니다.',
      exp: 20,
      time: 5,
      isComplete: false,
    },
    {
      id: 'props-summary-review',
      section: 4,
      order: 6,
      title: 'Props 마무리 & 복습',
      type: 0,
      exp: 15,
      time: 10,
      isComplete: false,
      content:
        '# 🏁 섹션 4 마무리\n\n이제 여러분은 컴포넌트끼리 대화하는 법을 배웠습니다! \n\n---\n\n### ✅ 핵심 요약\n- **Props**는 부모가 자식에게 주는 **데이터**다.\n- 자식은 Props를 **수정할 수 없다.** (읽기 전용)\n- **함수**도 Props로 넘겨서 자식이 부모의 상태를 바꾸게 할 수 있다.\n- `{ text }` 처럼 **구조 분해 할당**을 쓰면 코드가 예뻐진다.\n\n---\n\n데이터를 주고받는 법까지 알게 되었으니, 이제 여러 개의 데이터를 한 번에 보여주는 방법을 배울 차례입니다. 다음 섹션인 **List & Key**에서 만나요! 📚',
    },
    {
      id: 'event-what-is-event',
      section: 5,
      order: 1,
      type: 0,
      title: 'React에서 이벤트(Event)란?',
      exp: 15,
      time: 8,
      isComplete: false,
      content:
        'React에서 **이벤트**(Event)란\n사용자가 화면과 상호작용할 때 발생하는 모든 행동을 의미합니다.\n\n예를 들면 다음과 같습니다.\n\n- 버튼 클릭\n- 입력창에 글자 입력\n- 마우스 올리기\n\n---\n\n### ❓ 이벤트는 왜 중요한가요?\n\nReact 앱은 대부분 **사용자의 행동에 따라 화면이 바뀌는 구조**입니다.\n\n> 사용자의 행동 → 이벤트 발생 → 함수 실행 → State 변경 → 화면 업데이트\n\n이 흐름의 시작점이 바로 **이벤트**입니다.\n\n---\n\n### 📌 React 이벤트의 특징\n\n- HTML 이벤트와 거의 비슷하지만, **카멜 케이스**(camelCase)를 사용합니다.\n- 문자열이 아닌 **함수**를 전달합니다.\n\n```jsx\n<button onClick={handleClick}>클릭</button>\n```',
    },
    {
      id: 'event-html-vs-react',
      section: 5,
      order: 2,
      type: 0,
      title: 'HTML 이벤트와 React 이벤트의 차이',
      exp: 15,
      time: 7,
      isComplete: false,
      content:
        'React 이벤트는 HTML 이벤트와 비슷해 보이지만 중요한 차이가 있습니다.\n\n---\n\n### ❌ HTML 방식\n```html\n<button onclick="handleClick()">클릭</button>\n```\n\n---\n\n### ✅ React 방식\n```jsx\n<button onClick={handleClick}>클릭</button>\n```\n\n---\n\n### 🧠 핵심 차이 정리\n\n- `onclick → ❌`   `onClick → ✅` \n- 문자열 ❌  함수 전달 ✅\n\n> React에서는 **이 함수가 클릭되면 실행돼**라고 전달하는 방식입니다.',
    },
    {
      id: 'event-handler-function',
      section: 5,
      order: 3,
      type: 0,
      title: '이벤트 핸들러 함수 만들기',
      exp: 20,
      time: 10,
      isComplete: false,
      content:
        "이벤트가 발생했을 때 실행되는 함수를\n**이벤트 핸들러**(Event Handler)라고 부릅니다.\n\n---\n\n### 기본 예제\n```jsx\nfunction App() {\n  const handleClick = () => {\n    console.log('버튼이 클릭되었습니다');\n  };\n  return <button onClick={handleClick}>클릭</button>;\n}\n```\n\n---\n\n### 🔍 코드 해석\n\n- **handleClick**은 **이벤트 핸들러 함수**입니다.\n- 버튼을 클릭하면 React가 이 함수를 실행합니다.\n\n> 📌 이벤트 핸들러 이름은\n> `handleClick, onSubmit, onChange`처럼 **의미가 드러나게** 짓는 것이 좋습니다.",
    },
    {
      id: 'event-function-vs-execution',
      section: 5,
      order: 4,
      type: 0,
      title: '함수를 전달할까? 실행할까?',
      exp: 20,
      time: 10,
      isComplete: false,
      content:
        'React 이벤트에서 초보자가 가장 많이 헷갈리는 부분입니다.\n\n---\n\n### ❌ 잘못된 코드\n```jsx\n<button onClick={handleClick()}>클릭</button>\n```\n\n이 코드는 **렌더링 시점에 바로 함수가 실행**됩니다.\n\n---\n### ✅ 올바른 코드\n```jsx\n<button onClick={handleClick}>클릭</button>\n```\n\n---\n### 🧠 기억하세요\n\n `handleClick → 함수 전달` \n `handleClick() → 함수 즉시 실행` \n\n> React 이벤트에는 **실행 결과**가 아니라 **함수 자체**를 전달해야 합니다.',
    },
    {
      id: 'event-state-update',
      section: 5,
      order: 5,
      type: 0,
      title: '이벤트로 State 변경하기',
      exp: 25,
      time: 12,
      isComplete: false,
      content:
        '이벤트는 단순히 콘솔 로그를 찍는 데서 끝나지 않습니다.\n\n가장 중요한 역할은 **State를 변경하는 것**입니다.\n\n---\n\n### 예제: 버튼 클릭 시 숫자 증가\n```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  const increase = () => {\n    setCount(count + 1);\n  };\n\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={increase}>증가</button>\n    </div>\n  );\n}\n```\n\n---\n### 🔄 흐름 정리\n\n- 버튼 클릭\n- increase 함수 실행\n- setCount 호출\n- State 변경\n- 화면 재렌더링\n\n> 이 흐름을 이해하면 React의 절반은 이해한 것입니다.',
    },
    {
      id: 'event-common-mistakes',
      section: 5,
      order: 6,
      type: 0,
      title: '+ 이벤트에서 가장 많이 하는 실수',
      exp: 15,
      time: 8,
      isComplete: false,
      content:
        '이벤트를 처음 다룰 때 자주 발생하는 실수들을 정리해봅니다.\n\n---\n### ❌ 실수 1. 함수를 즉시 실행하기\n```jsx\nonClick={handleClick()} // ❌\n```\n\n---\n### ❌ 실수 2. HTML 이벤트 방식 사용하기\n```jsx\nonclick="handleClick()" // ❌\n```\n\n---\n### ❌ 실수 3. State를 직접 변경하기\n```jsx\ncount = count + 1 // ❌\n```\n\n> 이벤트 + State는 항상 **setter 함수**와 함께 사용하세요.',
    },
    {
      id: 'quiz-event-camelcase',
      section: 5,
      order: 7,
      type: 1,
      title: 'React 이벤트 문법 퀴즈',
      exp: 20,
      time: 5,
      isComplete: false,
      question: 'React에서 버튼 클릭 이벤트를 올바르게 작성한 것은 무엇인가요?',
      options: [
        'onclick="handleClick()"',
        'onClick={handleClick}',
        'onClick="handleClick"',
        'onclick={handleClick()}',
      ],
      correctAnswerIndex: 1,
      explanation:
        'React 이벤트는 camelCase를 사용하며, 문자열이 아닌 함수 자체를 전달해야 합니다.',
    },
    {
      id: 'quiz-event-function-call',
      section: 5,
      order: 8,
      type: 1,
      title: '이벤트 함수 전달 퀴즈',
      exp: 20,
      time: 5,
      isComplete: false,
      question: '다음 중 버튼 클릭 시에만 함수가 실행되는 코드는 무엇인가요?',
      options: [
        'onClick={handleClick()}',
        'onClick={handleClick}',
        'onClick="handleClick"',
        'onClick={handleClick + 1}',
      ],
      correctAnswerIndex: 1,
    },
    {
      id: 'quiz-event-short-answer',
      section: 5,
      order: 9,
      type: 2,
      title: '이벤트 개념 단답 퀴즈',
      exp: 20,
      time: 5,
      isComplete: false,
      question:
        'React에서 이벤트 핸들러에 전달해야 하는 것은 함수의 실행 결과일까요, 함수 그 자체일까요?',
      correctAnswer: '함수',
    },
    {
      id: 'event-summary-review',
      section: 5,
      order: 10,
      type: 0,
      title: 'Section 5 마무리: 이벤트 한 번에 정리하기',
      exp: 15,
      time: 7,
      isComplete: false,
      content:
        '이번 Section에서는 React에서 **이벤트**(Event)를 다루는 방법을 배웠습니다.\n\n---\n### ✅ 핵심 요약\n- 이벤트는 **사용자의 행동**입니다\n- React 이벤트는 camelCase를 사용합니다 (**onClick, onChange, onSubmit**)\n- 이벤트에는 **함수 자체**를 전달합니다\n- 이벤트를 통해 State를 변경하면 화면이 업데이트됩니다\n\n---\n### 🎯 지금 할 수 있는 것\n\n- 버튼 클릭 이벤트 처리하기\n- 이벤트로 State 변경하기\n- 이벤트 문법 실수 피하기\n\n---\n이제 다음 Section에서는 **여러 개의 데이터를 다루는 방법**,\n즉 **List / Object와 불변성**을 배워보겠습니다.\n\n이제 진짜 앱다운 구조로 들어갑니다 🚀',
    },
    {
      id: 'list-intro',
      type: 0,
      section: 6,
      order: 1,
      title: 'List와 Object 기초 이해하기',
      exp: 10,
      isComplete: false,
      content:
        "React에서 자주 사용하는 데이터 구조인 **배열 - List**과 **객체 - Object**에 대해 배워봅니다.\n\n---\n\n### 1️⃣ List와 Object의 차이\n- List(배열): 순서가 있는 데이터 묶음, 예: [1, 2, 3]\n- Object(객체): key-value 쌍으로 데이터 저장, 예: {name: '철수', age: 20}\n\n---\n\n### 2️⃣ React에서 List와 Object 사용 이유\n- 화면에 여러 데이터를 반복해서 보여줄 때 배열 사용\n- 한 데이터의 속성을 관리할 때 객체 사용\n- 배열과 객체를 state로 관리하며 동적인 화면을 만들 수 있습니다.",
    },
    {
      id: 'list-render',
      type: 0,
      section: 6,
      order: 2,
      title: '배열 데이터를 화면에 반복 렌더링하기',
      exp: 15,
      isComplete: false,
      content:
        "배열을 화면에 반복해서 표시할 때는 JavaScript의 **map()** 함수를 사용합니다.\n\n---\n\n### map() 함수 구조\n`map()` 함수는 배열의 각 항목을 순회하며 새로운 값을 반환합니다.\n```jsx\narray.map((item, index) => {\n  // item: 현재 요소 값\n  // index: 현재 요소 인덱스\n});\n```\n- **첫 번째 인수(item)**: 현재 배열 항목의 값\n- **두 번째 인수(index)**: 현재 배열 항목의 인덱스\n\n---\n\n### 예제\n```jsx\nconst fruits = ['사과', '바나나', '딸기'];\n\nreturn (\n  <ul>\n    {fruits.map((fruit, idx) => (\n      <li key={idx}>{idx + 1}. {fruit}</li>\n    ))}\n  </ul>\n);\n```\n- 위 코드에서 `idx`는 순서 번호를 표시하거나, 상황에 따라 key로 활용할 수 있습니다.\n\n---\n\n### 📌 주의 사항\n- React에서 배열을 렌더링할 때는 항상 **key** 속성을 지정해야 합니다.\n- key는 각 항목을 고유하게 식별하여 업데이트 효율을 높입니다.\n- index를 key로 사용하는 것은 배열이 고정되어 있을 때만 안전합니다. 동적으로 항목이 추가/삭제되는 경우에는 고유한 값을 사용하는 것이 권장됩니다.",
    },
    {
      id: 'list-key',
      type: 0,
      section: 6,
      order: 3,
      title: 'key는 왜 필요할까요?',
      exp: 15,
      isComplete: false,
      content:
        "배열을 렌더링할 때 key를 주지 않으면 React는 **어떤 항목이 변경되었는지 추적하기 어렵습니다**.\n\n---\n\n### key 사용법\n```jsx\nconst fruits = ['사과', '바나나', '딸기'];\n\nreturn (\n  <ul>\n    {fruits.map((item, index) => (\n      <li key={index}>{fruit}</li>\n    ))}\n  </ul>\n);\n```\n\n- key는 배열 항목의 **고유한 값**이어야 합니다.\n- index를 key로 쓰는 것은 가능하지만, 배열이 변경될 가능성이 있으면 권장하지 않습니다.",
    },
    {
      id: 'state-array-copy',
      type: 0,
      section: 6,
      order: 4,
      title: '배열/객체 수정: 새 데이터 만들기',
      exp: 15,
      isComplete: false,
      content:
        "React에서 배열이나 객체를 state로 관리할 때는 **항상 새로운 배열/객체를 만들어야** 합니다.\n\n---\n\n### ❓ 왜 새로운 데이터를 만들어야 할까요?\n- React는 state가 이전 값과 다른지 비교해 **변경이 일어났는지 감지**합니다.\n- 배열이나 객체를 직접 수정하면 **참조(reference)가 변하지 않아** React가 변경을 감지하지 못할 수 있습니다.\n\n---\n\n### 🔹 스프레드 연산자(...)\n- 새로운 배열/객체를 쉽게 만들 수 있는 자바스크립트 문법입니다.\n\n#### 배열 예제\n```jsx\nconst todos = ['우유', '공부'];\nconst newTodos = [...todos, '청소'];\nconsole.log(newTodos);\n```\n**출력:**\n```\n['우유', '공부', '청소']\n```\n\n#### 객체 예제\n```jsx\nconst user = { name: '철수', age: 20 };\nconst newUser = { ...user, age: 21 };\nconsole.log(newUser);\n```\n**출력:**\n```\n{ name: '철수', age: 21 }\n```\n\n> ✅ 이렇게 하면 React가 새로운 참조를 인식하고 화면이 올바르게 업데이트됩니다.",
    },
    {
      id: 'state-immutability',
      type: 0,
      section: 6,
      order: 5,
      title: '불변성(Immutable)과 React 상태 관리',
      exp: 15,
      isComplete: false,
      content:
        "React에서 state를 다룰 때 **불변성을 지키는 것이 왜 중요한지** 자세히 알아봅시다.\n\n---\n\n### 1️⃣ 불변성이란?\n- 배열이나 객체를 직접 변경하지 않고, 항상 새로운 배열/객체를 만드는 원칙\n- '값이 바뀌면 새로운 것 생성'이라고 생각하면 이해하기 쉽습니다.\n\n---\n\n### 2️⃣ React가 상태 변화를 감지하는 방법\n- React는 내부적으로 이전 state와 새로운 state를 **얕은 비교(shallow comparison)** 합니다.\n- 배열이나 객체를 직접 수정하면 **참조(reference)가 변하지 않아** React가 '변경 없음'으로 판단합니다.\n- 새 배열/객체를 만들면 참조가 바뀌므로 React가 **변경을 감지하고 재렌더링**을 수행합니다.\n\n---\n\n### 3️⃣ 예제 비교\n// 잘못된 방법 ❌\n`todos.push('청소');`\nsetTodos(todos); // React가 업데이트를 감지하지 못할 수 있음\n\n// 올바른 방법 ✅\n`setTodos([...todos, '청소']);` // 새 배열을 생성, React가 감지하고 화면 갱신\n\n---\n### 4️⃣ 핵심 요약\n- 배열/객체 state를 직접 수정하지 마세요\n- 항상 새 배열/객체를 만들어 setState에 전달하세요\n- 스프레드 연산자(...), map(), filter(), concat() 같은 함수를 활용하면 편리합니다\n- 불변성을 지켜야 React 상태 관리가 안전하고 예측 가능합니다",
    },
    {
      id: 'list-quiz-1',
      section: 6,
      order: 6,
      title: '배열 렌더링 함수 이름',
      type: 2,
      exp: 10,
      isComplete: false,
      question:
        '배열을 화면에 반복 렌더링할 때 사용하는 JavaScript 메서드의 이름을 쓰세요.',
      correctAnswer: 'map',
      explanation:
        'React에서는 배열을 화면에 반복 표시할 때 `map()` 함수를 사용합니다.',
    },
    {
      id: 'list-quiz-2',
      section: 6,
      order: 7,
      title: 'map 함수 인수 의미',
      type: 2,
      exp: 10,
      isComplete: false,
      question:
        'map 함수에서 두 번째 인수는 무엇을 의미하나요?(영단어로 쓰세요)',
      correctAnswer: 'index',
      explanation:
        'map((item, index) => ...)에서 첫 번째 인수는 배열의 현재 항목, 두 번째 인수는 해당 항목의 인덱스를 의미합니다.',
    },
    {
      id: 'list-quiz-3',
      section: 6,
      order: 8,
      title: 'key 속성 필요성',
      type: 1,
      exp: 15,
      isComplete: false,
      question:
        'React에서 배열을 렌더링할 때 key 속성을 지정해야 하는 이유는 무엇인가요?',
      options: [
        '배열 항목의 순서를 무조건 고정하기 위해',
        '어떤 항목이 변경되었는지 React가 효율적으로 추적하기 위해',
        'HTML에서 필수 속성이기 때문에',
        '배열의 길이를 계산하기 위해',
      ],
      correctAnswerIndex: 1,
      explanation:
        'key 속성은 React가 각 항목을 고유하게 식별하고 변경된 항목만 업데이트하도록 돕습니다.',
    },
    {
      id: 'list-quiz-4',
      section: 6,
      order: 9,
      title: 'state 배열/객체 불변성',
      type: 1,
      exp: 15,
      isComplete: false,
      question:
        'React state에서 배열이나 객체를 직접 수정하지 않고 새로운 배열/객체를 만들어야 하는 이유는 무엇인가요?',
      options: [
        '코드가 더 간결해지기 때문',
        'React가 이전 state와 다른지 비교해 변경 여부를 감지할 수 있도록',
        '브라우저 호환성 문제 때문에',
        '자바스크립트 문법에서 배열/객체는 항상 새로 만들어야 하기 때문',
      ],
      correctAnswerIndex: 1,
      explanation:
        'React는 state가 이전 값과 다른지를 비교해 변경 여부를 감지합니다. 기존 배열/객체를 직접 수정하면 참조가 그대로여서 변경 감지가 되지 않을 수 있습니다.',
    },
    {
      id: 'list-quiz-5',
      section: 6,
      order: 10,
      title: '불변성 유지하며 배열 항목 추가하기',
      type: 2,
      exp: 15,
      isComplete: false,
      question:
        "배열 `const fruits = ['banana', 'apple']`에 불변성을 유지하면서 `orange` 항목이 추가된 const newFruits를 선언하는 코드를 작성하세요.",
      correctAnswer:
        'const newFruits = [...fruits, \'orange\'];,,const newFruits = [...fruits, "orange"];',
      explanation:
        '스프레드 연산자를 사용하면 기존 배열을 직접 수정하지 않고 새로운 배열을 만들 수 있습니다. React state를 업데이트할 때 불변성을 유지하면 변경을 React가 올바르게 감지할 수 있습니다.',
    },
    {
      id: 'list-summary-review',
      type: 0,
      section: 6,
      order: 11,
      title: 'Section6 마무리 & 복습: 리스트와 객체 다루기',
      exp: 20,
      isComplete: false,
      content:
        '이번 Section에서는 React에서 배열과 객체를 다루는 방법을 배웠습니다.\n\n---\n\n### ✅ 핵심 정리\n- **배열/객체 반복 렌더링**\n   - map() 함수를 사용하여 배열 항목을 화면에 반복 표시합니다.\n   - map()의 첫 번째 인수는 항목(item), 두 번째 인수는 index(순서)입니다.\n\n- **key의 중요성**\n   - React가 어떤 항목이 변경되었는지 추적하는 데 필요합니다.\n   - 배열 항목을 고유하게 식별할 수 있는 값으로 지정합니다.\n\n- **State에서 배열/객체 직접 수정 금지**\n   - 기존 배열/객체를 직접 바꾸면 React가 변경을 감지하지 못할 수 있습니다.\n   - 항상 새로운 배열/객체를 만들어서 setState 함수로 업데이트해야 합니다.\n\n- **스프레드 연산자(...) 활용**\n   - 기존 배열/객체를 복사하면서 새로운 항목을 추가하거나 일부 속성을 변경할 때 사용합니다.\n   - React에서 불변성을 유지하면서 state를 업데이트하는 가장 일반적인 패턴입니다.\n\n---\n\n### ⚠️ 자주 하는 실수\n- 배열/객체를 직접 수정하고 setState를 호출함\n- key를 지정하지 않거나 index를 무분별하게 key로 사용함\n- map() 함수의 index를 잘못 활용하여 렌더링 순서가 꼬임\n\n---\n\n### 💡 팁\n- 작은 배열이라도 항상 불변성을 지키는 습관을 들이세요.\n- key는 가능하면 고유 식별자를 사용하고, 불가피하게 index를 쓴다면 배열이 변경되지 않는 경우에만 사용하세요.\n- map(), filter(), spread 연산자 등은 React에서 상태 관리를 할 때 매우 자주 사용되는 도구입니다.\n\n> 🎯 이 섹션에서 배운 내용을 잘 이해하면, 이후 프로젝트에서 리스트와 상태 관리를 훨씬 안전하고 효율적으로 할 수 있습니다.',
    },
    {
      id: 'form-intro',
      section: 7,
      order: 1,
      type: 0,
      title: '왜 Form 이벤트를 배워야 할까요?',
      exp: 10,
      isComplete: false,
      content:
        '지금까지 우리는 버튼 클릭 이벤트를 통해 State를 변경하는 방법을 배웠습니다.\n\n하지만 실제 앱에서는 **사용자의 입력값**을 받아야 하는 경우가 훨씬 많습니다.\n\n---\n\n### 예를 들면\n\n- Todo 입력하기\n- 검색어 입력\n- 로그인 폼 작성\n\n이때 반드시 필요한 것이 바로 **Form 이벤트**입니다.\n\n> 📌 Todo-List 앱의 시작은 버튼이 아니라 **input + form** 입니다.\n\n이번 Section에서는 Todo 실습을 시작하기 전에 꼭 필요한\n**입력 이벤트의 기초**를 다뤄봅니다.',
    },
    {
      id: 'form-controlled-input',
      section: 7,
      order: 2,
      type: 0,
      title: 'input 값은 왜 State로 관리할까요?',
      exp: 15,
      isComplete: false,
      content:
        "React에서 input 요소는 보통 **State와 연결해서 관리**합니다.\n\n이 방식을 **제어 컴포넌트**(Controlled Component)라고 부릅니다.\n\n---\n\n### 기본 구조\n```jsx\nconst [text, setText] = useState('');\n\n<input value={text} />\n```\n\n이 상태에서는\ninput에 아무것도 입력할 수 없습니다.\n\n---\n\n### 왜 그럴까요?\n\n- input의 값은 `value={text}`로 고정되어 있고\n- text는 아직 변경되지 않기 때문입니다.\n\n> 즉, **입력값을 바꾸는 이벤트가 필요합니다.**",
    },
    {
      id: 'form-onchange',
      section: 7,
      order: 3,
      type: 0,
      title: 'onChange 이벤트로 입력값 처리하기',
      exp: 20,
      isComplete: false,
      content:
        "input의 값이 바뀔 때마다 실행되는 이벤트가\n바로 **onChange** 입니다.\n\n---\n\n### 기본 예제\n```jsx\nfunction InputExample() {\n  const [text, setText] = useState('');\n\n  const handleChange = (e) => {\n    setText(e.target.value);\n  };\n\n  return (\n    <input\n      value={text}\n      onChange={handleChange}\n    />\n  );\n}\n```\n\n---\n\n### 🧠 코드 흐름 이해하기\n\n- 사용자가 키보드를 입력\n- onChange 이벤트 발생\n- 이벤트 객체(e)가 전달됨\n- e.target.value로 입력값 접근\n- setText로 State 변경\n- 화면 업데이트\n\n> 이 구조는 이후 Todo 입력에서도 그대로 사용됩니다.",
    },
    {
      id: 'form-event-object',
      section: 7,
      order: 4,
      type: 0,
      title: '이벤트 객체(e)는 무엇인가요?',
      exp: 15,
      isComplete: false,
      content:
        'onChange, onSubmit 같은 이벤트에는\n항상 **이벤트 객체**가 전달됩니다.\n\n보통 관례적으로 `e` 또는 `event`라고 이름 짓습니다.\n\n---\n\n### 자주 사용하는 속성\n\n```jsx\ne.target.value\n```\n\n- `e.target` 이벤트가 발생한 요소\n- `value` input에 입력된 값\n\n---\n\n### 기억 포인트\n\n> 📌 Form 이벤트에서 가장 많이 사용하는 값은\n> **e.target.value 하나면 충분합니다.**\n\n처음부터 모든 속성을 외울 필요는 없습니다.',
    },
    {
      id: 'form-submit',
      section: 7,
      order: 5,
      type: 0,
      title: 'form과 onSubmit 이벤트',
      exp: 20,
      isComplete: false,
      content:
        'input과 버튼을 감싸는 태그가 바로 **form** 입니다.\n\nform은 기본적으로 **제출**(submit)이라는 동작을 가지고 있습니다.\n\n---\n\n### 기본 form 구조\n```jsx\n<form onSubmit={handleSubmit}>\n  <input />\n  <button>추가</button>\n</form>\n```\n\n- 버튼 클릭\n- Enter 키 입력\n\n➡️ 모두 submit 이벤트를 발생시킵니다.',
    },
    {
      id: 'form-prevent-default',
      section: 7,
      order: 6,
      type: 0,
      title: 'event.preventDefault()는 왜 필요할까요?',
      exp: 20,
      isComplete: false,
      content:
        'form의 submit 이벤트가 발생하면\n브라우저는 기본적으로 **페이지를 새로고침**합니다.\n\n하지만 React 앱에서는 이 동작을 원하지 않습니다.\n\n---\n\n### 그래서 사용하는 코드\n```jsx\nconst handleSubmit = (e) => {\n  e.preventDefault();\n};\n```\n\n---\n\n### 🧠 의미 정리\n\n `preventDefault()`\n→ 브라우저의 기본 동작을 막는다\n\n> 📌 Todo 앱에서 이 코드가 없다면\n> 버튼을 누를 때마다 화면이 새로고침됩니다.\n\nForm 이벤트에서 **거의 항상 함께 사용되는 필수 코드**입니다.',
    },
    {
      id: 'form-submit-example',
      section: 7,
      order: 7,
      type: 0,
      title: '입력 + 제출 전체 흐름 예제',
      exp: 25,
      isComplete: false,
      content:
        "지금까지 배운 내용을 한 번에 연결해봅시다.\n\n---\n\n### 전체 예제 코드\n```jsx\nfunction SimpleForm() {\n  const [text, setText] = useState('');\n\n  const handleChange = (e) => {\n    setText(e.target.value);\n  };\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log(text);\n    setText('');\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={text} onChange={handleChange} />\n      <button>확인</button>\n    </form>\n  );\n}\n```\n\n---\n\n### 🔄 실행 흐름\n\n- 입력 → onChange → State 저장\n- 제출 → onSubmit → preventDefault\n- 입력값 사용 → State 초기화\n\n> 이 패턴이 **Todo 입력의 기본 뼈대**가 됩니다.",
    },
    {
      id: 'quiz-form-onchange',
      section: 7,
      order: 8,
      type: 1,
      title: 'input 이벤트 퀴즈',
      exp: 20,
      isComplete: false,
      question: 'input의 값이 바뀔 때 실행되는 React 이벤트는 무엇인가요?',
      options: ['onClick', 'onSubmit', 'onChange', 'onInput'],
      correctAnswerIndex: 2,
    },
    {
      id: 'quiz-form-prevent',
      section: 7,
      order: 9,
      type: 2,
      title: 'Form 이벤트 단답 퀴즈',
      exp: 25,
      isComplete: false,
      question:
        'form 제출 시 브라우저의 기본 동작(새로고침)을 막기 위해 호출하는 메서드는 무엇인가요?',
      correctAnswer: 'preventDefault',
    },
    {
      id: 'form-summary-review',
      section: 7,
      order: 10,
      type: 0,
      title: 'Section7 마무리: Form 이벤트 정리',
      exp: 15,
      isComplete: false,
      content:
        '이번 Section에서는\nReact에서 **Form 이벤트**를 다루는 방법을 배웠습니다.\n\n---\n\n### ✅ 핵심 요약\n\n- input 값은 **State로 관리**합니다\n- 입력 변화는 **onChange**로 처리합니다\n- form 제출은 **onSubmit** 이벤트를 사용합니다\n- submit 시에는 반드시 **preventDefault**()를 호출합니다\n\n---\n\n### 🎯 지금 여러분이 할 수 있는 것\n\n- 입력값을 State로 관리할 수 있습니다\n- form 제출 시 새로고침을 막을 수 있습니다\n- Todo 입력 흐름을 이해할 준비가 되었습니다\n\n---\n\n이제 다음 Section에서는\n지금까지 배운 모든 내용을 종합해\n**Todo-List 프로젝트를 직접 만들어보겠습니다.**\n\n준비되셨나요? 💪',
    },
    {
      id: 'todo-intro-structure',
      section: 8,
      order: 1,
      title: 'Todo 프로젝트 시작 & 구조 살펴보기',
      type: 0,
      exp: 15,
      isComplete: false,
      content:
        '이번 섹션에서는 **Todo List 앱을 처음부터 직접 만들어봅니다.**\n\n---\n\n### 📁 프로젝트 진행 방식\n\n- 모든 작업은 **App.tsx 하나에서 시작**합니다.\n- 처음에는 컴포넌트를 나누지 않습니다.\n- 기능이 완성된 후, 점진적으로 컴포넌트로 분리합니다.\n\n---\n\n### 🧭 앞으로 만들 흐름 미리보기\n\n```\nApp.tsx\n ├─ 입력 폼\n ├─ Todo 리스트\n └─ Todo 아이템\n```\n\n지금은 하나의 파일이지만,\n점점 역할별로 나누면서 **왜 컴포넌트가 필요한지** 직접 느끼게 될 것입니다.\n\n> 💡 스타일(CSS)은 이번 강의에서 다루지 않습니다.\n> 기능과 구조에만 집중하세요.',
    },

    {
      id: 'todo-state-init',
      section: 8,
      order: 2,
      title: 'Todo 리스트 상태 만들기',
      type: 0,
      exp: 20,
      isComplete: false,
      content:
        "가장 먼저 Todo 목록을 저장할 **state**를 만들어봅니다.\n\n---\n\n### 🧠 Todo 데이터 구조\n\nTodo 하나는 다음 정보를 가집니다.\n- id: 고유 값\n- text: 할 일 내용\n\n```jsx\nconst [todos, setTodos] = useState([\n  { id: 1, text: '리액트 공부하기' },\n  { id: 2, text: 'Todo 앱 만들기' },\n]);\n```\n\n---\n\n### 📌 포인트\n- 배열 형태의 state\n- 객체를 요소로 가지는 리스트\n\n> 이 구조는 이후 삭제, 추가 기능에서 계속 사용됩니다.",
    },

    {
      id: 'todo-render-list',
      section: 8,
      order: 3,
      title: 'Todo 리스트 화면에 출력하기',
      type: 0,
      exp: 20,
      isComplete: false,
      content:
        '이제 Todo 리스트를 화면에 출력해봅니다.\n\n---\n\n### 🔁 map으로 리스트 렌더링\n\n```jsx\n<ul>\n  {todos.map((todo) => (\n    <li key={todo.id}>{todo.text}</li>\n  ))}\n</ul>\n```\n\n---\n\n### 📌 체크 포인트\n- map 함수 사용\n- key는 todo.id\n\n> 이제 화면에 여러 Todo 항목이 보일 것입니다.',
    },

    {
      id: 'todo-input-state',
      section: 8,
      order: 4,
      title: '입력 폼과 입력 상태 만들기',
      type: 0,
      exp: 20,
      isComplete: false,
      content:
        "Todo를 추가하기 위해 입력창과 입력값을 저장할 state를 만듭니다.\n\n---\n\n```jsx\nconst [input, setInput] = useState('');\n```\n\n```jsx\n<input\n  value={input}\n  onChange={(e) => setInput(e.target.value)}\n/>\n```\n\n---\n\n### 📌 핵심\n- input은 **제어 컴포넌트**\n- 입력값은 항상 state로 관리\n\n> 이 구조는 React 폼 처리의 기본입니다.",
    },

    {
      id: 'todo-submit-add',
      section: 8,
      order: 5,
      title: '폼 제출로 Todo 추가하기',
      type: 0,
      exp: 25,
      isComplete: false,
      content:
        "이제 입력한 값을 Todo 리스트에 추가해봅니다.\n\n---\n\n```jsx\nconst onSubmit = (e) => {\n  e.preventDefault();\n\n  const newTodo = {\n    id: Date.now(),\n    text: input,\n  };\n\n  setTodos([...todos, newTodo]);\n  setInput('');\n};\n```\n\n```jsx\n<form onSubmit={onSubmit}>\n  <input\n    value={input}\n    onChange={(e) => setInput(e.target.value)}\n  />\n  <button>추가</button>\n</form>\n```\n\n---\n\n### ✅ 결과\n- 입력 → 제출 → 리스트 추가\n- 기본 Todo List 완성 🎉\n\n---\n\n### 📌 전체 코드 예시\n지금까지 만든 코드를 한눈에 보면 다음과 같습니다.\n\n```jsx\nimport { useState } from 'react';\n\nfunction App() {\n  const [todos, setTodos] = useState([\n    { id: 1, text: '리액트 공부하기' },\n    { id: 2, text: 'Todo 앱 만들기' },\n  ]);\n  const [input, setInput] = useState('');\n\n  const onSubmit = (e) => {\n    e.preventDefault();\n    const newTodo = { id: Date.now(), text: input };\n    setTodos([...todos, newTodo]);\n    setInput('');\n  };\n\n  return (\n    <div>\n      <h1>Todo List</h1>\n      <form onSubmit={onSubmit}>\n        <input value={input} onChange={(e) => setInput(e.target.value)} />\n        <button>추가</button>\n      </form>\n      <ul>\n        {todos.map((todo) => (\n          <li key={todo.id}>{todo.text}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nexport default App;\n```\n\n> 💡 이제 수강자는 입력 → 리스트 출력 → Todo 추가가 어떻게 연결되는지 전체 흐름을 이해할 수 있습니다.",
    },

    {
      id: 'todo-split-components',
      section: 8,
      order: 6,
      title: '심화 1: 컴포넌트로 분리해보기',
      type: 0,
      exp: 20,
      isComplete: false,
      content:
        '코드가 길어지면서 한 파일에서 모든 기능을 처리하면 가독성이 떨어지고, 나중에 유지보수도 어려워집니다.\n\n실제 실무에서는 같은 기능을 가진 컴포넌트를 여러 곳에서 재사용할 수 있기 때문에, 작은 단위로 나누어 관리하는 것이 중요합니다.\n\n이번 단계에서는 Todo 앱을 **역할별로 작은 부품(컴포넌트)으로 분리**해보면서, 코드 구조를 더 깔끔하게 만드는 방법을 직접 경험해보겠습니다.\n\n---\n\n### ✂️ 분리 대상\n- TodoForm\n- TodoList\n\n```jsx\n<TodoForm />\n<TodoList />\n```\n\n> ⚠️ 이 단계에서는 아직 props를 전달하지 않기 때문에 에러가 발생할 수 있습니다. 이는 정상입니다.',
    },

    {
      id: 'todo-error-why',
      section: 8,
      order: 7,
      title: '심화 2: 왜 에러가 발생할까요?',
      type: 0,
      exp: 25,
      isComplete: false,
      content:
        '컴포넌트로 옮긴 후 이런 에러가 발생할 수 있습니다.\n\n> ❌ todos가 정의되지 않았습니다\n\n---\n\n### 🧠 이유 분석\n- state는 App.tsx에 있음\n- 자식 컴포넌트는 해당 값을 모름\n\n> 해결 방법은 단 하나,\n> **부모가 자식에게 데이터를 내려주는 것**입니다.',
    },

    {
      id: 'todo-pass-props',
      section: 8,
      order: 8,
      title: '심화 3: Props로 에러 해결하기',
      type: 0,
      exp: 25,
      isComplete: false,
      content:
        "이제 이전 단계에서 발생했던 에러를 해결해봅니다.\n\n---\n\n### 🔧 Props 전달로 해결\nReact에서는 부모(App)에서 관리하는 state를 **자식에게 props로 전달**할 수 있습니다. 이를 통해 자식 컴포넌트는 단순히 받은 데이터를 화면에 표시하거나, 이벤트를 부모에게 전달할 수 있습니다.\n\n```jsx\n<TodoForm\n  input={input}\n  setInput={setInput}\n  onSubmit={onSubmit}\n/>\n\n<TodoList todos={todos} />\n```\n\n- TodoForm: 입력값(input), 상태 변경 함수(setInput), 제출 함수(onSubmit)를 받음\n- TodoList: Todo 배열(todos)을 받아 화면에 출력\n\n---\n\n### 🔑 핵심 포인트\n1. **State는 부모가 관리**하고, 자식은 props로 사용\n2. **데이터 흐름**: 위 → 아래 (Parent → Child)\n3. **이벤트 흐름**: 아래 → 위 (callback 함수)\n\n---\n\n### 📂 파일별 전체 코드 예시\n#### App.tsx\n```jsx\nimport { useState } from 'react';\nimport TodoForm from './TodoForm';\nimport TodoList from './TodoList';\n\nfunction App() {\n  const [todos, setTodos] = useState([\n    { id: 1, text: '리액트 공부하기' },\n    { id: 2, text: 'Todo 앱 만들기' },\n  ]);\n  const [input, setInput] = useState('');\n\n  const onSubmit = (e) => {\n    e.preventDefault();\n    const newTodo = { id: Date.now(), text: input };\n    setTodos([...todos, newTodo]);\n    setInput('');\n  };\n\n  return (\n    <div>\n      <h1>Todo List</h1>\n      <TodoForm input={input} setInput={setInput} onSubmit={onSubmit} />\n      <TodoList todos={todos} />\n    </div>\n  );\n}\n\nexport default App;\n```\n\n#### TodoForm.tsx\n```jsx\nfunction TodoForm({ input, setInput, onSubmit }) {\n  return (\n    <form onSubmit={onSubmit}>\n      <input value={input} onChange={(e) => setInput(e.target.value)} />\n      <button>추가</button>\n    </form>\n  );\n}\n\nexport default TodoForm;\n```\n\n#### TodoList.tsx\n```jsx\nfunction TodoList({ todos }) {\n  return (\n    <ul>\n      {todos.map((todo) => (\n        <li key={todo.id}>{todo.text}</li>\n      ))}\n    </ul>\n  );\n}\n\nexport default TodoList;\n```\n\n> 이렇게 각 파일을 나누고 props로 데이터를 전달하면, 컴포넌트 분리 후에도 앱의 기능과 데이터 흐름이 유지됩니다.",
    },

    {
      id: 'todo-delete-filter',
      section: 8,
      order: 9,
      title: '심화 4: Todo 삭제 기능 구현',
      type: 0,
      exp: 30,
      isComplete: false,
      content:
        '이번 단계에서는 Todo 리스트에서 항목을 삭제하는 방법을 배워봅니다.\n많은 일정 관리 앱에는 추가 기능뿐 아니라, 수정이나 삭제 기능도 함께 제공되는데요.\n이번 강의에서는 그중 **삭제 기능**을 구현하는 방법에 집중합니다.\n\n---\n\n### 1️⃣ 각 Todo 항목에 삭제 버튼 추가\n```jsx\n<ul>\n  {todos.map((todo) => (\n    <li key={todo.id}>\n      {todo.text}\n      <button>삭제</button>\n    </li>\n  ))}\n</ul>\n```\n> 이제 화면에 각 Todo 항목 옆에 삭제 버튼이 보일 것입니다.\n\n---\n\n### 2️⃣ 삭제 함수 구현\n삭제 버튼을 클릭하면 특정 Todo를 제거해야 합니다. React에서는 **state를 직접 수정하지 않고 새로운 배열을 만들어 업데이트**해야 합니다. 이를 위해 자바스크립트의 `filter` 함수를 사용합니다.\n\n```jsx\nconst onDelete = (id) => {\n  setTodos(todos.filter((todo) => todo.id !== id));\n};\n```\n\n#### 🧠 여기서 중요한 포인트\n- **filter 함수**: 배열을 순회하면서 조건에 맞는 요소만 새로운 배열로 반환합니다.\n   예시 `[1, 2, 3].filter(n => n !== 2)`\n  반환값 `[1, 3]`\n- **조건**: 삭제하고자 하는 id와 다른 항목만 남깁니다.`todo.id !== id` \n- **불변성 유지**: 기존 **todos 배열**을 직접 수정하지 않고, 새로운 배열을 만들어 **setTodos**로 업데이트합니다.`setTodos(todos.filter((todo) => todo.id !== id));`\n- React는 state가 바뀌면 화면을 자동으로 업데이트하기 때문에, 필터링된 배열이 곧 UI에서 반영됩니다.\n\n> 이렇게 하면 클릭한 항목만 삭제되고, 나머지는 그대로 남습니다.\n\n---\n\n### 3️⃣ 버튼에 이벤트 연결\n```jsx\n<button onClick={() => onDelete(todo.id)}>삭제</button>\n```\n> 클릭하면 해당 항목이 삭제되도록 onClick 이벤트를 연결합니다.\n\n---\n\n### 4️⃣ 결과 확인\n- 삭제 버튼 클릭 → 해당 Todo 항목이 화면에서 사라짐\n- state가 변경되고 화면이 업데이트 되는 React의 기본 동작 이해\n\n---\n\n### 🧠 이 단계에서 배운 것\n- 배열 불변성을 유지하며 항목 삭제\n- **filter**를 활용한 배열 처리와 조건 필터링 이해\n- 이벤트 함수와 props 패턴 이해\n- React에서 UI와 state의 연동 방식 이해\n\n> 축하합니다! 이제 Todo 리스트에 **삭제 기능**까지 완전히 구현되었습니다.',
    },

    {
      id: 'todo-section8-summary',
      section: 8,
      order: 10,
      title: 'Section 8 마무리: Todo 앱 완성',
      type: 0,
      exp: 20,
      isComplete: false,
      content:
        '🎉 축하합니다!\n\n이번 섹션에서 여러분은 **Todo List 앱을 처음부터 끝까지 직접 만들었습니다.**\n\n---\n\n### ✅ 완성한 기능\n- Todo 목록 출력\n- 입력 & 추가\n- 컴포넌트 분리\n- props로 데이터 전달\n- filter로 삭제 처리\n\n---\n\n### 🧠 핵심 메시지\n\n> React는 **작은 컴포넌트와 명확한 데이터 흐름**으로 하나의 앱을 만들어갑니다.\n\n이제 여러분은 React 앱의 기본 골자를 정확히 이해했습니다 👏',
    },
    {
      title: 'useEffect: 컴포넌트의 탄생과 죽음',
      content:
        "**useEffect**는 컴포넌트가 처음 화면에 나타날 때 실행할 코드를 작성하는 곳입니다.\n\n```jsx\nuseEffect(() => {\n  console.log('앱이 실행되었습니다!');\n}, []);\n```\n\n서버 통신, 타이머 설정 등\n사이드 이펙트를 처리할 때 사용합니다.",
      section: 9,
      type: 0,
      id: 'bonus-useeffect-lifecycle',
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
