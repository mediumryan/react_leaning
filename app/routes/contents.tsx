// react
import { useEffect } from 'react';
// react-router
import { Navigate, useParams } from 'react-router';
// atoms
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { authLoadingAtom, currentUserAtom } from '~/data/userData';
import {
  displayedCorrectAnswerAtom,
  isCorrectAtom,
  isSubmittedAtom,
  showFeedbackAtom,
  userAnswersAtom,
} from '~/data/quizData';
import { contentsAtom } from '~/data/contentData';
// shadcn/ui
import { ScrollArea } from '~/components/ui/scroll-area';
import { Button } from '~/components/ui/button';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar';
// components
import ContentFooter from '~/components/Contents/ContentFooter';
import Contents from '~/components/Contents/Contents';
import { AppSidebar } from '~/components/Contents/Sidebar';
import { LanguageSwitcher } from '~/components/Common/LanguageSwitcher';
import GoTopButton from '~/components/Contents/GoTopButton';
// helpers
import { migrateContentToFirestore } from '~/script/migrateContent';

export default function LectureLayout() {
  const currentUser = useAtomValue(currentUserAtom);

  const lectureId = useParams().id;

  const contents = useAtomValue(contentsAtom);

  const setIsLoading = useSetAtom(authLoadingAtom);

  const currentLecture = contents.find((item) => item.id === lectureId);
  const headerTitle = currentLecture?.title || '';

  const setUserAnswer = useSetAtom(userAnswersAtom);
  const setIsSubmitted = useSetAtom(isSubmittedAtom);
  const setIsCorrect = useSetAtom(isCorrectAtom);
  const setShowFeedback = useSetAtom(showFeedbackAtom);
  const setDisplayedCorrectAnswer = useSetAtom(displayedCorrectAnswerAtom);

  const resetQuizState = () => {
    setUserAnswer('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowFeedback(false);
    setDisplayedCorrectAnswer('');
  };

  useEffect(() => {
    if (!lectureId || !contents) return;
    resetQuizState();
  }, [lectureId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="relative flex h-screen w-full">
        <AppSidebar />

        <SidebarInset className="flex flex-1 flex-col">
          <div id="contentScroll" className="flex-1 max-h-screen">
            <header className="sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 z-10 bg-white">
              {/* <LanguageSwitcher /> */}
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <div className="font-semibold">{headerTitle}</div>
              </div>
              {/* 임시 마이그레이션 버튼
              <Button onClick={migrateContentToFirestore} variant="outline">
                Migrate Data
              </Button> */}
            </header>

            <ScrollArea>
              <div className="h-full flex flex-col gap-4 items-center justify-center mx-auto max-w-4xl p-6 md:p-10">
                <Contents lectureId={lectureId} />
                <ContentFooter currentLecture={currentLecture} />
              </div>
            </ScrollArea>
          </div>
        </SidebarInset>
        <GoTopButton />
      </div>
    </SidebarProvider>
  );
}
