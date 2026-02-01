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
}

export interface ShortAnswerQuiz extends BaseContent {
  type: 2;
  question: string;
  correctAnswer: string;
}

export const mockContents: Content[] =
  // 0: 설명, 1: 객관식, 2: 주관식
  [
    // --- Section 1. Intro ---
    {
      id: 'intro-what-is-react',
      section: 1,
      order: 1,
      title: 'React.js란 무엇인가?',
      type: 0,
      exp: 10,
      isComplete: false,
      content:
        '\nReact는 **사용자 인터페이스(UI)**를 만들기 위한 JavaScript 라이브러리입니다.\n\n웹페이지에서 버튼을 클릭하거나 입력값이 바뀔 때, 화면이 전체가 아닌 **필요한 부분만** 스마트하게 업데이트되는 경험을 해보셨나요?\n\nReact는 바로 이런 **동적인 화면을 효율적으로 만들기 위해** 탄생했습니다.\n\n📌 **핵심 포인트**\n- React는 UI를 **컴포넌트**라는 작은 단위로 쪼개서 관리합니다.\n- 선언적인 코드로 UI를 쉽게 설계할 수 있습니다.',
    },
    {
      id: 'quiz-react-definition',
      section: 1,
      order: 2,
      title: 'React의 정의 퀴즈',
      type: 2,
      exp: 20,
      isComplete: false,
      question: 'React는 JavaScript의 어떤 종류의 도구입니까? (ㄹㅇㅂㄹㄹ)',
      correctAnswer: '라이브러리',
    },
    {
      id: 'intro-why-react',
      section: 1,
      order: 3,
      title: '왜 React를 배워야 할까요?',
      type: 0,
      exp: 10,
      isComplete: false,
      content:
        '\n전 세계에서 가장 많이 쓰이는 UI 도구인 이유가 있습니다.\n\n1. **컴포넌트 재사용**: 한 번 만든 버튼을 어디든 다시 쓸 수 있습니다.\n2. **거대한 생태계**: 문제가 생겨도 구글링하면 다 나옵니다.\n3. **선언적 프로그래밍**: 화면이 어떻게 변해야 하는지만 적으면 나머지는 리액트가 알아서 해줍니다.\n\n이제 본격적으로 시작해볼까요?',
    },
    {
      id: 'app-creation-vite',
      section: 1,
      order: 4,
      title: '앱 생성하기 - Vite',
      type: 0,
      exp: 15,
      isComplete: false,
      content:
        '\n가장 빠르고 현대적인 도구인 **Vite**를 이용해 앱을 만듭니다.\n\n터미널을 열고 아래 명령어를 입력해보세요:\n```bash\nnpm create vite@latest my-todo-app -- --template react\n```\n\n이 과정이 끝나면 개발을 시작할 준비가 완료된 것입니다!',
    },

    // --- Section 2. Basic Part ---
    {
      id: 'basic-understanding-components',
      section: 2,
      order: 1,
      title: '컴포넌트(Components) 이해하기',
      type: 0,
      exp: 10,
      isComplete: false,
      content:
        '\n컴포넌트는 UI를 구성하는 **독립적인 블록**입니다.\n\nReact에서 컴포넌트는 그냥 **JavaScript 함수**일 뿐입니다!\n\n```jsx\nfunction Welcome() {\n  return <h1>안녕, 리액트!</h1>;\n}\n```\n\n이 함수를 `<Welcome />` 처럼 태그로 사용하면 화면에 나타납니다.\n\n📌 **주의**: 컴포넌트 이름의 첫 글자는 반드시 **대문자**여야 합니다.',
    },
    {
      id: 'basic-jsx-syntax',
      section: 2,
      order: 2,
      title: 'JSX: 자바스크립트 속 HTML',
      type: 0,
      exp: 10,
      isComplete: false,
      content:
        '\nJSX는 자바스크립트 코드 안에서 **HTML처럼 보이는 문법**을 쓰는 것입니다.\n\n```jsx\nconst element = <h1 className="title">반가워요</h1>;\n```\n\n- HTML과 비슷하지만 `class` 대신 `className`을 씁니다.\n- `{ }`를 사용하면 자바스크립트 변수를 HTML 안에 넣을 수 있습니다.',
    },
    {
      id: 'quiz-jsx-concept',
      section: 2,
      order: 3,
      title: 'JSX 문법 퀴즈',
      type: 1,
      exp: 20,
      isComplete: false,
      question:
        'JSX 내에서 자바스크립트 변수를 사용할 때 쓰는 기호는 무엇입니까?',
      options: ['( )', '[ ]', '{ }', '< >'],
      correctAnswerIndex: 2,
    },

    // --- Section 3. State ---
    {
      id: 'state-what-is-state',
      section: 3,
      order: 1,
      title: 'State란 무엇인가?',
      type: 0,
      exp: 15,
      isComplete: false,
      content:
        "\n**State**는 컴포넌트가 기억하고 있는 **'상태'** 데이터입니다.\n\n값이 바뀌면 화면이 **자동으로 다시 그려지는(Re-rendering)** 마법 같은 변수죠.\n\n```jsx\nconst [count, setCount] = useState(0);\n```\n\n- `count`: 현재 값\n- `setCount`: 값을 바꾸는 함수\n- `useState(0)`: 처음 값을 0으로 설정",
    },
    {
      id: 'state-counter-practice',
      section: 3,
      order: 2,
      title: '카운터 앱 실습: 버튼 이벤트',
      type: 0,
      exp: 25,
      isComplete: false,
      content:
        '\n버튼을 클릭하면 숫자가 올라가는 로직을 작성해봅시다.\n\n```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={() => setCount(count + 1)}>증가</button>\n    </div>\n  );\n}\n```\n\n리액트에서는 `onclick`이 아니라 **`onClick`**이라고 적어야 함에 주의하세요!',
    },
    {
      id: 'quiz-state-re-render',
      section: 3,
      order: 3,
      title: 'State의 특성 퀴즈',
      type: 1,
      exp: 20,
      isComplete: false,
      question: 'State의 값이 변경되면 컴포넌트에는 어떤 일이 발생합니까?',
      options: [
        '아무 일도 일어나지 않는다',
        '전체 페이지가 새로고침된다',
        '해당 컴포넌트가 재렌더링된다',
        '에러가 발생한다',
      ],
      correctAnswerIndex: 2,
    },

    // --- Section 4. Props ---
    {
      id: 'props-passing-data',
      section: 4,
      order: 1,
      title: 'Props로 데이터 전달하기',
      type: 0,
      exp: 15,
      isComplete: false,
      content:
        '\n**Props**는 부모 컴포넌트가 자식 컴포넌트에게 주는 \'데이터 선물\'입니다.\n\n```jsx\n// 부모\n<MyButton text="저장하기" />\n\n// 자식\nfunction MyButton(props) {\n  return <button>{props.text}</button>;\n}\n```\n\nProps는 읽기 전용이며, 자식은 받은 선물을 함부로 바꿀 수 없습니다.',
    },
    {
      id: 'props-pass-setstate',
      section: 4,
      order: 2,
      title: '함수도 Props로 줄 수 있어요',
      type: 0,
      exp: 20,
      isComplete: false,
      content:
        '\n데이터뿐만 아니라 **State를 바꾸는 함수**도 전달할 수 있습니다.\n\n자식 컴포넌트에서 부모의 상태를 바꾸고 싶을 때 자주 사용하는 방식입니다.',
    },

    // --- Section 5. List (추가 구성) ---
    {
      id: 'list-rendering-map',
      section: 5,
      order: 1,
      title: '리스트 데이터 보여주기 (map)',
      type: 0,
      exp: 15,
      isComplete: false,
      content:
        "\n배열 형태의 데이터를 화면에 반복해서 그릴 때는 자바스크립트의 **`map`** 함수를 사용합니다.\n\n```jsx\nconst list = ['우유 사기', '공부하기'];\n\nreturn (\n  <ul>\n    {list.map((item) => <li key={item}>{item}</li>)}\n  </ul>\n);\n```",
    },
    {
      id: 'list-key-prop-importance',
      section: 5,
      order: 2,
      title: 'Key 속성이 왜 중요한가요?',
      type: 0,
      exp: 10,
      isComplete: false,
      content:
        '\n리스트를 만들 때 각 항목에는 반드시 고유한 **`key`** 속성을 주어야 합니다.\n\nReact는 이 `key`를 보고 어떤 항목이 추가되었는지, 삭제되었는지 **빠르게 판단**하기 때문입니다.',
    },

    // --- Section 6. Todo-List 프로젝트 ---
    {
      id: 'todo-project-intro',
      section: 6,
      order: 1,
      title: 'Todo-List 제작 시작하기',
      type: 0,
      exp: 10,
      isComplete: false,
      content:
        '\n드디어 목표인 Todo-List 앱을 직접 만들어볼 시간입니다!\n\n**필요한 기능:**\n1. 할 일 입력하고 추가하기\n2. 할 일 목록 보여주기\n3. 완료한 할 일 삭제하기\n\n자, 코드를 따라 작성해보며 완성해봅시다!',
    },
    {
      id: 'todo-project-add-logic',
      section: 6,
      order: 2,
      title: '추가 기능과 배열 업데이트',
      type: 0,
      exp: 30,
      isComplete: false,
      content:
        '\n배열에 새로운 할 일을 추가할 때는 기존 배열을 수정하는 게 아니라 **새로운 배열**을 만들어야 합니다.\n\n```jsx\nconst onAdd = () => {\n  const nextTodos = [...todos, { id: Date.now(), text: input }];\n  setTodos(nextTodos);\n};\n```',
    },
    {
      id: 'todo-project-complete-quiz',
      section: 6,
      order: 3,
      title: '프로젝트 최종 점검',
      type: 2,
      exp: 50,
      isComplete: false,
      question:
        "배열에서 특정 아이템을 제거하거나 추가할 때, 리액트는 항상 '불변성'을 지켜야 합니다. 새로운 배열을 만들 때 사용하는 '...' 기호의 이름은? (ㅈㄱ 연산자)",
      correctAnswer: '전개',
    },

    // --- Bonus. useEffect ---
    {
      id: 'bonus-useeffect-lifecycle',
      section: 7,
      order: 1,
      title: 'useEffect: 컴포넌트의 탄생과 죽음',
      type: 0,
      exp: 20,
      isComplete: false,
      content:
        "\n**useEffect**는 컴포넌트가 처음 화면에 나타났을 때(Mount) 실행하고 싶은 코드를 넣는 곳입니다.\n\n```jsx\nuseEffect(() => {\n  console.log('앱이 실행되었습니다!');\n}, []);\n```\n\n서버에서 데이터를 받아오거나 타이머를 설정할 때 필수적인 기능입니다.",
    },
  ];

export type Content = DescriptiveContent | MultipleChoiceQuiz | ShortAnswerQuiz;

export const contentsQueryAtom = atomWithQuery<Content[]>((get) => ({
  queryKey: ['contents'] as const,
  queryFn: async () => {
    // 1️⃣ localStorage에서 기존 값 확인
    const stored = localStorage.getItem('contents');
    if (stored) {
      try {
        const parsed: Content[] = JSON.parse(stored);
        if (parsed.length > 0) {
          return parsed; // 서버 fetch 없이 바로 반환
        }
      } catch {
        // parse 실패하면 서버 fetch 진행
      }
    }

    // 2️⃣ storage에 값 없으면 서버 fetch
    const contents = await getContents();

    // 3️⃣ fetch 후 storage에 저장
    if (contents && contents.length > 0) {
      localStorage.setItem('contents', JSON.stringify(contents));
    }

    return contents;
  },
}));

export const perAtom = atom(0);
