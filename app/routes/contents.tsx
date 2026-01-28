// react
import { useEffect, useState } from "react";
// react-router
import { Navigate, useParams } from "react-router";
// atoms
import { useAtom, useAtomValue } from "jotai";
import { contentsQueryAtom } from "~/data/contentData";
import { currentUserAtom } from "~/data/userData"; // Import setCurrentUser
// shadcn/ui
import { ScrollArea } from "~/components/ui/scroll-area";
import { AppSidebar } from "~/components/Sidebar";
import { Button } from "~/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
// components
import ContentFooter from "~/components/ContentFooter";
import Contents from "~/components/Contents";
import GoTopButton from "~/components/GoTopButton";
// helpers
import { migrateContentToFirestore } from "~/script/migrateContent";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "~/lib/firebase";

export default function LectureLayout() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom); // Use useAtom for currentUser
  const [{ data: contents }] = useAtom(contentsQueryAtom);

  const lectureId = useParams().id;

  const [headerTitle, setHeaderTitle] = useState("");

  useEffect(() => {
    if (!lectureId || !contents) return;
    const foundContent = contents.find((item) => item.id === lectureId);
    if (foundContent) {
      setHeaderTitle(foundContent.title);
    }
  }, [lectureId, contents]);

  const handleQuizCompletion = async (contentId: string) => {
    if (!currentUser) return;

    try {
      // Check if already completed to avoid unnecessary Firestore writes and state updates
      if (currentUser.contentStatus.has(contentId)) {
        console.log(`Content ${contentId} already marked as complete.`);
        return;
      }

      // Create a document in the contentStatus subcollection
      const contentStatusDocRef = doc(
        firestore,
        'users',
        currentUser.uid,
        'contentStatus',
        contentId,
      );
      await setDoc(contentStatusDocRef, {
        createdAt: serverTimestamp(),
      });

      // Update local state
      const updatedContentStatus = new Set(currentUser.contentStatus).add(
        contentId,
      );

      setCurrentUser({
        ...currentUser,
        contentStatus: updatedContentStatus,
      });

      console.log(`Content ${contentId} marked as complete successfully.`);
    } catch (error) {
      console.error('Error marking content as complete:', error);
      alert('コンテンツ完了処理中にエラーが発生しました。');
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div
        id="content-scroll"
        className="relative flex h-screen w-full overflow-scroll"
      >
        <AppSidebar />

        <SidebarInset className="flex flex-1 flex-col">
          <header className="sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 z-10 bg-white">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="font-semibold">{headerTitle}</div>
            </div>
            {/* 임시 마이그레이션 버튼 */}
            <Button onClick={migrateContentToFirestore} variant="outline">
              Migrate Data
            </Button>
          </header>

          <ScrollArea className="flex-1">
            <main className="flex flex-col gap-4 items-center justify-center mx-auto max-w-4xl p-6 md:p-10">
              <Contents lectureId={lectureId} onQuizComplete={handleQuizCompletion} />
              <ContentFooter />
            </main>
          </ScrollArea>
        </SidebarInset>
        <GoTopButton />
      </div>
    </SidebarProvider>
  );
}
