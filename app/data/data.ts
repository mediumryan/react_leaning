import { atom } from 'jotai';

export type ContentListType = {
  title: string;
  sub_contents: SubContentsType[];
};

export type SubContentsType = {
  course: number;
  title: string;
  content: string;
  isComplete: boolean;
};

export type ContentStatusType = {
  course: number;
  isComplete: boolean;
};

export type ClassType = 'Beginner' | 'Advanced' | 'Master';

export const classAtom = atom<ClassType>('Beginner');

export const CONTENT_DATA = [
  {
    title: 'Section 1 : Reactの基礎理解',
    sub_contents: [
      {
        course: 1,
        title: 'Reactとは何か？',
        content:
          'Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。Reactは、ユーザーインターフェース（UI）を構築するためのJavaScriptライブラリです。コンポーネントベースの考え方により、再利用性が高く、保守しやすいUIを作成できます。',
      },
      {
        course: 2,
        title: 'Reactを使う理由',
        content:
          'Reactは仮想DOMを使用して高速なレンダリングを実現します。また、大規模なアプリケーションでも状態管理がしやすいというメリットがあります。',
      },
      {
        course: 3,
        title: '開発環境の準備',
        content:
          'Node.jsをインストールし、npmまたはyarnを使ってReact開発環境を準備します。ここではNode.jsの役割についても簡単に説明します。',
      },
    ],
  },
  {
    title: 'Section 2 : Reactの基本構文',
    sub_contents: [
      {
        course: 4,
        title: 'Create React Appでプロジェクト作成',
        content:
          'Create React Appを使って、簡単にReactプロジェクトを作成します。フォルダ構成と基本ファイルの役割を確認します。',
      },
      {
        course: 5,
        title: 'JSXとは？',
        content:
          'JSXはJavaScriptの拡張構文で、HTMLのような記述が可能です。JSXの基本ルールと注意点を学びます。',
      },
      {
        course: 6,
        title: 'コンポーネントの作成',
        content:
          '関数コンポーネントを作成し、UIを部品として分割する方法を学びます。',
      },
    ],
  },
  {
    title: 'Section 3 : PropsとState',
    sub_contents: [
      {
        course: 7,
        title: 'Propsの使い方',
        content:
          'Propsを使って親コンポーネントから子コンポーネントへデータを渡す方法を学びます。',
      },
      {
        course: 8,
        title: 'Stateとは？',
        content:
          'Stateはコンポーネント内で管理されるデータです。useStateフックを使って状態を管理する方法を説明します。',
      },
      {
        course: 9,
        title: 'ミニプロジェクト：カウンターアプリ',
        content:
          'Stateを使って、数値を増減できる簡単なカウンターアプリを作成します。',
      },
    ],
  },
  {
    title: 'Section 4 : イベントとフォーム処理',
    sub_contents: [
      {
        course: 10,
        title: 'イベントハンドリング',
        content: 'onClickやonChangeなど、Reactでのイベント処理方法を学びます。',
      },
      {
        course: 11,
        title: 'フォーム入力の管理',
        content:
          '入力フォームの値をStateで管理し、ユーザー入力を扱う方法を説明します。',
      },
      {
        course: 12,
        title: 'ミニプロジェクト：簡単なメモアプリ',
        content:
          'フォームとStateを使って、メモを追加・表示できるアプリを作成します。',
      },
    ],
  },
  {
    title: 'Section 5 : Todo Listアプリ制作',
    sub_contents: [
      {
        course: 13,
        title: 'Todo Listの設計',
        content: 'Todo Listアプリの画面構成と必要な機能を整理します。',
      },
      {
        course: 14,
        title: 'Todoの追加と表示',
        content: '入力したTodoをリストとして表示する機能を実装します。',
      },
      {
        course: 15,
        title: 'Todoの削除と完了処理',
        content: 'Todoを削除したり、完了状態を管理する機能を追加します。',
      },
      {
        course: 16,
        title: '最終確認とまとめ',
        content:
          '作成したTodo Listアプリを振り返り、Reactの基本概念を整理します。',
      },
    ],
  },
];

export const contentStatusAtom = atom<ContentStatusType[]>([
  {
    course: 1,
    isComplete: true,
  },
  {
    course: 2,
    isComplete: false,
  },
  {
    course: 3,
    isComplete: false,
  },
  {
    course: 4,
    isComplete: false,
  },
  {
    course: 5,
    isComplete: false,
  },
  {
    course: 6,
    isComplete: false,
  },
  {
    course: 7,
    isComplete: false,
  },
  {
    course: 8,
    isComplete: false,
  },
  {
    course: 9,
    isComplete: false,
  },
  {
    course: 10,
    isComplete: false,
  },
  {
    course: 11,
    isComplete: false,
  },
  {
    course: 12,
    isComplete: false,
  },
  {
    course: 13,
    isComplete: false,
  },
  {
    course: 14,
    isComplete: false,
  },
  {
    course: 15,
    isComplete: false,
  },
  {
    course: 16,
    isComplete: false,
  },
]);

export const perAtom = atom(0);
