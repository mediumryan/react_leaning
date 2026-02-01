import { atom } from 'jotai';

export const userAnswersAtom = atom('');

export const isSubmittedAtom = atom(false);

export const isCorrectAtom = atom(false);

export const showFeedbackAtom = atom(false);

export const displayedCorrectAnswerAtom = atom('');
