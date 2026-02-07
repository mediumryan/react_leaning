import { atom } from 'jotai';

// 0: 설명, 1: 객관식, 2: 주관식
export type ContentType = 0 | 1 | 2;

export interface BaseContent {
  id: string; // 고유 ID
  section: number; // 속한 섹션
  order: number; // 섹션 내 순서
  title: string; // 콘텐츠 제목
  type: ContentType; // 콘텐츠 유형
  exp: number; // 완료 시 획득 경험치
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

export const contentsData: Content[] =
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
    },
    {
      id: 'intro-why-react',
      section: 1,
      order: 4,
      title: '왜 React를 배워야 할까요?',
      type: 0,
      exp: 10,
      time: 6,
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
      content:
        "# 🏁 섹션 2 마무리\n\n고생하셨습니다! 이제 여러분은 리액트 앱의 기초 뼈대를 세우는 방법을 배웠습니다.\n\n---\n\n### ✅ 핵심 요약\n- **컴포넌트**는 UI의 최소 단위이며, 이름은 **대문자**로 시작한다.\n- **JSX**는 자바스크립트와 HTML의 만남이다.\n- JSX는 반드시 **하나의 부모** 태그로 감싸야 하며, **className**을 사용한다.\n\n---\n\n이제 뼈대를 만들었으니, 여기에 **'생명력(데이터의 변화)'을** 불어넣을 차례입니다. \n다음 섹션인 **State**에서 만나요! 🚀",
    },
    {
      id: 'state-what-is-state',
      section: 3,
      order: 0,
      title: 'State란 무엇인가?',
      type: 0,
      exp: 15,
      time: 8,
      content:
        '# 🧠 컴포넌트의 기억 장치, State\n\nReact에서 **State**는 컴포넌트가 내부적으로 **기억하고 있는 값**입니다. \n사용자와의 상호작용에 따라 언제든 **변경될 수 있는 데이터**를 의미하죠.\n\n---\n\n### ❓ 왜 일반 변수로는 화면이 안 바뀔까요?\n\n```jsx\nlet count = 0;\n\nfunction Counter() {\n  const increase = () => {\n    count = count + 1;\n    console.log(count); // 값은 올라가지만 화면은 그대로!\n  };\n\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={increase}>증가</button>\n    </div>\n  );\n}\n```\n\n일반 변수는 값이 바뀌어도 **React가 화면을 다시 그려야 한다는 사실을 알지 못합니다.** \n즉, 컴포넌트를 **렌더링**하지 않기 때문입니다.\n\n---\n\n### ✅ 그래서 State가 필요합니다\n\nState는 단순한 데이터가 아니라, **"값이 바뀌었으니 화면을 다시 그려줘(렌더링해줘)!"** 라고 React에게 보내는 신호입니다.\n\n> 📌 **여기서 \'렌더링(Rendering)\'이란?**\n> \n> 컴포넌트 함수가 다시 호출되고, 그 결과로 변경된 데이터가 반영된 **새로운 화면(UI)이 브라우저에 그려지는 과정**을 말합니다.\n\nState가 변경되면 React는 자동으로 이 렌더링 과정을 수행하여 사용자가 바뀐 값을 볼 수 있게 합니다.',
    },
    {
      id: 'state-counter-practice',
      section: 3,
      order: 1,
      title: '카운터 앱 실습: useState 사용법',
      type: 0,
      exp: 25,
      time: 10,
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
    },
    {
      id: 'state-common-mistakes',
      section: 3,
      order: 5,
      title: '+ State에서 가장 많이 하는 실수들',
      type: 0,
      exp: 20,
      time: 15,
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
      content:
        '# 🏁 섹션 3 마무리\n\n축하합니다! 이제 리액트의 가장 중요한 심장인 **State**를 마스터하셨습니다.\n\n---\n\n### ✅ 핵심 요약\n- **State**는 컴포넌트의 기억 장치다.\n- 상태 변경은 반드시 **전용 함수(setter)** 를 사용해야 한다.\n- 상태가 바뀌면 **재렌더링**이 일어난다.\n\n---\n\n이제 나의 컴포넌트가 데이터를 가질 수 있게 되었습니다. \n그렇다면 이 데이터를 **다른 컴포넌트에게 전달**하려면 어떻게 해야 할까요? \n다음 섹션인 **Props**에서 확인해봅시다! 🎁',
    },
    {
      id: 'props-passing-data',
      section: 4,
      order: 0,
      title: 'Props로 데이터 전달하기',
      type: 0,
      exp: 20,
      time: 12,
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
    },
    {
      id: 'props-summary-review',
      section: 4,
      order: 6,
      title: 'Props 마무리 & 복습',
      type: 0,
      exp: 15,
      time: 10,
      content:
        "# 🏁 섹션 4 마무리\n\n이제 여러분은 컴포넌트끼리 대화하는 법을 배웠습니다! \n\n---\n\n### ✅ 핵심 요약\n- **Props**는 부모가 자식에게 주는 **데이터**다.\n- 자식은 Props를 **수정할 수 없다.** (읽기 전용)\n- **함수**도 Props로 넘겨서 자식이 부모의 상태를 바꾸게 할 수 있다.\n- `{ text }` 처럼 **구조 분해 할당**을 쓰면 코드가 예뻐진다.\n\n---\n\n부모로부터 함수를 전달받는 법까지 알게 되었으니, 이제 그 함수를 '언제' 실행할지 결정할 차례입니다. \n사용자의 클릭이나 입력에 반응하는 방법! 다음 섹션인 **이벤트(Event)** 에서 만나요! ⚡",
    },
    {
      id: 'event-what-is-event',
      section: 5,
      order: 0,
      title: 'React에서 이벤트(Event)란?',
      type: 0,
      exp: 15,
      time: 8,
      content:
        '# ⚡ 사용자와의 소통, 이벤트(Event)\n\nReact에서 **이벤트**란 사용자가 화면과 상호작용할 때 발생하는 모든 행동을 의미합니다. \n\n### ❓ 이벤트는 왜 중요한가요?\n\n사용자가 버튼을 누르거나 글자를 입력할 때 화면이 반응하게 만들려면 반드시 이벤트를 가로채야 합니다.\n\n> **사용자의 행동** → 이벤트 발생 → 함수 실행 → **State 변경** → 화면 업데이트\n\n이 흐름의 시작점이 바로 이벤트입니다.\n\n---\n\n### 📌 React 이벤트의 특징\n\n- HTML 이벤트와 비슷하지만, **카멜 케이스(camelCase)** 를 사용합니다.\n- 문자열이 아닌 **함수 그 자체**를 전달합니다.\n\n```jsx\n<button onClick={handleClick}>클릭</button>\n```',
    },
    {
      id: 'event-html-vs-react',
      section: 5,
      order: 1,
      title: 'HTML 이벤트와 React 이벤트의 차이',
      type: 0,
      exp: 15,
      time: 7,
      content:
        '# 🆚 HTML vs React 이벤트\n\nReact 이벤트는 HTML과 비슷해 보이지만 작성 방식이 엄격히 다릅니다.\n\n### ❌ HTML 방식 (문자열 전달)\n```html\n<button onclick="handleClick()">클릭</button>\n```\n\n### ✅ React 방식 (함수 전달)\n```jsx\n<button onClick={handleClick}>클릭</button>\n```\n\n---\n\n### 🧠 핵심 차이점\n\n **이름 규칙** \n```jsx\n //대문자 주의!\n onclick ❌\n onClick ✅\n```\n\n \n **전달 방식** `"onClick"` 따옴표 안에 코드를 적는 게 아니라, `{onClick}` 중괄호 안에 **함수 이름**을 넣습니다.\n\n> React는 "이 버튼이 클릭되면 **이 함수를 나중에 실행해줘**"라고 부탁하는 방식입니다.',
    },
    {
      id: 'event-handler-function',
      section: 5,
      order: 2,
      title: '이벤트 핸들러 함수 만들기',
      type: 0,
      exp: 20,
      time: 10,
      content:
        "# 🛠️ 이벤트 핸들러(Event Handler)\n\n이벤트가 발생했을 때 실행되는 함수를 **이벤트 핸들러**라고 부릅니다.\n\n```jsx\nfunction App() {\n  const handleClick = () => {\n    alert('버튼이 클릭되었습니다!');\n  };\n  return <button onClick={handleClick}>알림 띄우기</button>;\n}\n```\n\n**🖥️ 브라우저 출력 결과:**\n> [알림 띄우기] 버튼\n> (클릭 시 브라우저 알림창 등장)\n\n---\n\n### 💡 함수 이름 짓기 팁\n이벤트 핸들러의 이름은 \n\n```jsx\n handleClick\n onChangeName\n handleSubmit \n```\n\n 위와 같이 **어떤 동작을 하는지** 명확하게 짓는 것이 관습입니다.",
    },
    {
      id: 'event-function-vs-execution',
      section: 5,
      order: 3,
      title: '함수를 전달할까? 실행할까?',
      type: 0,
      exp: 20,
      time: 10,
      content:
        '# ⚠️ 가장 많이 하는 실수: 함수 호출 금지!\n\nReact 이벤트를 작성할 때 가장 흔히 저지르는 실수입니다.\n\n### ❌ 잘못된 코드\n```jsx\n<button onClick={handleClick()}>클릭</button>\n```\n이것은 클릭했을 때 실행되는 게 아니라, **화면이 그려지자마자 함수가 즉시 실행**되어 버립니다.\n\n### ✅ 올바른 코드\n```jsx\n<button onClick={handleClick}>클릭</button>\n```\n함수 뒤에 `()`를 붙이지 않고 이름만 전달해야 합니다.\n\n---\n\n### 🧠 쉽게 기억하기\n\n>handleClick : "나중에 클릭하면 실행해!"(**예약**) \n\n>handleClick() : "지금 당장 실행해!" (**즉시 실행**)',
    },
    {
      id: 'event-state-update',
      section: 5,
      order: 4,
      title: '이벤트로 State 변경하기',
      type: 0,
      exp: 25,
      time: 12,
      content:
        '# 🔄 이벤트와 State의 만남\n\n이벤트의 진정한 목적은 사용자의 입력을 받아 **State를 바꾸는 것**입니다.\n\n```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  const handleIncrease = () => {\n    setCount(count + 1); \n  };\n  return (\n    <div>\n      <p>값: {count}</p>\n      <button onClick={handleIncrease}>더하기</button>\n    </div>\n  );\n}\n```\n\n**🖥️ 브라우저 출력 결과:**\n> 값: 0  \n> [더하기] 클릭 시 숫자가 1씩 증가',
    },
    {
      id: 'quiz-event-camelcase',
      section: 5,
      order: 5,
      title: 'React 이벤트 문법 퀴즈',
      type: 1,
      exp: 20,
      time: 5,
      question: 'React에서 버튼 클릭 이벤트를 올바르게 작성한 것은 무엇인가요?',
      options: [
        'onclick="handleClick()"',
        'onClick={handleClick}',
        'onClick="handleClick"',
        'onclick={handleClick()}',
      ],
      correctAnswerIndex: 1,
      explanation:
        'React 이벤트는 카멜 케이스(onClick)를 사용하며, 중괄호 안에 함수 이름을 전달합니다.',
    },
    {
      id: 'quiz-event-short-answer',
      section: 5,
      order: 6,
      title: '이벤트 개념 단답 퀴즈',
      type: 2,
      exp: 20,
      time: 5,
      question:
        "React 이벤트 핸들러에 전달해야 하는 것은 함수의 '실행 결과'일까요, '함수 그 자체'일까요?",
      correctAnswer: '함수',
      explanation:
        '이벤트가 발생했을 때 비로소 실행되도록 함수 자체를 넘겨주어야 합니다.',
    },
    {
      id: 'event-summary-review',
      section: 5,
      order: 7,
      title: 'Section 5 마무리: 이벤트 정리',
      type: 0,
      exp: 15,
      time: 7,
      content:
        '# 🏁 섹션 5 마무리\n\n이제 여러분은 사용자의 클릭에 반응하는 생동감 있는 컴포넌트를 만들 수 있습니다!\n\n### ✅ 핵심 요약\n- React 이벤트는 **camelCase**를 사용한다 `onClick`\n- 이벤트 핸들러에는 **함수 이름**만 전달한다.`onClick={handleClick}`\n- 이벤트를 통해 **State를 변경**하면 화면이 다시 그려진다.\n\n---\n\n다음 섹션에서는 여러 개의 데이터를 한 번에 다루는 법과 **불변성**에 대해 알아보겠습니다. \n\n이제 본격적으로 데이터를 다루는 법을 배울 시간입니다! 🚀',
    },
    {
      id: 'list-intro',
      section: 6,
      order: 0,
      title: 'List와 Object 기초 이해하기',
      type: 0,
      exp: 10,
      time: 5,
      content:
        "# 📦 데이터를 묶는 방법: 배열과 객체\n\nReact 앱에서 다루는 대부분의 데이터는 **배열(List)** 과 **객체(Object)** 형태입니다. \n\n### 1️⃣ 무엇이 다른가요?\n- **배열(List)**: [사과, 바나나, 딸기] 처럼 **순서**가 있는 데이터 묶음입니다.\n`[사과, 바나나, 딸기]`\n- **객체(Object)**: { 이름: '철수', 나이: 20 } 처럼 **의미(Key)** 가 있는 데이터 묶음입니다.\n`{ 이름: '철수', 나이: 20 }`\n\n---\n\n### 2️⃣ React에서 왜 중요할까요?\n- **배열**: 투두 리스트의 목록처럼 **반복되는 화면**을 만들 때 사용합니다.\n- **객체**: 한 명의 사용자 정보처럼 **복합적인 데이터**를 관리할 때 사용합니다.",
    },
    {
      id: 'list-render',
      section: 6,
      order: 1,
      title: '배열 데이터를 화면에 반복 렌더링하기',
      type: 0,
      exp: 15,
      time: 12,
      content:
        '# 🔄 반복문의 리액트 버전: map()\n\n배열을 화면에 뿌릴 때는 자바스크립트의 **`map()`** 함수를 사용합니다.\n\n### ✅예시 \n```jsx\n{fruits.map((fruit, index) => (\n  <li key={index}>{fruit}</li>\n))}\n```\n\n---\n\n### 📌 왜 key 속성이 필수인가요?\n\nReact는 **key**를 보고 "아, 1번 항목이 수정됐구나", "2번 항목이 삭제됐구나"를 판단합니다.\n\n **💡 꿀팁**\n> 지금은 연습이라 **index**를 key로 쓰지만, 실제 서비스에서는 데이터의 **고유 ID(예: id: 101)** 를 key로 쓰는 것이 가장 안전합니다. \n>**index**를 key로 쓰면 리스트의 순서가 바뀔 때 React가 혼란에 빠질 수 있거든요!',
    },
    {
      id: 'list-reference-concept',
      section: 6,
      order: 2,
      title: '객체와 배열: 메모리 주소(참조)의 비밀',
      type: 0,
      exp: 15,
      time: 10,
      content:
        "# 🔗 왜 직접 수정하면 안 될까요? (참조 이해하기)\n\n리액트가 State가 바뀌었는지 확인하는 방법은 의외로 단순합니다. **\"이전 주소와 지금 주소가 똑같은가?\"** 를 비교하죠.\n\n### 1️⃣ 일반 변수 vs 객체/배열\n- **일반 변수(숫자, 문자)**: 값이 바뀌면 리액트가 바로 알아챕니다.\n- **객체/배열**: 실제 데이터가 아닌, 데이터가 저장된 **'메모리 주소(참조)'** 를 변수에 담고 있습니다.\n\n### 2️⃣ 리액트가 변화를 모르는 이유\n```javascript\nconst [user, setUser] = useState({ name: '철수' });\n\nuser.name = '영희'; // ❌ 데이터는 바뀌었지만, '주소'는 그대로입니다.\nsetUser(user);    // 🧐 리액트: \"주소가 똑같네? 아무것도 안 바뀌었구나!\"\n```\n\n\n\n### 💡 결론\n리액트를 깨우려면 안의 내용물만 바꾸는 게 아니라, **새로운 주소(새로운 객체)** 를 만들어서 통째로 갈아 끼워줘야 합니다. 이때 필요한 도구가 바로 **스프레드 연산자**입니다.",
    },
    {
      id: 'state-array-copy',
      section: 6,
      order: 3,
      title: '스프레드 연산자(...): 새로운 참조 만들기',
      type: 0,
      exp: 15,
      time: 12,
      content:
        "# ✨ 복사해서 새로 만들기: 스프레드 연산자(...)\n\n'참조의 문제'를 해결하는 가장 깔끔한 방법입니다. 기존 데이터를 그대로 복사해 **새로운 주소를 가진 복제본**을 만드는 것이죠.\n\n### 🔹 배열 업데이트 패턴\n```jsx\nconst [todos, setTodos] = useState(['우유']);\n\n// [...기존배열, 새항목] -> 기존 것을 펼쳐서 새 배열에 담기!\nsetTodos([...todos, '공부']); \n```\n\n### 🔹 객체 업데이트 패턴\n```jsx\nconst [user, setUser] = useState({ name: '철수', age: 20 });\n\n// { ...기존객체, 수정할속성 } -> 나머지는 복사하고 age만 덮어쓰기!\nsetUser({ ...user, age: 21 });\n```\n\n**🖥️ 브라우저 결과:**\n> 메모리 주소(참조)가 바뀌었으므로 리액트가 즉시 감지하고 화면을 **재렌더링**합니다.",
    },
    {
      id: 'state-immutability',
      section: 6,
      order: 4,
      title: '불변성(Immutable)과 상태 관리',
      type: 0,
      exp: 15,
      time: 8,
      content:
        '# 🛡️ 데이터를 지키는 원칙, 불변성\n\n**불변성**이란 상태를 직접 변경하지 않는 원칙을 말합니다. \n\n### ❓ 직접 수정하면 안 되는 이유\nReact는 이전 데이터와 새 데이터의 **메모리 주소(참조)** 를 비교합니다. \n주소가 바뀌지 않으면 데이터가 변했다고 판단하지 않아 화면을 다시 그리지 않습니다.\n\n---\n\n### 🛠️ 불변성을 지켜주는 도구 모음\n\n리액트 상태 업데이트 시, 아래 도구들은 기존 배열을 건드리지 않고 **새로운 배열을 반환**하므로 안심하고 사용할 수 있습니다.\n\n**1️⃣ 스프레드 연산자**\n```javascript\n[...] // 기존 배열 복사 및 항목 추가\n{...} // 기존 객체 복사 및 속성 수정\n```\n\n**2️⃣ 얕은 복사본을 반환하는 주요 메서드**\n```javascript\n.map()    // 모든 요소를 변형하여 새 배열 생성\n.filter() // 조건에 맞는 요소만 골라내어 새 배열 생성\n.concat() // 여러 배열을 합쳐서 새 배열 생성\n.slice()  // 배열의 일부분을 잘라내어 새 배열 생성\n\n// (최신 문법) 원본을 바꾸지 않는 정렬과 역순\n.toSorted()\n.toReversed()\n```\n\n---\n\n### ✅ 핵심 요약\n\n 기존 데이터를 직접 수정하는 \n\n```jsx\n push   // 데이터 추가 \n splice // 데이터 추가 / 삭제 \n sort   // 데이터 정렬 \n```\n\n 등은 리액트에서 잠시 잊어주세요! \n항상 위 도구들을 활용해 **새 복사본**을 만들어 **setState** 에 전달하는 것이 리액트의 정석입니다.',
    },
    {
      id: 'quiz-list-map',
      section: 6,
      order: 5,
      title: '배열 렌더링 퀴즈',
      type: 2,
      question:
        'React에서 배열을 화면에 반복 렌더링할 때 사용하는 JavaScript 메서드의 이름을 쓰세요.',
      correctAnswer: 'map',
      explanation:
        'map() 함수는 배열의 각 요소를 돌며 JSX 엘리먼트로 변환해주는 역할을 합니다.',
      exp: 10,
      time: 3,
    },
    {
      id: 'quiz-immutability-reason',
      section: 6,
      order: 6,
      title: '불변성 원리 퀴즈',
      type: 1,
      question:
        '객체나 배열을 직접 수정했을 때 리액트가 화면을 다시 그리지 않는 이유는 무엇인가요?',
      options: [
        '자바스크립트 엔진에 에러가 발생해서',
        '리액트는 값이 아닌 메모리 주소(참조)의 변화를 감지하기 때문에',
        '직접 수정하면 데이터가 삭제되기 때문에',
        '리액트가 객체를 싫어하기 때문에',
      ],
      correctAnswerIndex: 1,
      explanation:
        '리액트는 이전 상태와 새로운 상태의 참조(주소)가 다를 때만 업데이트를 수행합니다.',
      exp: 20,
      time: 5,
    },
    {
      id: 'list-summary-review',
      section: 6,
      order: 7,
      title: 'Section 6 마무리: 리스트와 불변성',
      type: 0,
      exp: 20,
      time: 7,
      content:
        "# 🏁 섹션 6 정리\n\n리액트 개발자라면 평생 지켜야 할 **'불변성'** 의 기초를 마스터하셨습니다!\n\n### ✅ 핵심 포인트\n- **map()** 으로 리스트를 그리고, **key**를 꼭 부여하자.\n- 객체/배열은 **메모리 주소(참조)** 를 가진다.\n- **스프레드(...)** 연산자로 항상 **새로운 주소**를 가진 복사본을 만들어 State를 업데이트하자.\n\n---\n\n이제 여러 데이터를 다루는 법까지 알게 되었습니다. \n\n데이터를 보여주는 법을 배웠으니, 이제 사용자로부터 데이터를 **'입력'** 받는 법을 배울 차례입니다. \n투두 리스트의 핵심 기능! 다음 섹션인 **Section 7: Form 이벤트**에서 만나요! 🚀",
    },
    {
      id: 'form-intro',
      section: 7,
      order: 0,
      title: '왜 Form 이벤트를 배워야 할까요?',
      type: 0,
      exp: 10,
      time: 5,
      content:
        '# 📝 입력의 시작, Form 이벤트\n\n지금까지는 버튼을 누르는 단순한 클릭만 배웠지만, 실제 서비스에서는 사용자의 **글자 입력**을 받아야 하는 경우가 훨씬 많습니다.\n\n### 📌 _Form_, 이런 곳에 쓰입니다\n- Todo 내용 입력\n- 검색어 입력\n- 로그인 및 회원가입\n\n> **Todo-List 앱의 진정한 시작**은 버튼이 아니라 **input + form** 입니다.\n\n이번 섹션에서는 본격적인 프로젝트 실습 전에 꼭 필요한 입력 처리의 기초를 다룹니다.',
    },
    {
      id: 'form-controlled-input',
      section: 7,
      order: 1,
      title: 'input 값은 왜 State로 관리할까요?',
      type: 0,
      exp: 15,
      time: 8,
      content:
        "# 🕹️ 내 마음대로 조종하는 제어 컴포넌트\n\nReact에서 input은 단순히 글자가 써지는 상자가 아니라, **State와 연결된 장치**입니다. 이를 **제어 컴포넌트**라고 부릅니다.\n\n### ❓ 왜 입력이 안 될까요?\n```jsx\nconst [text, setText] = useState('');\n\n<input value={text} /> // value가 빈 값('')으로 고정됨!\n```\n이렇게만 쓰면 키보드를 눌러도 글자가 써지지 않습니다. `value`가 State에 꽉 묶여있기 때문이죠. \n\n**해결책**: 사용자가 입력할 때마다 State를 바꿔주는 **이벤트**가 세트로 필요합니다!",
    },
    {
      id: 'form-onchange',
      section: 7,
      order: 2,
      title: 'onChange 이벤트로 입력값 처리하기',
      type: 0,
      exp: 20,
      time: 12,
      content:
        "# 🔄 실시간 입력 감지: onChange\n\n사용자가 글자를 한 자 한 자 입력할 때마다 실행되는 이벤트가 바로 **onChange** 입니다.`onChange` \n\n ### ✅ 예시 코드로 보기 \n\n```jsx\nfunction InputExample() {\n  const [text, setText] = useState('');\n\n  const handleChange = (e) => {\n    setText(e.target.value); // 입력한 글자를 State에 저장!\n  };\n\n  return <input value={text} onChange={handleChange} />;\n}\n```\n\n**🖥️ 브라우저 흐름**\n 키보드 입력 ➡️ onChange 발생 ➡️  setText 실행 ➡️  State 변경 ➡️  화면(input) 업데이트\n\n",
    },
    {
      id: 'form-event-object',
      section: 7,
      order: 3,
      title: '이벤트 객체(e)는 무엇인가요?',
      type: 0,
      exp: 15,
      time: 7,
      content:
        '# 📦 정보 꾸러미, 이벤트 객체(e)\n\n이벤트 함수를 만들 때 매개변수로 받는 **e** (또는 **event**)는 발생한 이벤트의 모든 정보가 담긴 객체입니다.\n\n```jsx\n e\n //또는\nevent\n```  \n\n### 🔑 가장 중요한 속성 하나\n **`e.target.value`** 현재 input 상자에 입력된 **실제 텍스트**값입니다.\n\n지금 단계에서는 이것 하나만 기억해도 충분합니다! 나머지 복잡한 정보들은 나중에 필요할 때 꺼내 쓰면 됩니다.',
    },
    {
      id: 'form-submit',
      section: 7,
      order: 4,
      title: 'form과 onSubmit 이벤트',
      type: 0,
      exp: 20,
      time: 10,
      content:
        '# 📨 한 번에 제출하기: form & onSubmit\n\n보통 입력창 하나와 버튼 하나를 묶어서 데이터를 처리할 때 **<form>** 태그를 사용합니다.\n `<form>`\n\n### ❓ 왜 굳이 form으로 감싸나요?\n단순히 `<div>`로 묶어도 되지만, `<form>`을 사용하면 웹 브라우저가 제공하는 **\'제출(Submit) 기능\'** 을 그대로 활용할 수 있기 때문입니다.\n\n### ✅ 예시 코드로 보기\n```jsx\n<form onSubmit={handleTodoSubmit}>\n  <input />\n  <button type="submit">추가</button>\n</form>\n```\n\n---\n\n### 🧠 onSubmit은 어떻게 작동하나요?\n **1.자동 감지** \n>버튼을 클릭하거나, 입력창에서 **Enter키**를 누르면 브라우저가 "아, 이 양식을 제출하려나 보구나!"라고 판단합니다.\n **2.이벤트 발생** \n>그 순간 **<form>** 태그에 걸려있는 **onSubmit** 함수가 실행됩니다.\n\n### 💡 사용자가 편해지는 장점\n- **장점 1**: 일일이 클릭 이벤트를 걸지 않아도 버튼 하나로 제출됩니다.\n- **장점 2**: 마우스를 쓰지 않고 **Enter키**만 쳐도 데이터가 넘어가므로 사용자 경험(UX)이 훨씬 좋아집니다.\n\n> 📌 즉, **form**은 데이터를 보내기 위한 **하나의 세트**라고 생각하면 쉽습니다!',
    },
    {
      id: 'form-prevent-default',
      section: 7,
      order: 5,
      title: 'event.preventDefault()는 왜 필요할까요?',
      type: 0,
      exp: 20,
      time: 10,
      content:
        '# 🛑 새로고침 멈춰! preventDefault\n\nHTML의 **form**은 제출되는 순간 페이지를 **새로고침** 해버리는 아주 오래된 습성이 있습니다.\n\n### ❌ 새로고침의 문제\n리액트 앱에서 새로고침이 일어나면, 정성껏 쌓아둔 **State가 모두 초기화**되어 버립니다.\n\n### ✅ 해결 방법\n```jsx\nconst handleSubmit = (e) => {\n  e.preventDefault(); // "브라우저야, 네 맘대로 새로고침하지 마!"\n  // 이후에 원하는 로직 작성\n};\n```\n\n리액트 프로젝트의 모든 Form 제출 함수에는 이 코드가 **첫 줄**에 들어간다고 보셔도 무방합니다.',
    },
    {
      id: 'form-submit-example',
      section: 7,
      order: 6,
      title: '입력 + 제출 전체 흐름 예제',
      type: 0,
      exp: 25,
      time: 15,
      content:
        '# 🧩 조각 모음: Form 완성 예제\n\n입력부터 제출, 초기화까지의 전체 과정을 한눈에 확인해봅시다.\n\n```jsx\nfunction SimpleForm() {\n  const [text, setText] = useState(\'\');\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log("제출된 데이터:", text);\n    setText(\'\'); // 제출 후 입력창 비우기\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={text} onChange={(e) => setText(e.target.value)} />\n      <button type="submit">확인</button>\n    </form>\n  );\n}\n```\n\n이 코드의 구조가 여러분이 곧 만들게 될 **Todo-List의 핵심 뼈대**가 됩니다!',
    },
    {
      id: 'quiz-form-onchange',
      section: 7,
      order: 7,
      title: 'input 이벤트 퀴즈',
      type: 1,
      exp: 20,
      time: 3,
      question:
        'input의 값이 바뀔 때마다 실행되어 State를 업데이트하기 위해 사용하는 React 이벤트는 무엇인가요?',
      options: ['onClick', 'onSubmit', 'onChange', 'onInput'],
      correctAnswerIndex: 2,
    },
    {
      id: 'quiz-form-prevent',
      section: 7,
      order: 8,
      title: 'Form 이벤트 단답 퀴즈',
      type: 2,
      exp: 25,
      time: 4,
      question:
        'form 제출 시 브라우저의 기본 동작(새로고침)을 막기 위해 호출하는 메서드는 무엇인가요?',
      correctAnswer: 'preventDefault',
    },
    {
      id: 'form-summary-review',
      section: 7,
      order: 9,
      title: 'Section 7 마무리: Form 이벤트 정리',
      type: 0,
      exp: 15,
      time: 7,
      content:
        '# 🏁 섹션 7 마무리\n\n이제 여러분은 사용자의 목소리(입력값)를 들을 준비가 되었습니다!\n\n### ✅ 핵심 요약\n- **제어 컴포넌트**: input의 값(**value**)을 State와 동기화한다.\n- **onChange**: 입력할 때마다 State를 실시간으로 바꾼다.\n- **preventDefault()**: 폼 제출 시 원치 않는 새로고침을 막아준다.\n\n---\n\n고생하셨습니다! 이제 더 이상 연습용 예제는 그만. \n다음 섹션에서는 지금까지 배운 모든 조각을 하나로 합쳐 **진짜 Todo-List 프로젝트**를 시작합니다! 💪🚀',
    },
    {
      id: 'todo-intro-structure',
      section: 8,
      order: 0,
      title: 'Todo 프로젝트 시작 & 구조 살펴보기',
      type: 0,
      exp: 15,
      time: 7,
      content:
        "# 🛠️ 진짜 서비스를 만들어봅시다\n\n이번 섹션에서는 지금까지 배운 모든 퍼즐 조각을 맞춰 **Todo List 앱**을 처음부터 직접 만들어봅니다.\n\n### 📁 프로젝트 진행 방식\n- 처음에는 복잡하지 않게 **App.tsx 하나에서 시작**합니다.\n- 기능이 다 돌아갈 때쯤, 역할별로 부품(컴포넌트)을 나눌 거예요.\n\n---\n\n### 🧭 프로젝트 완성 구조 미리보기\n\n최종적으로 우리가 만들 앱의 모습은 아래와 같은 계층 구조를 가집니다.\n\n```bash\nApp (메인 부모)\n┃\n┣━ TodoForm (입력 영역)\n┃   ┗━ input + button\n┃\n┗━ TodoList (목록 영역)\n    ┗━ TodoItem (개별 항목)\n        ┗━ 삭제 버튼\n```\n\n\n\n---\n\n 💡 **학습 팁** \n>처음에는 위 구조를 한 파일에 다 적겠지만, 나중에 하나씩 떼어내어 '독립된 부품'으로 만드는 과정을 경험하게 될 것입니다.\n> 스타일(CSS)보다는 **데이터가 어떻게 흐르는지**에만 집중하세요!",
    },
    {
      id: 'todo-state-init',
      section: 8,
      order: 1,
      title: 'Todo 리스트 상태 만들기',
      type: 0,
      exp: 20,
      time: 8,
      content:
        "# 뼈대 만들기: 데이터 구조 잡기\n\n가장 먼저 할 일 목록을 저장할 **State**를 만들어야 합니다.\n\n### 🧠 Todo 데이터의 생김새\n각각의 할 일은 구분을 위해 **ID**와 **내용**이 필요합니다.\n\n```jsx\nconst [todos, setTodos] = useState([\n  { id: 1, text: '리액트 기초 정복하기' },\n  { id: 2, text: '투두 앱 완성하기' },\n]);\n```\n\n---\n### 📌 기억하세요\n 목록은 **배열 `[ ]`** 형태입니다.\n 목록 안의 하나하나의 데이터는 **객체 `{ }`** 형태입니다.",
    },
    {
      id: 'todo-render-list',
      section: 8,
      order: 2,
      title: 'Todo 리스트 화면에 출력하기',
      type: 0,
      exp: 20,
      time: 10,
      content:
        '# 🖼️ 화면에 뿌려주기: map()\n\n만들어둔 데이터를 사용자에게 보여줄 차례입니다.\n\n```jsx\n<ul>\n  {todos.map((todo) => (\n    <li key={todo.id}>{todo.text}</li>\n  ))}\n</ul>\n```\n\n---\n### 📌 체크 포인트\n- **map()** 을 써서 배열 개수만큼 **<li>** 를 만듭니다.\n- 리액트가 헷갈리지 않게 고유한 키 값을 꼭 넣어주세요!`key={todo.id}`',
    },
    {
      id: 'todo-input-state',
      section: 8,
      order: 3,
      title: '입력 폼과 입력 상태 만들기',
      type: 0,
      exp: 20,
      time: 10,
      content:
        '# ✍️ 글자 입력받기\n\n새로운 할 일을 입력할 상자와 그 값을 기억할 State를 만듭니다.\n\n```jsx\nconst [input, setInput] = useState(\'\');\n\n// ...중략\n\n<input\n  value={input}\n  onChange={(e) => setInput(e.target.value)}\n  placeholder="할 일을 입력하세요"\n/>\n```\n\n### 📌 왜 이렇게 하나요?\n> 입력창의 값(**value**)을 State(**input**)와 연결해야 리액트가 입력값을 완벽하게 제어할 수 있습니다. (이걸 **제어 컴포넌트**라고 불렀었죠!)',
    },
    {
      id: 'todo-submit-add',
      section: 8,
      order: 4,
      title: '폼 제출로 Todo 추가하기',
      type: 0,
      exp: 25,
      time: 15,
      content:
        "# ➕ 리스트에 새 항목 추가하기\n\n이제 입력한 글자를 진짜 리스트에 넣어봅시다.\n\n```jsx\nconst onSubmit = (e) => {\n  e.preventDefault(); // 새로고침 방지!\n\n  const newTodo = {\n    id: Date.now(), // 고유한 ID 생성\n    text: input,\n  };\n\n  setTodos([...todos, newTodo]); // 불변성 유지하며 추가!\n  setInput(''); // 입력창 비워주기\n};\n```\n\n### 💡 여기서 잠깐! Date.now()가 뭐죠?\nID는 리스트에서 각 항목을 구분하는 **주민등록번호**와 같습니다. 그래서 절대 중복되면 안 되죠.\n\n- **Date**: 자바스크립트에서 날짜와 시간을 다루는 도구입니다.\n- **.now()**: 이 함수를 실행하는 **'그 찰나의 시간'** 을 밀리초(1/1000초) 단위의 숫자로 반환합니다.\n- **왜 쓰나요?**: 시간은 멈추지 않고 흐르기 때문에, 실행할 때마다 항상 다른 숫자가 나옵니다. 덕분에 별도의 데이터베이스가 없는 연습용 프로젝트에서 **중복되지 않는 고유 ID**를 만들 때 아주 유용하게 쓰입니다!\n\n---\n\n### ✅ 이제 가능한 기능\n- 글자 입력 후 Enter 또는 버튼 클릭 ➡️ 입력한 값이 목록에 짠! 하고 나타납니다.\n- 리액트의 **불변성 원칙** 덕분에 화면이 즉시 업데이트됩니다.",
    },
    {
      id: 'todo-split-components',
      section: 8,
      order: 5,
      title: '심화 1: 컴포넌트로 분리해보기',
      type: 0,
      exp: 20,
      time: 10,
      content:
        "# ✂️ 코드 청소: 컴포넌트 나누기\n\n코드가 길어지면 읽기 힘들어집니다. 이제 역할에 따라 부품을 나눠볼까요?\n\n1. **TodoForm**: 입력창과 추가 버튼 담당\n2. **TodoList**: 할 일 목록 출력 담당\n\n---\n\n### 📝 현재 App.tsx의 모습 (분리 직후)\n\n```jsx\nimport { useState } from 'react';\nimport TodoForm from './TodoForm'; \nimport TodoList from './TodoList'; \n\nfunction App() {\n  const [todos, setTodos] = useState([\n    { id: 1, text: '리액트 기초 정복하기' },\n    { id: 2, text: '투두 앱 완성하기' },\n  ]);\n  const [input, setInput] = useState('');\n\n  const onSubmit = (e) => {\n    e.preventDefault();\n    const newTodo = { id: Date.now(), text: input };\n    setTodos([...todos, newTodo]);\n    setInput('');\n  };\n\n  return (\n    <div>\n      <h1>My Todo List</h1>\n      <TodoForm /> \n      <TodoList />\n    </div>\n  );\n}\n```\n\n> 💡 **미션**: 위 코드처럼 파일을 분리하고 저장해보세요. 화면이 어떻게 변하나요? 아마 예상치 못한 상황이 벌어질 것입니다.",
    },
    {
      id: 'todo-error-why',
      section: 8,
      order: 6,
      title: '심화 2: 왜 에러가 발생할까요?',
      type: 0,
      exp: 25,
      time: 8,
      content:
        '# 🧐 "todos가 정의되지 않았어요!"\n\n컴포넌트를 분리하자마자 브라우저에 빨간 에러 메시지가 떴을 겁니다. \n분명 코드는 완벽하게 옮긴 것 같은데 왜 그럴까요?\n\n### 🧠 원인: 담장 너머의 데이터\n자바스크립트에서 변수나 함수는 **선언된 곳**을 기준으로 영역이 나뉩니다.\n\n- **데이터의 위치**: 부모 컴포넌트(App.tsx) 의 방 안에 있습니다.\n- **데이터가 필요한 곳**: 자식 컴포넌트(TodoForm, TodoList) 의 방 안입니다.\n\n자식 컴포넌트 입장에서는 부모 방에 뭐가 있는지 전혀 알 수가 없습니다. \n마치 옆집에 누가 사는지 모르는 것과 같죠.\n\n### 📦 해결책: 데이터 배달 서비스 (Props)\n>부모가 가진 데이터를 자식에게 공식적으로 전달해주는 과정이 필요합니다. \n다음 단계에서 **Props**라는 택배 상자에 데이터를 담아 자식들에게 안전하게 배달해보겠습니다!',
    },
    {
      id: 'todo-pass-props',
      section: 8,
      order: 7,
      title: '심화 3: Props로 에러 해결하기',
      type: 0,
      exp: 25,
      time: 20,
      content:
        "# 🎁 데이터 배달하기: Props로 연결 완료\n\n부모(**App.tsx**)가 가진 보따리를 자식들에게 전달하여 에러를 해결해봅시다. \n이제 각 컴포넌트는 자신이 해야 할 일을 정확히 알게 됩니다.\n\n### 🔗 연결 고리 만들기 (App.tsx)\n```jsx\n<TodoForm input={input} setInput={setInput} onSubmit={onSubmit} />\n<TodoList todos={todos} />\n```\n\n---\n\n### 📂 완성된 전체 코드 구조\n\n수강생 여러분의 코드와 아래 파일별 내용을 대조해보세요!\n\n#### 1️⃣ App.tsx (중심부: State 관리 및 배달)\n```jsx\nimport { useState } from 'react';\nimport TodoForm from './TodoForm';\nimport TodoList from './TodoList';\n\nfunction App() {\n  const [todos, setTodos] = useState([\n    { id: 1, text: '리액트 기초 정복하기' },\n    { id: 2, text: '투두 앱 완성하기' },\n  ]);\n  const [input, setInput] = useState('');\n\n  const onSubmit = (e) => {\n    e.preventDefault();\n    const newTodo = { id: Date.now(), text: input };\n    setTodos([...todos, newTodo]);\n    setInput('');\n  };\n\n  return (\n    <div>\n      <h1>My Todo List</h1>\n      {/* 필요한 데이터를 Props로 전달합니다 */}\n      <TodoForm input={input} setInput={setInput} onSubmit={onSubmit} />\n      <TodoList todos={todos} />\n    </div>\n  );\n}\n```\n\n#### 2️⃣ TodoForm.tsx (입력 담당: 받은 함수 실행)\n```jsx\nfunction TodoForm({ input, setInput, onSubmit }) {\n  return (\n    <form onSubmit={onSubmit}>\n      <input value={input} onChange={(e) => setInput(e.target.value)} />\n      <button type=\"submit\">추가</button>\n    </form>\n  );\n}\n```\n\n#### 3️⃣ TodoList.tsx (출력 담당: 받은 배열 렌더링)\n```jsx\nfunction TodoList({ todos }) {\n  return (\n    <ul>\n      {todos.map((todo) => (\n        <li key={todo.id}>{todo.text}</li>\n      ))}\n    </ul>\n  );\n}\n```\n\n---\n\n### 🔑 오늘 배운 핵심 흐름\n1. **데이터(State)** 는 부모에서 자식으로 흐릅니다. (위 → 아래)\n2. **이벤트(함수)** 는 자식에서 부모의 상태를 바꾸기 위해 호출됩니다. (아래 → 위)\n\n> 이제 코드가 훨씬 관리하기 편해졌고, 기능은 이전과 똑같이 완벽하게 돌아갑니다! 🎉",
    },
    {
      id: 'todo-delete-filter',
      section: 8,
      order: 8,
      title: '심화 4: Todo 삭제 기능 구현',
      type: 0,
      exp: 30,
      time: 18,
      content:
        '# 🗑️ 잘못 만든 일정, 깔끔하게 지우기\n\n우리가 쓰는 일반적인 일정 관리 앱들을 떠올려보세요. 할 일을 추가하는 기능만큼이나 중요한 게 바로 **수정과 삭제**죠? 추가만 되고 지울 수 없는 앱이라면 금방 할 일이 가득 차서 아무도 쓰지 않을 거예요.\n\n우리의 Todo List도 이제 \'완성도\'를 높일 때가 되었습니다. 이번 시간에는 **삭제 기능**을 추가해 보겠습니다!\n\n---\n\n### 1️⃣ 버튼부터 달아주기 (TodoList.tsx)\n\n먼저 각 할 일 옆에 지우개 역할을 할 버튼을 하나씩 만들어야겠죠?\n\n```jsx\n{todos.map((todo) => (\n  <li key={todo.id}>\n    {todo.text}\n    {/* 클릭하면 해당 todo의 id를 onDelete 함수로 보낼 거예요 */}\n    <button onClick={() => onDelete(todo.id)}>삭제</button>\n  </li>\n))}\n```\n\n---\n\n### 2️⃣ 핵심 로직: filter 함수 이해하기\n\n삭제의 핵심은 **"내가 클릭한 녀석만 빼고 나머지는 다 남겨줘!"** 라고 리액트에게 말하는 것입니다. \n이때 자바스크립트의 **filter** 함수가 마법사 역할을 합니다.\n\n```jsx\nconst onDelete = (id) => {\n  // 전체 목록(todos)에서 하나씩 꺼내어 검사합니다.\n  // 조건: "지금 검사 중인 todo의 id가 내가 방금 클릭한 id와 다른가?"\n  const updatedTodos = todos.filter((todo) => todo.id !== id);\n  \n  setTodos(updatedTodos);\n};\n```\n\n### 🧠 filter가 작동하는 원리\n- **정수기 필터**를 상상해보세요. 오염물질만 걸러내고 깨끗한 물만 통과시키죠? **filter**도 똑같습니다.\n- **조건문 (todo.id !== id)** 의 조건이 **참(True)** 인 데이터들만 살아남아 새로운 배열에 담깁니다. 내가 삭제 버튼을 누른 데이터는 이 조건에서 **거짓(False)** 이 되어 탈락하게 되죠.\n- **불변성** : 기존 **todos** 배열에서 요소를 직접 꺼내 버리는 게 아닙니다! 조건을 통과한 데이터들로 **\'완전 새로운 배열\'** 을 만들어 갈아끼우는 방식입니다. 그래서 리액트가 변화를 즉시 감지할 수 있습니다.\n\n---\n\n### 3️⃣ 결과 확인\n 이제 삭제 버튼을 누르면 해당 항목이 화면에서 마법처럼 사라집니다.\n\n ```jsx\n //데이터의 흐름 \n 삭제 버튼 클릭 ➡️ onDelete 실행 ➡️ filter로 새 배열 생성 ➡️ setTodos로 화면 업데이트!\n```\n\n> 축하합니다! 이제 추가와 삭제가 모두 가능한 **진짜 웹 서비스**의 기본을 갖추게 되었습니다. 👏',
    },
    {
      id: 'todo-section8-summary',
      section: 8,
      order: 9,
      title: 'Section 8 마무리: Todo 앱 완성',
      type: 0,
      exp: 20,
      time: 7,
      content:
        "# 🎉 드디어 하나의 앱을 완성했습니다!\n\n여러분은 방금 실제 돌아가는 서비스를 리액트로 직접 구현해냈습니다. 이론으로만 접하던 데이터 흐름과 상태 관리를 '내 코드'로 증명해낸 아주 값진 순간입니다.\n\n### ✅ 우리가 함께 정복한 것들\n- **데이터 관리**: 배열과 객체를 활용한 리스트 출력\n- **상호작용**: 사용자의 입력값(Input)을 State로 제어하기\n- **구조화**: 컴포넌트 분리와 Props를 통한 데이터 전달\n- **불변성**: **filter**를 활용해 원본을 지키며 데이터 삭제하기\n\n---\n\n### 🚀 여기서 멈추지 마세요!\n기본적인 뼈대는 완성되었지만, 이 앱을 진짜 '나만의 것'으로 만들 수 있는 방법은 무궁무진합니다.\n\n- **스타일링**: 여러분만의 감각을 더해 CSS로 옷을 입혀보세요.\n- **기능 확장**: 이미 완료한 항목을 수정하거나, 버튼 하나로 모든 리스트를 비우는 '전체 삭제' 기능은 어떨까요?\n- **도전**: 할 일을 완료했을 때 가로줄이 그어지는 체크박스 기능을 만들어보는 것도 좋습니다.\n\n\n\n---\n\n### 🤝 여러분의 결과물을 자랑해 주세요!\n여러분의 개성과 열정이 담긴 Todo List가 정말 궁금합니다. 완성된 결과물이나 코드를 **커뮤니티 페이지**에 공유해 보세요! 동료들의 멋진 작품을 보며 영감을 얻고, 여러분의 성장을 마음껏 뽐낼 수 있는 최고의 공간이 될 것입니다.\n\n정말 고생 많으셨습니다! \n이 앱이 여러분의 리액트 개발 인생의 든든한 첫 번째 이정표가 되길 진심으로 응원합니다. 👏\n\n```jsx\nreturn (\n  <h1>See you again!</h1>\n); \n//Made by Ryan\n```",
    },
    // {
    //   title: "useEffect: 컴포넌트의 탄생과 죽음",
    //   content:
    //     "**useEffect**는 컴포넌트가 처음 화면에 나타날 때 실행할 코드를 작성하는 곳입니다.\n\n```jsx\nuseEffect(() => {\n  console.log('앱이 실행되었습니다!');\n}, []);\n```\n\n서버 통신, 타이머 설정 등\n사이드 이펙트를 처리할 때 사용합니다.",
    //   section: 9,
    //   type: 0,
    //   id: "bonus-useeffect-lifecycle",
    //   exp: 20,
    //   order: 1,
    // },
  ];

export const contentDataJp: Content[] = [
  {
    id: 'section1-orientation',
    section: 1,
    order: 0,
    title: 'レクチャーを始める：何を作るのでしょうか？',
    type: 0,
    exp: 5,
    time: 5,
    content:
      '# 🚀 ようこそ！Reactの世界へ\n\nこんにちは 👋 \n\nこのレクチャーを通じて、React.jsに関する基礎知識を身につけることができます。\n\n本コースは、**Reactを初めて触る方**でも、実際に一つの完成されたWebアプリケーションを作り上げることを目標にしています。\n\n---\n\n### 🧠 受講前に知っておくと良いこと\n\nReactを学ぶ前に、以下のような**基本的なWeb開発の知識**を知っていると、よりスムーズに理解できます。\n\n> 📌 **必要な事前知識**\n>\n> - 基本的な **HTML構造** (タグ、属性など)\n> - **JavaScriptの基礎文法** (変数、関数、配列)\n\n---\n\n### 🎯 レクチャーのコンセプト\n\n- Reactの核心概念を**実際に作りながら**理解します。\n- 複雑な理論よりも、**「なぜこのように使うのか」**という実用性に集中します。\n\n---\n\n### 🧩 最終目標のプレビュー\n\n今回のレクチャーを通じて、**Todo-Listアプリケーション**をゼロから完成させていきます。\n\n![Todo Template]( )\n\nさあ、始めてみましょう！',
  },
  {
    id: 'intro-what-is-react',
    section: 1,
    order: 1,
    title: 'React.jsとは何か？',
    type: 0,
    exp: 10,
    time: 7,
    content:
      '# ⚛️ React：UIを作る強力なツール\n\n**React**は、ユーザーインターフェース（UI）を作るための**JavaScriptライブラリ**です。Meta（旧Facebook）によって開発され、現在最も愛されているフロントエンド技術の一つです。\n\n---\n\n### 💡 なぜReactなのですか？\n\nWebページでボタンをクリックしたとき、画面全体がリロードされず、**必要な部分だけ**がスムーズに更新される体験をしたことがありますか？Reactは、このような動的な画面を**効率的に実装**するために誕生しました。\n\n### 📦 ライブラ리 vs フレームワーク\n\nReactはフレームワークではなく**ライブラリ**です。\n\n> すべての規則を強要するのではなく、開発者が中身を**自由に選択して**使用できることが最大の魅力です。',
  },
  {
    id: 'intro-spa-concept',
    section: 1,
    order: 2,
    title: 'ページ全体が変わらない理由 (SPA)',
    type: 0,
    exp: 10,
    time: 5,
    content:
      '# 🪄 ページが変わらない魔法、SPA\n\nReactは**SPA（Single Page Application）**方式で動作します。画面全体が「チカチカ」することなく、内容がスムーズに切り替わる秘密がここにあります。\n\n---\n\n### 📌 SPAとは何でしょうか？\n\n伝統的なWebサイトは、別のページに移動するたびにサーバーから画面全体を読み込み直します。しかし、SPAは：\n- たった**一つのページ(HTML)**だけをロードします。\n- その後はJavaScriptを利用して、**必要なデータだけ**を入れ替えます。\n\n> **💡 SPAのメリット**\n> 1. 画面のちらつきがなく、**アプリのような滑らかな体験**を提供します。\n> 2. サーバーとの通信量が減り、**速度が非常に速い**です。',
  },
  {
    id: 'quiz-react-definition',
    section: 1,
    order: 3,
    title: 'Reactの定義クイズ',
    type: 2,
    question:
      'ReactはJavaScriptのどのような種類のツールですか？ (ㄹㅇㅂㄹㄹ / 💡 ヒント：日本語で5文字)',
    correctAnswer: 'ライブラリ',
    explanation: 'ReactはUI構築のための専用機能を提供する「ライブラリ」です。',
    exp: 20,
    time: 3,
  },
  {
    id: 'intro-why-react',
    section: 1,
    order: 4,
    title: 'なぜReactを学ぶべきなのでしょうか？',
    type: 0,
    exp: 10,
    time: 6,
    content:
      '# 🌟 Reactを学ぶべき3つの理由\n\n世界中の多くの開発チームがReactを選択するのには、明確な理由があります。\n\n1. **コンポーネントの再利用** \n 良いUIを一度作れば、あちこちで繰り返し使うことができます。\n\n2. **圧倒的なエコシステム** \n 分からないことがあった時に調べる資料や、一緒に使えるツールが世界で最も多いです。\n\n3. **宣言型プログラミング** \n 画面の状態が*どのように*変わるかをいちいち命令せず、*何を*見せるかだけ決めれば、Reactが自動的に描画してくれます。\n\n> Reactを学ぶことは、単に文法を覚えることではなく、**現代的な開発者の思考プロセス**を身につける過程です。',
  },
  {
    id: 'app-creation-vite',
    section: 1,
    order: 5,
    title: 'アプリ作成 - Vite',
    type: 0,
    exp: 15,
    time: 8,
    content:
      '# 🛠️ 実践！最初のReactアプリ作成\n\n実際にReactプロジェクトを作成してみましょう。最も高速で現代的なツールである**Vite**を使用します。\n\n---\n\n### ⌨️ ターミナルでコマンドを順番に入力してください\n\n1️⃣ **プロジェクト生成**\n```bash\nnpm create vite@latest my-todo-app -- --template react\n```\n\n2️⃣ **プロジェクトフォルダへ移動＆インストール**\n```bash\ncd my-todo-app\nnpm install\n```\n\n3️⃣ **開発サーバー起動**\n```bash\nnpm run dev\n```\n\nサーバーが起動したら、ターミナルに表示されたアドレスをブラウザに入力してみてください。あなたの最初のReact画面が表示されます！`http://localhost:5173`',
  },
  {
    id: 'section1-summary',
    section: 1,
    order: 6,
    title: 'セクション1まとめ：Reactの全体像',
    type: 0,
    exp: 5,
    time: 4,
    content:
      '# 🏁 セクション1まとめ\n\n今回のセクションでは、Reactを始める前に必ず知っておくべき**全体像**を確認しました。\n\n---\n\n### ✅ このセクションで学んだこと\n\n- ReactはUIを作る**ライブラリ**である。\n- **SPA**方式を通じて滑らかなユーザー体験を提供する。\n- **Vite**を利用して、高速で現代的な開発環境を構築した。\n\n---\n\nこれで準備運動は終わりです。\n\n次のセクションからは、Reactの核心である**コンポーネントとJSX**を実際に触りながら、コードを書いていきましょう！ 🚀',
  },
  {
    id: 'basic-understanding-components',
    section: 2,
    order: 0,
    title: 'コンポーネント(Components)を理解する',
    type: 0,
    exp: 10,
    time: 6,
    content:
      '# 🧱 UIの最小単位、コンポーネント(Component)\n\n**コンポーネント**は、UIを構成する**独立した再利用可能なブロック**です。まるでレゴブロックを組み立てるようにWebサイトを作ることができます。\n\n---\n\n### 💻 Reactコンポーネントは、実は「関数」です\n\n最も基本的な形のコンポーネントは、**JavaScriptの関数**です。\n\n```jsx\nfunction Welcome() {\n  return <h1>こんにちは、React！</h1>;\n}\n```\n\nこのように作ったコンポーネントは、まるでHTMLタグのように使用できます。\n\n```jsx\n<Welcome />\n```\n\n---\n\n### 🧠 コンポーネントを関数として理解しましょう\n\n> 📌 **入力を受け取って → 画面(UI)を返す関数**\n\n- 入力値: props (データ)\n- 戻り値: 画面に表示されるJSX\n\nつまり、Reactでは**「関数で画面を作る」**と考えても大丈夫です。\n\n> ⚠️ **注意**\n>\n> コンポーネント名の最初の文字は、必ず**大文字**でなければなりません。小文字で始めると、Reactはそれを通常のHTMLタグとして認識してしまいます。',
  },
  {
    id: 'basic-jsx-syntax',
    section: 2,
    order: 1,
    title: 'JSX：JavaScriptの中のHTML',
    type: 0,
    exp: 10,
    time: 10,
    content:
      "# 🏗️ JavaScript拡張構文、JSX\n\n**JSX**は、**JavaScriptの中でHTMLのように見える構文**を使用できるようにする、Reactの核心的な構文です。\n\n---\n\n### ❓ なぜJSXが必要なのでしょうか？\n\nJSXがなければ、私たちは一つずつ複雑なJavaScript関数を呼び出さなければなりません。\n\n```js\n// JSXなしで記述する場合\nReact.createElement('h1', null, 'こんにちは');\n```\n\n---\n\n### 🔀 JavaScriptの値を混ぜて使う\n\nJSXの強力な点は、JavaScriptの変数を**波括弧**`{ }`を使って画面にそのまま表示できることです。\n\n```jsx\nfunction App() {\n  const name = '太郎';\n  const age = 20;\n\n  return <h2>{name}さんは{age}歳です。</h2>;\n}\n```\n\n**🖥️ ブラウザの出力結果:**\n> **太郎さんは20歳です。**\n\nこのように、波括弧の中のJavaScript変数が実際のデータに置換されて画面に現れます。",
  },
  {
    id: 'basic-jsx-rules',
    section: 2,
    order: 2,
    title: 'JSX記述時の必須ルール',
    type: 0,
    exp: 15,
    time: 8,
    content:
      '# 📏 JSXを使用する際の3つの約束\n\nJSXはHTMLと似ていますが、実際にはJavaScriptであるため、いくつかの厳格なルールがあります。\n\n### 1️⃣ 必ず一つのタグで囲む\n二つ以上のタグを並べる時は、必ず親タグで囲まなければなりません。名前のないタグである`<> ... </>` **Fragment**を使用すると、不要なdivを減らすことができます。\n\n```jsx\nreturn (\n  <>\n    <h1>タイトル</h1>\n    <p>内容</p>\n  </>\n);\n```\n\n### 2️⃣ classではなくclassName\nJavaScriptにおいて`class`という単語はすでに予約語（特別な意味を持つ言葉）です。そのため、CSSクラスを指定する時は**className**を使用します。\n\n```jsx\n<div className="header">メニュー</div>\n```\n\n### 3️⃣ すべてのタグを閉じる必要があります\n\n ```jsx\n<img> \n <input>\n``` \n\n 上記の二つのタグのように、HTMLでは閉じなかったタグも、JSXでは必ず`<img />`のように**自己完結(Self-closing)**させるか、閉じる必要があります。',
  },
  {
    id: 'quiz-jsx-definition',
    section: 2,
    order: 3,
    title: 'JSXの概念クイズ',
    type: 1,
    exp: 20,
    time: 3,
    question: '次のうち、JSXに関する説明として最も適切なものはどれですか？',
    options: [
      'HTMLファイルを代替するための新しい言語',
      'ブラウザで直接実行されるテンプレート言語',
      'JavaScriptの中でHTMLのように見える構文を使用できるようにする構文',
      'React専用のスタイリング構文',
    ],
    correctAnswerIndex: 2,
    explanation:
      'JSXはJavaScript XMLの略称で、コードの可読性を高めてくれるJavaScriptの拡張構文です。',
  },
  {
    id: 'quiz-jsx-expression',
    section: 2,
    order: 4,
    title: 'JSX式クイズ',
    type: 1,
    exp: 20,
    time: 3,
    question:
      'JSXの中でJavaScriptの変数を出力する際に使用する正しい方法は何ですか？',
    options: [
      '<p>name</p>',
      '<p>${name}</p>',
      '<p>{name}</p>',
      '<p>(name)</p>',
    ],
    correctAnswerIndex: 2,
    explanation:
      'JSXの内部でJavaScriptの変数や式を使用する際は、必ず波括弧 { } を使用しなければなりません。',
  },
  {
    id: 'quiz-jsx-statement-vs-expression',
    section: 2,
    order: 5,
    title: 'JSX構文理解クイズ',
    type: 1,
    exp: 25,
    time: 4,
    question: '次のうち、JSXの中で**直接使用できないもの**はどれですか？',
    options: [
      '三項演算子 (condition ? A : B)',
      '数値計算 (1 + 2)',
      'if文',
      '変数の値の出力',
    ],
    correctAnswerIndex: 2,
    explanation:
      'JSXの波括弧には、結果値が即座に返される「式(Expression)」だけが使用できます。if文は「文(Statement)」であるため、波括弧の内部で直接使用することはできません。',
  },
  {
    id: 'section2-summary',
    section: 2,
    order: 6,
    title: 'セクション2まとめ：コンポーネントとJSX',
    type: 0,
    exp: 5,
    time: 4,
    content:
      '# 🏁 セクション2のまとめ\n\nお疲れ様でした！これで皆さんはReactアプリの基礎となる骨組みを作る方法を学びました。\n\n---\n\n### ✅ 核心的なまとめ\n- **コンポーネント**はUIの最小単位であり、名前は**大文字**から始める。\n- **JSX**はJavaScriptとHTMLの融合である。\n- JSXは必ず**一つの親タグ**で囲む必要があり、**className**を使用する。\n\n---\n\n骨組みを作ったので、次はここに**「生命力（データの変化）」**を吹き込む番です。\n次のセクション、**State**でお会いしましょう！ 🚀',
  },
  {
    id: 'state-what-is-state',
    section: 3,
    order: 0,
    title: 'State(状態)とは何か？',
    type: 0,
    exp: 15,
    time: 8,
    content:
      '# 🧠 コンポーネントの記憶装置、State\n\nReactにおける**State**は、コンポーネントが内部的に**記憶している値**です。\nユーザーとのやり取りに応じて、いつでも**変更される可能性のあるデータ**を意味します。\n\n---\n\n### ❓ なぜ普通の変数では画面が変わらないのでしょうか？\n\n```jsx\nlet count = 0;\n\nfunction Counter() {\n  const increase = () => {\n    count = count + 1;\n    console.log(count); // 値は増えますが、画面はそのまま！\n  };\n\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={increase}>増加</button>\n    </div>\n  );\n}\n```\n\n普通の変数は、値が変わっても**Reactが画面を書き換えるべきだということに気づきません。**\nつまり、コンポーネントを**レン더링(再描画)**しないからです。\n\n---\n\n### ✅ だからStateが必要です\n\nStateは単なるデータではなく、**「値が変わったから画面を書き換えて（再レンダリングして）！」**とReactに送る合図です。\n\n> 📌 **ここで言う「レンダリング（Rendering）」とは？**\n> \n> コンポーネント関数が再び呼び出され、その結果として変更されたデータが反映された**新しい画面（UI）がブラウザに描画される過程**を指します。\n\nStateが変更されると、Reactは自動的にこのレンダリング過程を実行し、ユーザーが変更された値を確認できるようにします。',
  },
  {
    id: 'state-counter-practice',
    section: 3,
    order: 1,
    title: 'カウンターアプリ実習：useStateの使い方',
    type: 0,
    exp: 25,
    time: 10,
    content:
      "# 🛠️ useStateで数字を変える\n\n実際に画面を更新するコードを書いてみましょう。Reactが提供する `useState` というツール（フック）を使用します。\n\n```jsx\nimport { useState } from 'react'; // 👈 必ずインポートしてください！\n\nfunction Counter() {\n  // [現在の値, 更新関数] = useState(初期値);\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>現在の数字: {count}</p>\n      <button onClick={() => setCount(count + 1)}>増加</button>\n    </div>\n  );\n}\n```\n\n**🖥️ ブラウザの出力結果:**\n> 現在の数字: 0  \n> [増加ボタン]\n\n**🔄 ボタンを押すと起こること:**\n1. `setCount` 関数が実行され、`count` の値が変更されます。\n2. Reactが「おや？ countが変わったな」と検知します。\n3. **コンポーネントを再実行（再レンダリング）** して、画面に新しい数字を描画します。",
  },
  {
    id: 'quiz-state-description',
    section: 3,
    order: 2,
    title: 'State概念理解クイズ',
    type: 2,
    question:
      'コンポーネントが記憶しており、値が変更されると画面が再レンダリングされるようになるReactのデータは何ですか？',
    correctAnswer: 'State',
    explanation:
      'Stateはコンポーネント内部で変化する値を管理し、変更時にレンダリングをトリガーします。',
    exp: 20,
    time: 3,
  },
  {
    id: 'quiz-state-update-code',
    section: 3,
    order: 3,
    title: 'State変更コードクイズ',
    type: 2,
    question:
      '次の状態が宣言されているとき、numberの値を5に変更する関数呼び出しコードを記述してください。\n\nconst [number, setNumber] = useState(0);',
    correctAnswer: 'setNumber(5)',
    explanation:
      '状態更新関数であるsetNumberに、設定したい値を引数として渡します。',
    exp: 30,
    time: 4,
  },
  {
    id: 'quiz-state-change-effect',
    section: 3,
    order: 4,
    title: 'State変更結果クイズ',
    type: 1,
    question:
      'Stateの値が変更されると、Reactコンポーネントにはどのようなことが起こりますか？',
    options: [
      '何も起こらない',
      'ページ全体がリロードされる',
      '該当するコンポーネントが再レンダリングされる',
      'エラーが発生する',
    ],
    correctAnswerIndex: 2,
    explanation:
      'ReactはStateの変化を検知して、該当するコンポーネントを再レンダリングします。',
    exp: 20,
    time: 3,
  },
  {
    id: 'state-common-mistakes',
    section: 3,
    order: 5,
    title: '+ Stateでよくある間違い',
    type: 0,
    exp: 20,
    time: 15,
    content:
      '# ⚠️ 初心者がやりがちなStateのミス\n\n### 1️⃣ Stateを直接修正しないでください\n```jsx\n// ❌ 絶対にダメです！\ncount = count + 1;\n\n// ✅ 常にこのようにしてください\nsetCount(count + 1);\n```\n直接修正すると、Reactは値が変わったことに気づかず、画面をそのままにしてしまいます。\n\n### 2️⃣ Stateは「次のレンダリング」で反映されます\n```jsx\nsetCount(count + 1);\nconsole.log(count); // 🧐 まだ前の値が表示されるはずです！\n```\n`setCount`を実行した直後に値が変わるのではなく、**再レンダリングが完了して初めて**新しい値が適用されます。\n\n### 3️⃣ すべての値をStateにしないでください\n値が変わったときに**画面(UI)も一緒に変わる必要がある値**だけをStateにしてください。そうでない値は、通常の変数で十分です。',
  },
  {
    id: 'section3-summary',
    section: 3,
    order: 6,
    title: 'セクション3まとめ：Stateを一気に整理',
    type: 0,
    exp: 15,
    time: 6,
    content:
      '# 🏁 セクション3のまとめ\n\nおめでとうございます！これでReactの最も重要な心臓部である**State**をマスターしました。\n\n---\n\n### ✅ 核心的なまとめ\n- **State**はコンポーネントの記憶装置である。\n- 状態の変更は必ず**専用の関数(setter)**を使用しなければならない。\n- 状態が変わると**再レンダリング**が起こる。\n\n---\n\nこれで自分のコンポーネントがデータを持てるようになりました。\nでは、このデータを**他のコンポーネントに伝える**にはどうすればいいでしょうか？\n次のセクション、**Props**で確認しましょう！ 🎁',
  },
  {
    id: 'props-passing-data',
    section: 4,
    order: 0,
    title: 'Propsでデータを渡す',
    type: 0,
    exp: 20,
    time: 12,
    content:
      '# 🎁 コンポーネントへの贈り物、Props\n\nReactにおける**Props**は、親コンポーネントが子コンポーネントに渡す**データ**です。\n\n> 簡単に言うと、親から子に送られる**「読み取り専用」の値**です。\n\n---\n\n### ❓ なぜPropsが必要なのでしょうか？\n\nWebサイトは数多くのコンポーネントの組み合わせで作られます。\n\nこの時、コンポーネント同士で情報をやり取りすることで画面が完成しますが、その通り道の役割を果たすのがPropsです。\n\n---\n\n### 👨‍👩‍👧 親 → 子の構造を理解する\n\n```jsx\n// 親コンポーネント (App.jsx)\nfunction App() {\n  return <MyButton text="保存する" />;\n}\n\n// 子コンポーネント (MyButton.jsx)\nfunction MyButton(props) {\n  return <button>{props.text}</button>;\n}\n```\n\n**🖥️ ブラウザの出力結果:**\n> [保存する]\n\n `props.text`：親(App)が送った「保存する」という値を、子(MyButton)が受け取って使用します。\n 子コンポーネントはこの値を**使うことだけができ、直接修正することはできません。**',
  },
  {
    id: 'props-destructuring-intro',
    section: 4,
    order: 1,
    title: 'Propsをもっと簡単に受け取る方法',
    type: 0,
    exp: 10,
    time: 10,
    content:
      '# ✨ よりスッキリしたコード、分割代入\n\n毎回 `props.ooo` と書く代わりに、JavaScriptの**分割代入(Destructuring assignment)** 構文を使うと、コードがより簡潔になります。\n\n---\n\n### 🔄 どのように変わりますか？\n\n**従来の方法:**\n```jsx\nfunction MyButton(props) {\n  return <button>{props.text}</button>;\n}\n```\n\n**分割代入の方法:**\n```jsx\nfunction MyButton({ text }) {\n  return <button>{text}</button>;\n}\n```\n\n- 関数の引数の部分に直接 `{ text }` と記述します。\n- `props.text` と全く同じように動作しますが、読みやすさが格段に向上します。\n- 受け取るPropsが複数ある場合に、特に威力を発揮する方法です。',
  },
  {
    id: 'props-pass-setstate',
    section: 4,
    order: 2,
    title: '関数もPropsとして渡せます',
    type: 0,
    exp: 20,
    time: 15,
    content:
      '# ⚡ 親の関数を子に渡す\n\nPropsには文字列や数字だけでなく、**関数も渡すことができます。**\n\n親が持っているStateを子の側から変更したい時に、この方法を使用します。\n\n---\n\n### ⌨️ 例で見てみましょう\n\n```jsx\n// 親コンポーネント\nfunction App() {\n  const [count, setCount] = useState(0);\n  \n  return <CounterButton onIncrease={() => setCount(count + 1)} />;\n}\n\n// 子コンポーネント\nfunction CounterButton({ onIncrease }) {\n  return <button onClick={onIncrease}>増加</button>;\n}\n```\n\n- **データ管理**: 親(App)が担当\n- **アクション(クリック)**: 子(CounterButton)が担当\n- 子でボタンを押すと、親から渡された関数が実行され、親のStateが更新されます！',
  },
  {
    id: 'props-common-mistakes',
    section: 4,
    order: 3,
    title: '+ Props使用時の注意点',
    type: 0,
    exp: 10,
    time: 8,
    content:
      '# ⚠️ Props使用時によくある間違い\n\n### 1️⃣ Propsを直接修正しないでください\n```jsx\nfunction Child(props) {\n  props.text = "変更"; // ❌ エラー発生！\n  return <div>{props.text}</div>;\n}\n```\nPropsは親からの「贈り物」のようなもので、子が勝手に変えることはできません。値を変えたい場合は、親に依頼（関数の実行）をする必要があります。\n\n### 2️⃣ PropsとStateを区別する\n- **コンポーネント自身**が値を作って管理するなら？ 👉 **State**\n- **親から**値を受け取って表示するだけなら？ 👉 **Props**\n\n### 3️⃣ 文字列以外の値は波括弧 `{ }` を使用\n```jsx\n<MyButton text="保存" /> // 文字列はクォーテーション\n<Counter count={10} /> // 数値、変数、関数などは波括弧\n```',
  },
  {
    id: 'quiz-props-definition',
    section: 4,
    order: 4,
    title: 'Propsの定義クイズ',
    type: 1,
    question: '次のうち、Propsの正しい説明はどれですか？',
    options: [
      'コンポーネントが自身で管理する状態値',
      '親コンポーネントが子に渡す読み取り専用のデータ',
      '子コンポーネントが直接修正できる値',
      'HTMLタグの属性を意味するReact専用の構文',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Propsは上位（親）コンポーネントが下位（子）コンポーネントに伝達する読み取り専用のデータです。',
    exp: 20,
    time: 5,
  },
  {
    id: 'quiz-props-vs-state',
    section: 4,
    order: 5,
    title: 'PropsとStateを区별する',
    type: 2,
    question:
      'コンポーネントが直接管理し、変更時にレンダリングを誘発する値は何ですか？ (Props または State)',
    correctAnswer: 'State',
    explanation:
      'Stateはコンポーネント内部の状態であり、Propsは外部から受け取る設定値です。',
    exp: 20,
    time: 5,
  },
  {
    id: 'props-summary-review',
    section: 4,
    order: 6,
    title: 'Propsまとめ＆復習',
    type: 0,
    exp: 15,
    time: 10,
    content:
      '# 🏁 セクション4のまとめ\n\nこれで皆さんはコンポーネント同士で対話する方法を学びました！\n\n---\n\n### ✅ 核心的なまとめ\n- **Props**は親が子に与える**データ**である。\n- 子はPropsを**修正できない**（読み取り専用）。\n- **関数**もPropsとして渡すことで、子が親の状態を変更できるようにできる。\n- `{ text }` のように**分割代入**を使うとコードがスッキリする。\n\n---\n\n親から関数を受け取る方法まで分かったので、次はその関数を「いつ」実行するかを決める番です。\nユーザーのクリックや入力に反応する方法、次のセクション**イベント(Event)**でお会いしましょう！ ⚡',
  },
  {
    id: 'event-what-is-event',
    section: 5,
    order: 0,
    title: 'Reactにおけるイベント(Event)とは？',
    type: 0,
    exp: 15,
    time: 8,
    content:
      '# ⚡ ユーザーとの対話、イベント(Event)\n\nReactにおける**イベント**とは、ユーザーが画面とやり取りする際に発生するすべての行動を意味します。\n\n### ❓ なぜイベントが重要なのですか？\n\nユーザーがボタンを押したり文字を入力したりしたときに画面を反応させるには、必ずイベントをキャッチする必要があります。\n\n> **ユーザーの行動** → イベント発生 → 関数の実行 → **Stateの変更** → 画面の更新\n\nこの流れの出発点が、まさにイベントです。\n\n---\n\n### 📌 Reactイベントの特徴\n\n- HTMLイベントと似ていますが、**キャメルケース(camelCase)** を使用します。\n- 文字列ではなく、**関数そのもの**を渡します。\n\n```jsx\n<button onClick={handleClick}>クリック</button>\n```',
  },
  {
    id: 'event-html-vs-react',
    section: 5,
    order: 1,
    title: 'HTMLイベントとReactイベントの違い',
    type: 0,
    exp: 15,
    time: 7,
    content:
      '# 🆚 HTML vs React イベント\n\nReactのイベントはHTMLと似ているように見えますが、記述方法が厳密に異なります。\n\n### ❌ HTML方式 (文字列を渡す)\n```html\n<button onclick="handleClick()">クリック</button>\n```\n\n### ✅ React方式 (関数を渡す)\n```jsx\n<button onClick={handleClick}>クリック</button>\n```\n\n---\n\n### 🧠 主な違い\n\n **命名規則** \n```jsx\n // 大文字に注意！\n onclick ❌\n onClick ✅\n```\n\n **渡し方** \n `"onClick"` のようにクォーテーションの中にコードを書くのではなく、 `{onClick}` のように波括弧の中に **関数名** を入れます。\n\n> Reactは「このボタンがクリックされたら、**この関数を後で実行してね**」と予約する方式です。',
  },
  {
    id: 'event-handler-function',
    section: 5,
    order: 2,
    title: 'イベントハンドラー関数を作る',
    type: 0,
    exp: 20,
    time: 10,
    content:
      "# 🛠️ イベントハンドラー(Event Handler)\n\nイベントが発生したときに実行される関数を **イベントハンドラー** と呼びます。\n\n```jsx\nfunction App() {\n  const handleClick = () => {\n    alert('ボタンがクリックされました！');\n  };\n  return <button onClick={handleClick}>アラートを表示</button>;\n}\n```\n\n**🖥️ ブラウザの出力結果:**\n> [アラートを表示] ボタン\n> (クリック時にブラウザのアラート窓が登場)\n\n---\n\n### 💡 関数名の付け方のヒント\nイベントハンドラーの名前は、\n\n```jsx\n handleClick\n onChangeName\n handleSubmit \n```\n\n上記のように、**どのような動作をするのか**を明確にするのが慣習です。",
  },
  {
    id: 'event-function-vs-execution',
    section: 5,
    order: 3,
    title: '関数を渡す？ 実行する？',
    type: 0,
    exp: 20,
    time: 10,
    content:
      '# ⚠️ 最も多い間違い：関数の呼び出し禁止！\n\nReactのイベントを記述する際、最も頻繁に起こるミスです。\n\n### ❌ 間違ったコード\n```jsx\n<button onClick={handleClick()}>クリック</button>\n```\nこれはクリックしたときに実行されるのではなく、**画面が描画された瞬間に関数が即座に実行**されてしまいます。\n\n### ✅ 正しいコード\n```jsx\n<button onClick={handleClick}>クリック</button>\n```\n関数の後ろに `()` を付けずに、名前だけを渡す必要があります。\n\n---\n\n### 🧠 覚え方のコツ\n\n> handleClick : 「後でクリックされたら実行して！」(**予約**) \n\n> handleClick() : 「今すぐ実行して！」 (**即時実行**)',
  },
  {
    id: 'event-state-update',
    section: 5,
    order: 4,
    title: 'イベントでStateを更新する',
    type: 0,
    exp: 25,
    time: 12,
    content:
      '# 🔄 イベントとStateの出会い\n\nイベントの真の目的は、ユーザーの入力を受け取って **Stateを書き換えること** です。\n\n```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  const handleIncrease = () => {\n    setCount(count + 1); \n  };\n  return (\n    <div>\n      <p>値: {count}</p>\n      <button onClick={handleIncrease}>増やす</button>\n    </div>\n  );\n}\n```\n\n**🖥️ ブラウザの出力結果:**\n> 値: 0  \n> [増やす] クリック時に数字が1ずつ増加',
  },
  {
    id: 'quiz-event-camelcase',
    section: 5,
    order: 5,
    title: 'Reactイベント構文クイズ',
    type: 1,
    exp: 20,
    time: 5,
    question:
      'Reactでボタンのクリックイベントを正しく記述しているものはどれですか？',
    options: [
      'onclick="handleClick()"',
      'onClick={handleClick}',
      'onClick="handleClick"',
      'onclick={handleClick()}',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Reactのイベントはキャメルケース(onClick)を使用し、波括弧の中に関数名を渡します。',
  },
  {
    id: 'quiz-event-short-answer',
    section: 5,
    order: 6,
    title: 'イベント概念記述クイズ',
    type: 2,
    exp: 20,
    time: 5,
    question:
      'Reactのイベントハンドラーに渡すべきなのは、関数の「実行結果」ですか、それとも「関数そのもの」ですか？',
    correctAnswer: '関数',
    explanation:
      'イベントが発生したときに初めて実行されるように、関数そのものを渡す必要があります。',
  },
  {
    id: 'event-summary-review',
    section: 5,
    order: 7,
    title: 'セクション5まとめ：イベントの整理',
    type: 0,
    exp: 15,
    time: 7,
    content:
      '# 🏁 セクション5のまとめ\n\nこれで皆さんは、ユーザーのクリックに反応する生き生きとしたコンポーネントを作れるようになりました！\n\n### ✅ 核心的なまとめ\n- Reactイベントは **camelCase** を使用する `onClick` \n- イベントハンドラーには **関数名** だけを渡す `onClick={handleClick}` \n- イベントを通じて **Stateを変更** すると画面が再描画される。\n\n---\n\n次のセクションでは、複数のデータを一度に扱う方法と **不変性(Immutability)** について学びます。\n\nいよいよ本格的にデータを操作する時間がやってきました！ 🚀',
  },
  {
    id: 'list-intro',
    section: 6,
    order: 0,
    title: 'リストとオブジェクトの基礎理解',
    type: 0,
    exp: 10,
    time: 5,
    content:
      "# 📦 データをまとめる方法：配列とオブジェクト\n\nReactアプリで扱うデータのほとんどは、**配列(Array/List)** と **オブジェクト(Object)** の形をしています。\n\n### 1️⃣ 何が違うのでしょうか？\n- **配列(List)**：[りんご, バナナ, いちご] のように **順番** があるデータの集まりです。\n`[りんご, バナナ, いちご]`\n- **オブジェクト(Object)**：{ 名前: '太郎', 年齢: 20 } のように **意味(Key)** があるデータの集まりです。\n`{ 名前: '太郎', 年齢: 20 }`\n\n---\n\n### 2️⃣ Reactでなぜ重要なのでしょうか？\n- **配列**：ToDoリストの項目のように、**繰り返される画面**を作る時に使用します。\n- **オブジェクト**：一人のユーザー情報のように、**複合的なデータ**を管理する時に使用します。",
  },
  {
    id: 'list-render',
    section: 6,
    order: 1,
    title: '配列データを画面に繰り返しレンダリングする',
    type: 0,
    exp: 15,
    time: 12,
    content:
      '# 🔄 繰り返し処理のリバイバル：map()\n\n配列を画面に表示する時は、JavaScriptの **`map()`** 関数を使用します。\n\n### ✅ 例 \n```jsx\n{fruits.map((fruit, index) => (\n  <li key={index}>{fruit}</li>\n))}\n```\n\n---\n\n### 📌 なぜ key 属性が必須なのですか？\n\nReactは **key** を見て、「あ、1番目の項目が修正されたな」「2番目の項目が削除されたな」を判断します。\n\n **💡 ヒント**\n> 今は練習なので **index** を key に使っていますが、実際のサービスではデータの **固有ID(例: id: 101)** を key に使うのが最も安全です。\n> **index** を key に使うと、リストの順番が変わった時に React が混乱し、バグの原因になることがあります！',
  },
  {
    id: 'list-reference-concept',
    section: 6,
    order: 2,
    title: 'オブジェクトと配列：メモリ番地(参照)の秘密',
    type: 0,
    exp: 15,
    time: 10,
    content:
      "# 🔗 なぜ直接修正してはいけないのか？ (参照の理解)\n\nReactが State が変わったかどうかを確認する方法は、意外と単純です。**「以前の住所と今の住所が同じか？」** を比較します。\n\n### 1️⃣ プリミティブ変数 vs オブジェクト/配列\n- **プリミティブ変数(数値、文字列)**：値が変わると React がすぐに気づきます。\n- **オブジェクト/配列**：実際のデータではなく、データが保存されている **「メモリ番地(参照)」** を変数に持っています。\n\n### 2️⃣ Reactが変化に気づかない理由\n```javascript\nconst [user, setUser] = useState({ name: '太郎' });\n\nuser.name = '花子'; // ❌ データは変わりましたが、「住所(参照)」はそのままです。\nsetUser(user);      // 🧐 React: 「住所が同じだね？何も変わっていないな！」\n```\n\n\n\n### 💡 結論\nReactに更新を知らせるには、中身だけを変えるのではなく、**新しい住所(新しいオブジェクト)** を作って丸ごと入れ替えてあげる必要があります。その時に必要な道具が **スプレッド構文** です。",
  },
  {
    id: 'state-array-copy',
    section: 6,
    order: 3,
    title: 'スプレッド構文(...)：新しい参照を作る',
    type: 0,
    exp: 15,
    time: 12,
    content:
      "# ✨ コピーして新しく作る：スプレッド構文(...)\n\n「参照の問題」を解決する最もスマートな方法です。既存のデータをそのままコピーし、**新しい住所を持つ複製本**を作るのです。\n\n### 🔹 配列の更新パターン\n```jsx\nconst [todos, setTodos] = useState(['牛乳']);\n\n// [...既存の配列, 新しい項目] -> 既存のものを展開して新しい配列に格納！\nsetTodos([...todos, '勉強']); \n```\n\n### 🔹 オブジェクトの更新パターン\n```jsx\nconst [user, setUser] = useState({ name: '太郎', age: 20 });\n\n// { ...既存のオブジェクト, 修正するプロパティ } -> 残りはコピーして age だけ上書き！\nsetUser({ ...user, age: 21 });\n```\n\n**🖥️ ブラウザの結果:**\n> メモリ番地(参照)が変わったため、React が即座に検知して画面を **再レンダリング** します。",
  },
  {
    id: 'state-immutability',
    section: 6,
    order: 4,
    title: '不変性(Immutable)と状態管理',
    type: 0,
    exp: 15,
    time: 8,
    content:
      '# 🛡️ データを守る原則、不変性\n\n**不変性(Immutability)** とは、状態を直接変更しない原則を指します。\n\n### ❓ 直接修正してはいけない理由\nReactは以前のデータと新しいデータの **メモリ番地(参照)** を比較します。\n住所が変わらなければ、データが変わったと判断されず、画面が再描画されません。\n\n---\n\n### 🛠️ 不変性を守るツール集\n\nReactの状態更新時、以下のツールは元の配列を操作せず、**新しい配列を返す**ため、安心して使用できます。\n\n**1️⃣ スプレッド構文**\n```javascript\n[...] // 配列のコピーと項目の追加\n{...} // オブジェクトのコピーとプロパティの修正\n```\n\n**2️⃣ 新しいコピーを返す主なメソッド**\n```javascript\n.map()     // すべての要素を加工して新しい配列を生成\n.filter()  // 条件に合う要素だけを取り出して新しい配列を生成\n.concat()  // 複数の配列を結合して新しい配列を生成\n.slice()   // 配列の一部を切り出して新しい配列を生成\n\n// (最新の構文) 元の配列を変えないソートと逆順\n.toSorted()\n.toReversed()\n```\n\n---\n\n### ✅ 核心的なまとめ\n\n元のデータを直接変更する以下のメソッドは、\n\n```jsx\n push   // データの追加 \n splice // データの追加 / 削除 \n sort   // データのソート \n```\n\nReactでは一旦忘れてください！\n常に上記のツールを活用して **新しいコピー** を作成し、 **setState** に渡すのが React の定石です。',
  },
  {
    id: 'quiz-list-map',
    section: 6,
    order: 5,
    title: '配列レンダリングクイズ',
    type: 2,
    exp: 10,
    time: 3,
    question:
      'Reactで配列を画面に繰り返しレンダリングする際に使用する JavaScript のメソッド名を書いてください。',
    correctAnswer: 'map',
    explanation:
      'map() 関数は、配列の各要素をループしながら JSX 要素に変換する役割を果たします。',
  },
  {
    id: 'quiz-immutability-reason',
    section: 6,
    order: 6,
    title: '不変性の原理クイズ',
    type: 1,
    exp: 20,
    time: 5,
    question:
      'オブジェクトや配列を直接修正した際、React が画面を再描画しない理由は何ですか？',
    options: [
      'JavaScript エンジンにエラーが発生するため',
      'React は値ではなくメモリ番地(参照)の変化を検知するため',
      '直接修正するとデータが削除されるため',
      'React がオブジェクトをサポートしていないため',
    ],
    correctAnswerIndex: 1,
    explanation:
      'React は以前の状態と新しい状態の参照（住所）が異なる時のみアップデートを実行します。',
  },
  {
    id: 'list-summary-review',
    section: 6,
    order: 7,
    title: 'セクション 6 のまとめ：リストと不変性',
    type: 0,
    exp: 20,
    time: 7,
    content:
      '# 🏁 セクション 6 のまとめ\n\nReact開発者として一生守るべき **「不変性」** の基礎をマスターしました！\n\n### ✅ 核心的なポイント\n- **map()** でリストを描画し、 **key** を必ず付与しよう。\n- オブジェクト/配列は **メモリ番地(参照)** を持っている。\n- **スプレッド(...)** 構文で常に **新しい住所** を持つコピーを作成して State を更新しよう。\n\n---\n\n複数のデータを扱う方法まで習得しました。\nデータの表示方法を学んだので、次はユーザーからデータを **「入力」** してもらう方法を学ぶ番です。\nToDoリストの核心機能！次のセクション **セクション 7: フォーム(Form)イベント** でお会いしましょう！ 🚀',
  },
  {
    id: 'form-intro',
    section: 7,
    order: 0,
    title: 'なぜFormイベントを学ぶ必要があるのでしょうか？',
    type: 0,
    exp: 10,
    time: 5,
    content:
      '# 📝 入力の始まり、Formイベント\n\nこれまではボタンを押す単純なクリックだけを学びましたが、実際のサービスではユーザーの**文字入力**を受け取らなければならない場面が非常に多いです。\n\n### 📌 Form（フォーム）はこんな場所で使われます\n- Todo内容の入力\n- 検索ワードの入力\n- ログインおよび会員登録\n\n> **Todo-Listアプリの真の始まり**は、ボタンではなく **input + form** です。\n\nこのセクションでは、本格的なプロジェクト実習の前に必ず必要な「入力処理」の基礎を扱います。',
  },
  {
    id: 'form-controlled-input',
    section: 7,
    order: 1,
    title: 'inputの値はなぜStateで管理するのでしょうか？',
    type: 0,
    exp: 15,
    time: 8,
    content:
      "# 🕹️ 思い通りに操る「制御コンポーネント」\n\nReactにおいてinputは、単に文字が書かれる箱ではなく、**Stateと連結された装置**です。これを**制御コンポーネント(Controlled Component)**と呼びます。\n\n### ❓ なぜ入力ができないのでしょうか？\n```jsx\nconst [text, setText] = useState('');\n\n<input value={text} /> // valueが空の値('')に固定されている！\n```\nこのように書くだけでは、キーボードを叩いても文字が入力されません。`value`がStateにガッチリ固定されているからです。\n\n**解決策**: ユーザーが入力するたびにStateを更新する**イベント**がセットで必要になります！",
  },
  {
    id: 'form-onchange',
    section: 7,
    order: 2,
    title: 'onChangeイベントで入力値を処理する',
    type: 0,
    exp: 20,
    time: 12,
    content:
      "# 🔄 リアルタイムの入力検知：onChange\n\nユーザーが文字を一字ずつ入力するたびに実行されるイベントが **onChange** です。\n\n ### ✅ サンプルコードで確認 \n\n```jsx\nfunction InputExample() {\n  const [text, setText] = useState('');\n\n  const handleChange = (e) => {\n    setText(e.target.value); // 入力された文字をStateに保存！\n  };\n\n  return <input value={text} onChange={handleChange} />;\n}\n```\n\n**🖥️ ブラウザの流れ**\n キーボード入力 ➡️ onChange発生 ➡️ setText実行 ➡️ State変更 ➡️ 画面(input)の更新",
  },
  {
    id: 'form-event-object',
    section: 7,
    order: 3,
    title: 'イベントオブジェクト(e)とは何ですか？',
    type: 0,
    exp: 15,
    time: 7,
    content:
      '# 📦 情報の詰め合わせ、イベントオブジェクト(e)\n\nイベントハンドラー関数を作る際に引数として受け取る **e** (または **event**) は、発生したイベントに関するすべての情報が込められたオブジェクトです。\n\n```jsx\n e\n // または\nevent\n```  \n\n### 🔑 最も重要なプロパティ\n **`e.target.value`**：現在のinputボックスに入力されている**実際のテキスト**値です。\n\n今の段階では、これ一つだけ覚えておけば十分です！残りの複雑な情報は、後で必要になった時に調べれば大丈夫です。',
  },
  {
    id: 'form-submit',
    section: 7,
    order: 4,
    title: 'formとonSubmitイベント',
    type: 0,
    exp: 20,
    time: 10,
    content:
      '# 📨 まとめて送信：form & onSubmit\n\n通常、入力欄とボタンを一つのセットとしてデータを処理する際、**`<form>`** タグを使用します。\n\n### ❓ なぜわざわざformで囲むのですか？\n単に `<div>` でまとめてもいいですが、 `<form>` を使うとWebブラウザが提供する**「送信(Submit)機能」**をそのまま活用できるからです。\n\n### ✅ サンプルコードで確認\n```jsx\n<form onSubmit={handleTodoSubmit}>\n  <input />\n  <button type="submit">追加</button>\n</form>\n```\n\n---\n\n### 🧠 onSubmitはどうやって動作しますか？\n **1. 自動検知** \n> ボタンをクリックするか、入力欄で **Enterキー** を押すと、ブラウザが「あ、このフォームを送信しようとしているな」と判断します。\n **2. イベント発生** \n> その瞬間、 **`<form>`** タグに設定されている **onSubmit** 関数が実行されます。\n\n### 💡 ユーザーにとってのメリット\n- **メリット1**: 一つずつクリックイベントを設定しなくても、ボタン一つで送信できます。\n- **メリット2**: マウスを使わず **Enterキー** を押すだけでデータが送れるため、ユーザー体験(UX)が向上します。',
  },
  {
    id: 'form-prevent-default',
    section: 7,
    order: 5,
    title: 'event.preventDefault()はなぜ必要なのでしょうか？',
    type: 0,
    exp: 20,
    time: 10,
    content:
      '# 🛑 リロード停止！ preventDefault\n\nHTMLの **form** は、送信される瞬間にページを**リロード（更新）**してしまうという古い習性があります。\n\n### ❌ リロードの問題点\nReactアプリでリロードが起きると、せっかく積み上げてきた **Stateがすべて初期化** されてしまいます。\n\n### ✅ 解決方法\n```jsx\nconst handleSubmit = (e) => {\n  e.preventDefault(); // 「ブラウザよ、勝手にリロードしないで！」\n  // この後に実行したいロ직を記述\n};\n```\n\nReactプロジェクトのほぼすべてのForm送信関数では、このコードが**1行目**に入ると考えても過言ではありません。',
  },
  {
    id: 'form-submit-example',
    section: 7,
    order: 6,
    title: '入力 + 送信の全体フロー例',
    type: 0,
    exp: 25,
    time: 15,
    content:
      '# 🧩 全体まとめ：Form完成例\n\n入力から送信、初期化までの全過程を確認しましょう。\n\n```jsx\nfunction SimpleForm() {\n  const [text, setText] = useState(\'\');\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log("送信されたデータ:", text);\n    setText(\'\'); // 送信後に入力欄を空にする\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={text} onChange={(e) => setText(e.target.value)} />\n      <button type="submit">確認</button>\n    </form>\n  );\n}\n```\n\nこのコードの構造が、皆さんがこれから作る **Todo-Listの核心的な骨組み** になります！',
  },
  {
    id: 'quiz-form-onchange',
    section: 7,
    order: 7,
    title: 'inputイベントクイズ',
    type: 1,
    exp: 20,
    time: 3,
    question:
      'inputの値が変わるたびに実行され、Stateを更新するために使用するReactイベントは何ですか？',
    options: ['onClick', 'onSubmit', 'onChange', 'onInput'],
    correctAnswerIndex: 2,
  },
  {
    id: 'quiz-form-prevent',
    section: 7,
    order: 8,
    title: 'Formイベント記述クイズ',
    type: 2,
    exp: 25,
    time: 4,
    question:
      'form送信時にブラウザのデフォルト動作（リロード）を防ぐために呼び出すメソッドは何ですか？',
    correctAnswer: 'preventDefault',
    explanation:
      'e.preventDefault()を呼び出すことで、フォームの標準的なページ遷移を阻止できます。',
  },
  {
    id: 'form-summary-review',
    section: 7,
    order: 9,
    title: 'セクション7まとめ：Formイベントの整理',
    type: 0,
    exp: 15,
    time: 7,
    content:
      '# 🏁 セクション7のまとめ\n\nこれで皆さんはユーザーの声（入力値）を受け取る準備が整いました！\n\n### ✅ 核心的なまとめ\n- **制御コンポーネント**: inputの値(**value**)をStateと同期させる。\n- **onChange**: 入力するたびにStateをリアルタイムで変更する。\n- **preventDefault()**: フォーム送信時の予期せぬリロードを防ぐ。\n\n---\n\nお疲れ様でした！もう練習用サンプルはここまで。\n次のセクションでは、これまで学んだすべてのピースを一つに合わせて、**本物のTodo-Listプロジェクト**を開始します！ 💪🚀',
  },
  {
    id: 'todo-intro-structure',
    section: 8,
    order: 0,
    title: 'Todoプロジェクト開始＆構造の確認',
    type: 0,
    exp: 15,
    time: 7,
    content:
      '# 🛠️ 本物のサービスを作ってみましょう\n\nこのセクションでは、これまで学んだすべてのパズルのピースを組み合わせて、**Todo Listアプリ**を一から作ります。\n\n### 📁 プロジェクトの進め方\n- 最初は複雑にせず、**App.tsx一つから始めます**。\n- 機能がすべて動くようになったら、役割ごとに部品（コンポーネント）を分割します。\n\n---\n\n### 🧭 プロジェクトの完成構造プレビュー\n\n最終的に作成するアプリは、以下のような階層構造になります。\n\n```bash\nApp (メイン親)\n┃\n┣━ TodoForm (入力エリア)\n┃   ┗━ input + button\n┃\n┗━ TodoList (一覧エリア)\n    ┗━ TodoItem (個別アイテム)\n        ┗━ 削除ボタン\n```\n\n\n\n---\n\n 💡 **学習のヒント** \n>最初は上記の構造を一つのファイルにすべて書きますが、後で一つずつ切り離して「独立した部品」にする過程を経験します。\n>スタイル(CSS)よりも、**データがどのように流れるか**に集中してください！',
  },
  {
    id: 'todo-state-init',
    section: 8,
    order: 1,
    title: 'Todoリストの状態(State)を作る',
    type: 0,
    exp: 20,
    time: 8,
    content:
      "# 骨組み作り：データ構造を決める\n\n最初に、やるべきこと（ToDo）のリストを保存する **State** を作成する必要があります。\n\n### 🧠 Todoデータの形\n各ToDoを区別するために、**ID** と **内容** が必要です。\n\n```jsx\nconst [todos, setTodos] = useState([\n  { id: 1, text: 'Reactの基礎をマスターする' },\n  { id: 2, text: 'ToDoアプリを完成させる' },\n]);\n```\n\n---\n### 📌 覚えておきましょう\n- リストは **配列 `[ ]`** 形式です。\n- リストの中の一つひとつのデータは **オブジェクト `{ }`** 形式です。",
  },
  {
    id: 'todo-render-list',
    section: 8,
    order: 2,
    title: 'Todoリストを画面に表示する',
    type: 0,
    exp: 20,
    time: 10,
    content:
      '# 🖼️ 画面に描画する：map()\n\n作成したデータをユーザーに見せる番です。\n\n```jsx\n<ul>\n  {todos.map((todo) => (\n    <li key={todo.id}>{todo.text}</li>\n  ))}\n</ul>\n```\n\n---\n### 📌 チェックポイント\n- **map()** を使って配列の要素数だけ **<li>** を作成します。\n- Reactが混乱しないように、固有のキー値を必ず入れてください！ `key={todo.id}`',
  },
  {
    id: 'todo-input-state',
    section: 8,
    order: 3,
    title: '入力フォームと入力状態を作る',
    type: 0,
    exp: 20,
    time: 10,
    content:
      '# ✍️ 文字を入力できるようにする\n\n新しいToDoを入力するボックスと、その値を記憶する State を作成します。\n\n```jsx\nconst [input, setInput] = useState(\'\');\n\n// ...中略\n\n<input\n  value={input}\n  onChange={(e) => setInput(e.target.value)}\n  placeholder="やることを入力してください"\n/>\n```\n\n### 📌 なぜこのようにするのですか？\n> 入力欄の値(**value**)をState(**input**)と連結することで、Reactが入力値を完全に制御できるようになります（これを**制御コンポーネント**と呼びましたね！）。',
  },
  {
    id: 'todo-submit-add',
    section: 8,
    order: 4,
    title: 'フォーム送信でTodoを追加する',
    type: 0,
    exp: 25,
    time: 15,
    content:
      "# ➕ リストに新しい項目を追加する\n\n入力した文字を実際のリストに追加してみましょう。\n\n```jsx\nconst onSubmit = (e) => {\n  e.preventDefault(); // リロード防止！\n\n  const newTodo = {\n    id: Date.now(), // 固有のIDを生成\n    text: input,\n  };\n\n  setTodos([...todos, newTodo]); // 不変性を維持しながら追加！\n  setInput(''); // 入力欄を空にする\n};\n```\n\n### 💡 ここで豆知識！ Date.now()とは？\nIDはリスト内の各項目を区別する**背番号**のようなものです。そのため、絶対に重複してはいけません。\n\n- **Date**: JavaScriptで日付と時間を扱うツールです。\n- **.now()**: この関数を実行した**「その一瞬の時間」**をミリ秒単位の数値で返します。\n- **なぜ使うのか？**: 時間は止まらずに流れるため、実行するたびに常に異なる数値が出ます。おかげでデータベースのない練習用プロジェクトで**重複しない固有ID**を作るのに非常に便利です！\n\n---\n\n### ✅ 実装された機能\n- 文字入力後に Enter またはボタンクリック ➡️ 入力した値がリストにパッと表示されます。\n- Reactの**不変性の原則**のおかげで、画面が即座に更新されます。",
  },
  {
    id: 'todo-split-components',
    section: 8,
    order: 5,
    title: '応用1：コンポーネントに分割してみる',
    type: 0,
    exp: 20,
    time: 10,
    content:
      "# ✂️ コードの整理：コンポーネント分割\n\nコードが長くなると読みにくくなります。役割に応じて部品を分けてみましょう。\n\n1. **TodoForm**: 入力欄と追加ボタンを担当\n2. **TodoList**: やることリストの表示を担当\n\n---\n\n### 📝 現在の App.tsx の様子 (分割直後)\n\n```jsx\nimport { useState } from 'react';\nimport TodoForm from './TodoForm'; \nimport TodoList from './TodoList'; \n\nfunction App() {\n  const [todos, setTodos] = useState([\n    { id: 1, text: 'Reactの基礎をマスターする' },\n    { id: 2, text: 'ToDoアプリを完成させる' },\n  ]);\n  const [input, setInput] = useState('');\n\n  const onSubmit = (e) => {\n    e.preventDefault();\n    const newTodo = { id: Date.now(), text: input };\n    setTodos([...todos, newTodo]);\n    setInput('');\n  };\n\n  return (\n    <div>\n      <h1>My Todo List</h1>\n      <TodoForm /> \n      <TodoList />\n    </div>\n  );\n}\n```\n\n> 💡 **ミッション**: 上記のコードのようにファイルを分割して保存してみてください。画面はどうなりますか？ おそらく、予想外の状況（エラー）が発生するはずです。",
  },
  {
    id: 'todo-error-why',
    section: 8,
    order: 6,
    title: '応用2：なぜエラーが発生するのでしょうか？',
    type: 0,
    exp: 25,
    time: 8,
    content:
      '# 🧐 「todosが定義されていません！」\n\nコンポーネントを分割した瞬間、ブラウザに赤いエラーメッセージが表示されたはずです。コードは完璧にコピーしたつもりなのに、なぜでしょうか？\n\n### 🧠 原因：壁の向こうのデータ\nJavaScriptでは変数や関数は、**宣言された場所**を基準にスコープ（範囲）が分かれます。\n\n- **データの場所**: 親コンポーネント(App.tsx) の部屋の中にあります。\n- **データが必要な場所**: 子コンポーネント(TodoForm, TodoList) の部屋の中です。\n\n子コンポーネント側からは、親の部屋に何があるのか全く分かりません。隣の家に誰が住んでいるか知らないのと同じです。\n\n### 📦 解決策：データ配送サービス (Props)\n> 親が持っているデータを子に公式に伝達する過程が必要です。次のステップで、**Props**という「宅配便の箱」にデータを詰めて、子供たちに安全に届けてみましょう！',
  },
  {
    id: 'todo-pass-props',
    section: 8,
    order: 7,
    title: '応用3：Propsでエラーを解決する',
    type: 0,
    exp: 25,
    time: 20,
    content:
      '# 🎁 データを届ける：Propsで接続完了\n\n親(**App.tsx**)が持っているデータを子に渡して、エラーを解決しましょう。これで各コンポーネントは自分が何をすべきか正確に理解できるようになります。\n\n### 🔗 接続（App.tsx）\n```jsx\n<TodoForm input={input} setInput={setInput} onSubmit={onSubmit} />\n<TodoList todos={todos} />\n```\n\n---\n\n### 📂 完成したコード構造\n\nあなたのコードと、以下のファイル別の内容を照らし合わせてみてください！\n\n#### 1️⃣ App.tsx (中心部：State管理と配送)\n```jsx\nfunction App() {\n  const [todos, setTodos] = useState([...]);\n  const [input, setInput] = useState(\'\');\n\n  const onSubmit = (e) => { ... };\n\n  return (\n    <div>\n      <h1>My Todo List</h1>\n      {/* 必要なデータをPropsとして渡します */}\n      <TodoForm input={input} setInput={setInput} onSubmit={onSubmit} />\n      <TodoList todos={todos} />\n    </div>\n  );\n}\n```\n\n#### 2️⃣ TodoForm.tsx (入力担当：受け取った関数の実行)\n```jsx\nfunction TodoForm({ input, setInput, onSubmit }) {\n  return (\n    <form onSubmit={onSubmit}>\n      <input value={input} onChange={(e) => setInput(e.target.value)} />\n      <button type="submit">追加</button>\n    </form>\n  );\n}\n```\n\n#### 3️⃣ TodoList.tsx (表示担当：受け取った配列のレンダリング)\n```jsx\nfunction TodoList({ todos }) {\n  return (\n    <ul>\n      {todos.map((todo) => (\n        <li key={todo.id}>{todo.text}</li>\n      ))}\n    </ul>\n  );\n}\n```\n\n---\n\n### 🔑 今日学んだ核心的な流れ\n1. **データ(State)** は親から子へ流れます。（上 → 下）\n2. **イベント(関数)** は、子が親の状態を変えるために呼び出されます。（下 → 上）\n\n> これでコードの管理がずっと楽になり、機能は以前と同じように完璧に動作します！ 🎉',
  },
  {
    id: 'todo-delete-filter',
    section: 8,
    order: 8,
    title: '応用4：Todo削除機能の実装',
    type: 0,
    exp: 30,
    time: 18,
    content:
      '# 🗑️ 間違えた予定をスッキリ消す\n\n普通のスケジュール管理アプリを思い出してみてください。「追加」と同じくらい重要なのが **「削除」** ですよね？\n追加しかできないアプリなら、すぐにリストが一杯になって誰も使わなくなってしまいます。削除機能を追加してアプリを完成に近づけましょう！\n\n---\n\n### 1️⃣ ボタンを設置する (TodoList.tsx)\n\n各ToDoの横に、消しゴムの役割をするボタンを作成します。\n\n```jsx\n{todos.map((todo) => (\n  <li key={todo.id}>\n    {todo.text}\n    {/* クリックしたtodoのidを onDelete関数に送ります */}\n    <button onClick={() => onDelete(todo.id)}>削除</button>\n  </li>\n))}\n```\n\n---\n\n### 2️⃣ 核心ロジック：filter関数の理解\n\n削除の鍵は **「クリックした項目以外をすべて残す！」** とReactに伝えることです。ここでJavaScriptの **filter** メソッドが魔法使いの役割をします。\n\n```jsx\nconst onDelete = (id) => {\n  // リスト(todos)から一つずつ取り出して検査します\n  // 条件：「検査中のtodoのidが、今クリックされたidと異なるか？」\n  const updatedTodos = todos.filter((todo) => todo.id !== id);\n  \n  setTodos(updatedTodos);\n};\n```\n\n### 🧠 filterが動く仕組み\n- **浄水器のフィルター**を想像してください。不純物だけを取り除き、きれいな水だけを通しますよね？ **filter**も同じです。\n- **条件式 (todo.id !== id)** が **真(True)** であるデータだけが生き残り、新しい配列に格納されます。削除ボタンを押したデータはこの条件で **偽(False)** になり、脱落します。\n- **不変性** : 元の **todos** 配列から要素を直接捨てているわけではありません！条件を通過したデータで **「完全に新しい配列」** を作成して入れ替える方式です。だからReactが変化を即座に感知できます。\n\n---\n\n### 3️⃣ 結果の確認\n 削除ボタンを押すと、該当する項目が画面から魔法のように消えます。\n\n ```jsx\n // データの流れ \n 削除ボタンクリック ➡️ onDelete実行 ➡️ filterで新しい配列生成 ➡️ setTodosで画面更新！\n```\n\n> おめでとうございます！これで追加と削除の両方が可能な **本物のWebサービス** の基本が備わりました。 👏',
  },
  {
    id: 'todo-section8-summary',
    section: 8,
    order: 9,
    title: 'セクション8まとめ：Todoアプリ完成',
    type: 0,
    exp: 20,
    time: 7,
    content:
      '# 🎉 ついに一つのアプリを完成させました！\n\nあなたは今、実際に動くサービスをReactで直接実装し終えました。理論でしか知らなかったデータの流れや状態管理を「自分のコード」で証明した、とても価値のある瞬間です。\n\n### ✅ 私たちが一緒にマスターしたもの\n- **データ管理**: 配列とオブジェクトを活用したリスト出力\n- **相互作用**: ユーザーの入力値(Input)をStateで制御する\n- **構造化**: コンポーネント分割とPropsを通じたデータ伝達\n- **不変性**: **filter**を活用してオリジナルを守りながらデータを削除する\n\n---\n\n### 🚀 ここで立ち止まらないでください！\n基本的な骨組みは完成しましたが、このアプリを「自分だけのもの」にする方法は無限にあります。\n\n- **スタイリング**: 自分なりの感覚でCSSを着せてみてください。\n- **機能拡張**: 完了した項目を修正したり、ボタン一つで全リストを消去する「全削除」機能はどうでしょうか？\n- **挑戦**: やるべきことを完了した時に横線が引かれるチェックボックス機能を作るのも良い練習になります。\n\n---\n\n### 🤝 あなたの成果を共有してください！\nあなたの個性と情熱がこもった Todo List を楽しみにしています。完成した成果物やコードを**コミュニティページ**に共有してみてください！仲間の作品からインスピレーションを得て、自分の成長を存분（存分）に披露できる最高の場所になるはずです。\n\n本当にお疲れ様でした！\nこのアプリが、あなたのReact開発人生における心強い最初の道標になることを心から応援しています。 👏\n\n```jsx\nreturn (\n  <h1>See you again!</h1>\n); \n// Made by Ryan\n```',
  },
];

export type Content = DescriptiveContent | MultipleChoiceQuiz | ShortAnswerQuiz;

export const languageAtom = atom('ko');

export const contentsAtom = atom((get) => {
  const lang = get(languageAtom);
  return lang === 'ja' ? contentDataJp : contentsData;
});

export const lectures = {
  ko: contentsData,
  ja: contentDataJp,
};

export const perAtom = atom(0);
