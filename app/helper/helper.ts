import type { Content } from "~/data/contentData";
import type { User } from "~/data/userData";

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

export const mappingTitlebySection = (section: number) => {
  switch (section) {
    case 1:
      return "1. Reactの基礎";
    case 2:
      return "2. Reactの基本構文";
    case 3:
      return "3. PropsとState";
    case 4:
      return "4. イベントとフォーム";
    case 5:
      return "5. コンポーネントのライフサイクルとフック";
    default:
      return "";
  }
};

export const generateContentStatusForUser = (contentList: Content[]) => {
  return contentList.map((item) => ({
    course: item.id,
    isComplete: false,
  }));
};

export const isCompleteCourse = (
  content: Content,
  currentUser: User | null,
) => {
  return (
    currentUser?.contentStatus?.find((status) => status.course === content.id)
      ?.isComplete || false
  );
};
