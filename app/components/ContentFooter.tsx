import React from 'react';
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
import { useAtom } from 'jotai';
import { contentStatusAtom } from '~/data/data';

export default function ContentFooter() {
  const lectureId = useParams().id;
  const navigate = useNavigate();

  const [contentStatus, setContentStatus] = useAtom(contentStatusAtom);

  const handleClickFirst = () => {
    navigate('/contents/1');
  };

  const handleClickBack = () => {
    navigate(`/contents/${Number(lectureId) - 1}`);
  };

  const handleClickForward = () => {
    navigate(`/contents/${Number(lectureId) + 1}`);
  };

  const handleClickLast = () => {
    navigate(`/contents/${contentStatus.length}`);
  };

  const handleClickComplete = () => {
    setContentStatus((prev) => {
      let updated = [...prev];
      const index = updated.findIndex(
        (item) => item.course === Number(lectureId),
      );
      if (index !== -1) {
        updated[index] = { ...updated[index], isComplete: true };
      }
      return updated;
    });
  };

  return (
    <ButtonGroup>
      <ButtonGroup className="flex">
        <Button
          variant="outline"
          size="icon"
          aria-label="Go Back"
          disabled={Number(lectureId) <= 1}
          onClick={handleClickFirst}
        >
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Go Back"
          disabled={Number(lectureId) <= 1}
          onClick={handleClickBack}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Complete"
          onClick={handleClickComplete}
          disabled={
            contentStatus.find((item) => item.course === Number(lectureId))
              ?.isComplete
          }
        >
          <Check />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Go Forward"
          disabled={Number(lectureId) >= contentStatus.length}
          onClick={handleClickForward}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Go Forward"
          disabled={Number(lectureId) >= contentStatus.length}
          onClick={handleClickLast}
        >
          <ChevronsRight />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}
