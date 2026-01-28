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

export const mockContents: Content[] = [
  /* =========================
   * Section 1: Reactについての理解
   * ========================= */
  {
    id: 'react-intro-what-is-react',
    section: 1,
    order: 1,
    title: 'Reactとは何か？',
    type: 0,
    content: `
Reactは
**ユーザーインターフェース(UI)**
を作るためのJavaScriptライブラリです。

ウェブページでボタンをクリックしたり、入力値が変わったときに
👉 画面が自動で更新される体験をしたことはありますか？

Reactはこのような
**動的な画面を効率的に作るため**
に誕生しました。

特にReactは画面を
**コンポーネント(Component)**
という小さな単位に分けて管理します。

この方法のおかげでコードが読みやすくなり、再利用もしやすくなります。
`,
    exp: 10,
    isComplete: false,
  },
  {
    id: 'react-intro-core-feature',
    section: 1,
    order: 2,
    title: 'Reactの主要な特徴',
    type: 1,
    question: 'Reactのコア概念として最も正しいものはどれですか？',
    options: [
      'ページ全体を毎回更新する',
      'コンポーネント単位でUIを構成する',
      'HTMLファイルを複数作成する',
      'データベースを直接操作する',
    ],
    correctAnswerIndex: 1,
    exp: 20,
    isComplete: false,
  },
  {
    id: 'react-intro-definition',
    section: 1,
    order: 3,
    title: 'Reactの定義',
    type: 2,
    question: 'ReactはJavaScriptのどの種類のツールですか？',
    correctAnswer: 'ライブラリ',
    exp: 20,
    isComplete: false,
  },

  /* =========================
   * Section 2: React 基本文法
   * ========================= */
  {
    id: 'react-basic-jsx-intro',
    section: 2,
    order: 1,
    title: 'JSX文法の理解',
    type: 0,
    content: `
JSXはJavaScriptの中で
**HTMLのように見える文法**
を書くことを可能にします。

例えば、以下のコードはJSXです。

\`\`\`html
<div>Hello React</div>
\`\`\`

初めて見るとHTMLのようですが、実際にはJavaScriptのコードです。

ReactはこのJSXを使用して
**UI構造を直感的に表現**
します。

※ JSXはブラウザが直接理解できないため、
ReactがJavaScriptのコードに変換します。
`,
    exp: 10,
    isComplete: false,
  },
  {
    id: 'react-basic-jsx-concept',
    section: 2,
    order: 2,
    title: 'JSXの概念',
    type: 1,
    question: 'JSXに関する正しい説明はどれですか？',
    options: [
      'HTMLファイルそのものである',
      'JavaScriptの文法拡張である',
      'CSSを書く文法である',
      'ブラウザ専用の言語である',
    ],
    correctAnswerIndex: 1,
    exp: 20,
    isComplete: false,
  },
  {
    id: 'react-basic-jsx-role',
    section: 2,
    order: 3,
    title: 'JSXの役割',
    type: 2,
    question: 'JSXは画面構造を何のように書けるようにするものですか？',
    correctAnswer: 'HTML',
    exp: 20,
    isComplete: false,
  },

  /* =========================
   * Section 3: Todoアプリの技術的理解
   * ========================= */
  {
    id: 'react-state-what-is-state',
    section: 3,
    order: 1,
    title: 'Stateとは何か？',
    type: 0,
    content: `
Stateは
**コンポーネント内で管理されるデータ**
です。

例えばTodoアプリでは：
- やることリスト
- 入力欄に入力された値

これらすべてがStateになります。

Stateの最も重要な特徴は
👉
**Stateが変更されると画面が自動的に再レンダリングされる**
という点です。
`,
    exp: 10,
    isComplete: false,
  },
  {
    id: 'react-state-feature',
    section: 3,
    order: 2,
    title: 'Stateの特徴',
    type: 1,
    question: 'Stateに関する正しい説明はどれですか？',
    options: [
      '値が変わっても画面はそのまま',
      'コンポーネントの外部でのみ使用する',
      '値が変更されると画面が再レンダリングされる',
      'CSSスタイル専用のデータである',
    ],
    correctAnswerIndex: 2,
    exp: 20,
    isComplete: false,
  },
  {
    id: 'react-state-effect',
    section: 3,
    order: 3,
    title: 'State変更の結果',
    type: 2,
    question: 'Stateが変更されるとReactは何を再実行しますか？',
    correctAnswer: 'レンダリング',
    exp: 20,
    isComplete: false,
  },

  /* =========================
   * Section 4: Todo List作成
   * ========================= */
  {
    id: 'todo-app-structure',
    section: 4,
    order: 1,
    title: 'Todo Listアプリの構造理解',
    type: 0,
    content: `
Todo Listアプリは以下のような構造で作ることができます。

1. 入力欄(Input)
2. 追加ボタン(Button)
3. やることリスト(List)

やることリストは配列形式のStateで管理し、
ユーザーがタスクを追加または削除するときに
Stateを更新します。

この構造はReactの基本概念を練習するのに最適です。
`,
    exp: 10,
    isComplete: false,
  },
  {
    id: 'todo-app-required-elements',
    section: 4,
    order: 2,
    title: 'Todoアプリの構成要素',
    type: 1,
    question: '簡単なTodo Listアプリに必要ないものはどれですか？',
    options: [
      '入力欄',
      '追加ボタン',
      'やることリスト',
      'バックエンドのデータベースサーバー',
    ],
    correctAnswerIndex: 3,
    exp: 20,
    isComplete: false,
  },
  {
    id: 'todo-app-state-usage',
    section: 4,
    order: 3,
    title: 'Todoデータ管理',
    type: 2,
    question: 'Todo ListのやることリストはどのReact概念で管理しますか？',
    correctAnswer: 'State',
    exp: 20,
    isComplete: false,
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
