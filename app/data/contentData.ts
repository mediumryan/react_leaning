import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

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

export type Content = {
  id: string;
  section: number;
  order: number;
  title: string;
  type: string;
  youtubeId?: string;
  content: string;
  exp: number;
};

export const contentsAtom = atomWithStorage<Content[] | null>('contents', null);

export const contentStatusAtom = atom<ContentStatusType[]>([]);

export const perAtom = atom(0);
