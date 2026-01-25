import { ButtonGroup } from './ui/button-group';
import { Button } from './ui/button';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import {
  getFirstContentId,
  getLastContentId,
  getNextContentId,
  getPreviousContentId,
} from '~/helper/helper';
import { currentUserAtom } from '~/data/userData'; // Import contentsAtom
import { useAtom, useAtomValue } from 'jotai'; // Import useAtomValue
import { contentsAtom } from '~/data/contentData';

export default function ContentFooter() {
  const lectureId = useParams().id;
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const contents = useAtomValue(contentsAtom); // Get contents from atom

  // If contents are not loaded yet, disable buttons or return null
  if (!contents) {
    return null; // Or render a disabled state for buttons
  }

  const handleClickFirst = () => {
    const firstContentId = getFirstContentId(contents);
    if (firstContentId) navigate(`/contents/${firstContentId}`);
  };

  const handleClickPrevious = () => {
    const prevContentId = getPreviousContentId(contents, lectureId ?? '');
    if (prevContentId) navigate(`/contents/${prevContentId}`);
  };

  const handleClickNext = () => {
    const nextContentId = getNextContentId(contents, lectureId ?? '');
    if (nextContentId) navigate(`/contents/${nextContentId}`);
  };

  const handleClickLast = () => {
    const lastContentId = getLastContentId(contents);
    if (lastContentId) navigate(`/contents/${lastContentId}`);
  };

  const handleClickComplete = () => {
    if (!currentUser || !lectureId) return;
    // 현재 유저의 contentStatus를 확인. lectureId와 일치하는 항목이 있으면 isComplete를 true로 설정
    const updatedContentStatus = currentUser?.contentStatus?.map((status) => {
      if (status.course === lectureId) {
        return { ...status, isComplete: true };
      }
      return status;
    });
    setCurrentUser({
      ...currentUser,
      contentStatus: updatedContentStatus,
    });
    alert('このレクチャーを完了しました！');
  };

  const isCompleted = currentUser?.contentStatus?.find(
    (status) => status.course === lectureId,
  )?.isComplete;

  const hasPrevious = !!getPreviousContentId(contents, lectureId ?? '');
  const hasNext = !!getNextContentId(contents, lectureId ?? '');

  return (
    <ButtonGroup>
      <ButtonGroup className="flex">
        <Button
          variant="outline"
          size="icon"
          aria-label="Go First"
          disabled={!hasPrevious}
          onClick={handleClickFirst}
        >
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Go Previous"
          disabled={!hasPrevious}
          onClick={handleClickPrevious}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Complete"
          onClick={handleClickComplete}
          disabled={isCompleted}
        >
          <Check />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Go Next"
          disabled={!hasNext}
          onClick={handleClickNext}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Go Forward"
          disabled={!hasNext}
          onClick={handleClickLast}
        >
          <ChevronsRight />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}
