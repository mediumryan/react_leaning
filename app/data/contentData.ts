import { collection, doc, writeBatch } from 'firebase/firestore';
import { firestore } from '~/lib/firebase';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// 콘텐츠 유형을 정의합니다: 0: 설명, 1: 객관식, 2: 주관식
export type ContentType = 0 | 1 | 2;

// 모든 콘텐츠 유형에 공통적으로 포함될 기본 속성입니다.
export interface BaseContent {
  id: string; // 고유 ID
  section: number; // 속한 섹션
  order: number; // 섹션 내 순서
  title: string; // 콘텐츠 제목
  type: ContentType; // 콘텐츠 유형
  exp: number; // 완료 시 획득 경험치
  isComplete: boolean; // 완료 여부
}

// Type 0: 강의 설명 콘텐츠
export interface DescriptiveContent extends BaseContent {
  type: 0;
  youtubeId?: string; // 유튜브 영상 ID (선택)
  content: string; // 설명 내용 (HTML 또는 마크다운)
}

// Type 1: 객관식 퀴즈 콘텐츠
export interface MultipleChoiceQuiz extends BaseContent {
  type: 1;
  question: string; // 퀴즈 질문
  options: string[]; // 4개의 선택지 배열
  correctAnswerIndex: number; // 정답의 인덱스 (0-3)
}

// Type 2: 주관식 퀴즈 콘텐츠
export interface ShortAnswerQuiz extends BaseContent {
  type: 2;
  question: string; // 퀴즈 질문
  correctAnswer: string; // 정답 문자열
}

// 모든 콘텐츠 타입을 포함하는 유니온 타입입니다.
export type Content = DescriptiveContent | MultipleChoiceQuiz | ShortAnswerQuiz;

// 목업 데이터: 세 가지 유형의 콘텐츠를 모두 포함합니다.
export const mockContents: Content[] = [
  {
    id: 'lec-01',
    section: 1,
    order: 1,
    title: 'React.js入門',
    type: 0,
    content:
      'React는 사용자 인터페이스를 만들기 위한 JavaScript 라이브러리입니다. Facebook(현 Meta)에 의해 만들어졌으며, 컴포넌트 기반 아키텍처를 특징으로 합니다.',
    exp: 10,
    isComplete: true,
  },
  {
    id: 'lec-02',
    section: 1,
    order: 2,
    title: 'Reactを作った企業はどこでしょう？',
    type: 1,
    question: 'Reactを作った企業はどこでしょう？',
    options: ['Google', 'Meta', 'TikTok', 'Toyota'],
    correctAnswerIndex: 1,
    exp: 20,
    isComplete: false,
  },
  {
    id: 'lec-03',
    section: 1,
    order: 3,
    title: 'React.jsはJavaScriptの「　」である。',
    type: 2,
    question: 'React.jsはJavaScriptの「　」である。',
    correctAnswer: 'ライブラリ',
    exp: 20,
    isComplete: false,
  },
  {
    id: 'lec-04',
    section: 2,
    order: 1,
    title: 'JSXとは？',
    type: 0,
    content:
      'JSX는 JavaScript XML의 약자로, JavaScript 코드 내에서 HTML과 유사한 마크업을 작성할 수 있게 해주는 구문 확장입니다. React에서 UI를 렌더링할 때 주로 사용됩니다.',
    exp: 10,
    isComplete: false,
  },
];

// contentsAtom을 새로운 데이터 구조와 목업 데이터로 초기화합니다.
export const contentsAtom = atomWithStorage<Content[]>(
  'contents',
  mockContents,
);

export type ContentStatusType = {
  course: number;
  isComplete: boolean;
};
export const contentStatusAtom = atom<ContentStatusType[]>([]);

export const perAtom = atom(0);
