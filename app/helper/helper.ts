import type { Content } from '~/data/contentData';
import { ALLOWED_TYPES, MAX_FILE_SIZE } from '~/data/postData';
import type { User } from '~/data/userData';
// images
import branzeBadge from '~/assets/images/grades/bronze.png';
import silverBadge from '~/assets/images/grades/silver.png';
import goldBadge from '~/assets/images/grades/gold.png';
import platinumBadge from '~/assets/images/grades/platinum.png';
import diamondBadge from '~/assets/images/grades/diamond.png';

export const getFirstContentId = (contentList: Content[]) => {
  if (contentList.length === 0) return null;
  return contentList[0].id;
};

export const getLastContentId = (contentList: Content[]) => {
  if (contentList.length === 0) return null;
  return contentList[contentList.length - 1].id;
};

export const getNextContentId = (contentList: Content[], currentId: string) => {
  const currentLesson = contentList.find((item) => item.id === currentId);
  if (!currentLesson) return null;

  const sameSectionNextLesson = contentList.find(
    (item) =>
      item.section === currentLesson.section &&
      item.order === currentLesson.order + 1,
  );
  if (sameSectionNextLesson) return sameSectionNextLesson.id;
  const nextSectionFirstLesson = contentList.find(
    (item) => item.section === currentLesson.section + 1 && item.order === 1,
  );
  if (nextSectionFirstLesson) return nextSectionFirstLesson.id;
  return null;
};

export const getPreviousContentId = (
  contentList: Content[],
  currentId: string,
) => {
  const currentLesson = contentList.find((item) => item.id === currentId);
  if (!currentLesson) return null;
  const sameSectionPrevLesson = contentList.find(
    (item) =>
      item.section === currentLesson.section &&
      item.order === currentLesson.order - 1,
  );
  if (sameSectionPrevLesson) return sameSectionPrevLesson.id;
  const prevSectionLessons = contentList
    .filter((item) => item.section === currentLesson.section - 1)
    .sort((a, b) => b.order - a.order);
  if (prevSectionLessons.length > 0) return prevSectionLessons[0].id;
  return null;
};

export const mappingTitlebySection = (section: number) => {
  switch (section) {
    case 1:
      return 'Section 1 : What is React?';
    case 2:
      return 'Section 2 : Basic React Concepts';
    case 3:
      return 'Section 3 : State';
    case 4:
      return 'Section 4 : Props';
    case 5:
      return 'Section 5 : Events';
    case 6:
      return 'Section 6 : Lists / Objects';
    case 7:
      return 'Section 7 : Forms';
    case 8:
      return 'Section 8 : Todo List Project';
    case 9:
      return '*Bonus : Lifecycle';
    default:
      return '';
  }
};

export const groupContentBySection = (contentList: Content[]) => {
  // section별로 그룹화
  const groupedBySection = Object.values(
    contentList.reduce((acc: Record<number, typeof contentList>, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    }, {}),
  );

  // 각 섹션 안에서 order 기준으로 정렬 (선택)
  groupedBySection.forEach((sectionArray) => {
    sectionArray.sort((a, b) => a.order - b.order);
  });
  return groupedBySection;
};

export const isCompleteCourse = (
  content: Content,
  currentUser: User | null,
) => {
  if (!currentUser) return false;
  return currentUser.contentStatus.has(content.id);
};

export const checkShortAnswer = (
  correctAnswerString: string,
  userAnswer: string,
) => {
  const possibleAnswers = correctAnswerString
    .split(',,')
    .map((ans) => ans.trim().toLowerCase());

  const normalizedUserAnswer = userAnswer.trim().toLowerCase();

  const isCorrect = possibleAnswers.some((ans) => ans === normalizedUserAnswer);

  // Return the first possible answer for feedback
  const firstCorrectAnswer = possibleAnswers[0] || '';

  return { isCorrect, firstCorrectAnswer };
};

export const validateImageFile = (file: File) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'JPEG, PNG, WEBP 形式の画像のみアップロード可能です。';
  }

  if (file.size > MAX_FILE_SIZE) {
    return '画像のサイズは5MB以下でなければなりません。';
  }

  return null;
};

export const getUserMedal = (grade: string) => {
  switch (grade) {
    case 'Bronze':
      return branzeBadge;
    case 'Silver':
      return silverBadge;
    case 'Gold':
      return goldBadge;
    case 'Platinum':
      return platinumBadge;
    case 'Diamond':
      return diamondBadge;
    default:
      return '';
  }
};

export const getUserColorByClass = (grade: string) => {
  switch (grade) {
    case 'Bronze':
      return 'text-orange-950';
    case 'Silver':
      return 'text-gray-500';
    case 'Gold':
      return 'text-yellow-400';
    case 'Platinum':
      return 'text-cyan-400';
    default:
      return 'text-gray-100';
  }
};
