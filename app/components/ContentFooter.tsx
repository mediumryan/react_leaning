// react-router
import { useNavigate, useParams } from "react-router";
// atoms
import { currentUserAtom } from "~/data/userData"; // Import contentsAtom
import { useAtom, useAtomValue } from "jotai"; // Import useAtomValue
import { contentsQueryAtom } from "~/data/contentData";
// shadcn/ui
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
// icons
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
// helpers
import {
  getFirstContentId,
  getLastContentId,
  getNextContentId,
  getPreviousContentId,
} from "~/helper/helper";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "~/lib/firebase";

export default function ContentFooter() {
  const lectureId = useParams().id;
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  // const [{ data: contents }] = useAtom(contentsQueryAtom);
  const contents = useAtomValue(contentsQueryAtom);

  if (!contents) {
    return null; // Or render a disabled state for buttons
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
    if (!currentUser || !lectureId) return;

    try {
      // Create a document in the contentStatus subcollection
      const contentStatusDocRef = doc(
        firestore,
        "users",
        currentUser.uid,
        "contentStatus",
        lectureId,
      );
      await setDoc(contentStatusDocRef, {
        createdAt: serverTimestamp(),
      });

      // Update local state
      const updatedContentStatus = new Set(currentUser.contentStatus).add(
        lectureId,
      );

      setCurrentUser({
        ...currentUser,
        contentStatus: updatedContentStatus,
      });

      alert("このレクチャーを完了しました！");
    } catch (error) {
      console.error("Error completing lecture:", error);
      alert("レクチャーの完了に失敗しました。");
    }
  };

  const isCompleted =
    lectureId && currentUser?.contentStatus?.has(lectureId) ? true : false;

  const hasPrevious = !!getPreviousContentId(contents, lectureId ?? "");
  const hasNext = !!getNextContentId(contents, lectureId ?? "");

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
