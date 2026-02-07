import { atomWithQuery } from 'jotai-tanstack-query';
import { refetchAtom } from './commonData';
import { currentUserAtom, type User } from './userData';
import { getNotices } from '~/lib/firestore_utils';

export type Notice = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isNew?: boolean;
  isImportant?: boolean;
};

export const noticeAtom = atomWithQuery((get) => ({
  queryKey: ['notice', get(refetchAtom), get(currentUserAtom)],
  queryFn: async ({ queryKey }) => {
    const [, , currentUser] = queryKey as [string, number, User | null];

    if (!currentUser) return null;

    const notice = await getNotices();
    return notice;
  },
}));
