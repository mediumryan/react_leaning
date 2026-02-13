// react
import { useState } from "react";
// react-router
import { useNavigate, useParams } from "react-router";
// atoms
import { currentUserAtom } from "~/data/userData"; // Import contentsAtom
import { useAtom, useAtomValue } from "jotai"; // Import useAtomValue
import { contentsAtom, type Content } from "~/data/contentData";
// shadcn/ui
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { toast } from "sonner";
// icons
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
// components
import { LevelUpModal } from "./LevelUpModal";
// helpers
import {
  getFirstContentId,
  getLastContentId,
  getNextContentId,
  getPreviousContentId,
} from "~/helper/helper";
// firebase
import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { firestore } from "~/lib/firebase";
import { completeLectureForUser } from "~/lib/firestore_utils";

interface ContentFooterProps {
  currentLecture: Content | undefined;
}

export default function ContentFooter({ currentLecture }: ContentFooterProps) {
  const lectureId = useParams().id;
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const contents = useAtomValue(contentsAtom);

  const [isOpen, setIsOpen] = useState(false);

  if (!contents) {
    return null;
  }

  const handleClickFirst = () => {
    const firstContentId = getFirstContentId(contents);
    if (firstContentId) navigate(`/contents/${firstContentId}`);
  };

  const handleClickPrevious = () => {
    const prevContentId = getPreviousContentId(contents, lectureId ?? "");
    if (prevContentId) navigate(`/contents/${prevContentId}`);
  };

  const handleClickNext = () => {
    const nextContentId = getNextContentId(contents, lectureId ?? "");
    if (nextContentId) navigate(`/contents/${nextContentId}`);
  };

  const handleClickLast = () => {
    const lastContentId = getLastContentId(contents);
    if (lastContentId) navigate(`/contents/${lastContentId}`);
  };

  const handleClickComplete = async () => {
    try {
      const updatedUser = await completeLectureForUser(
        currentUser,
        currentLecture,
      );

      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
      setIsOpen(true);
    } catch (error) {
      console.error("Error completing lecture:", error);
      toast.error("レクチャーの完了に失敗しました。");
    }
  };

  const isCompleted =
    lectureId && currentUser?.contentStatus?.has(lectureId) ? true : false;

  const hasPrevious = !!getPreviousContentId(contents, lectureId ?? "");
  const hasNext = !!getNextContentId(contents, lectureId ?? "");

  return (
    <>
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
      <LevelUpModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        earnedExp={currentLecture ? currentLecture.exp : 0}
        currentTotalExp={currentUser ? currentUser.exp : 0}
      />
    </>
  );
}
