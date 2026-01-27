import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { AppSidebar } from '~/components/Sidebar';
import ContentFooter from '~/components/ContentFooter';
import Contents from '~/components/Contents';
import GoTopButton from '~/components/GoTopButton';
import { Button } from '~/components/ui/button';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar';
import { contentsAtom } from '~/data/contentData';
import { currentUserAtom } from '~/data/userData';
import { migrateContentToFirestore } from '~/script/migrateContent';

export default function LectureLayout() {
  const currentUser = useAtomValue(currentUserAtom);
  const contents = useAtomValue(contentsAtom);

  const lectureId = useParams().id;

  const [headerTitle, setHeaderTitle] = useState('');

  useEffect(() => {
    console.log(contents);
    if (!lectureId || !contents) return;
    const foundContent = contents.find((item) => item.id === lectureId);
    if (foundContent) {
      setHeaderTitle(foundContent.title);
    }
  }, [lectureId, contents]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Add loading state for contents
  if (!contents) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>ローディング中...</p>
      </div>
    );
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
              <Contents lectureId={lectureId} />
              <ContentFooter />
            </main>
          </ScrollArea>
        </SidebarInset>
        <GoTopButton />
      </div>
    </SidebarProvider>
  );
}
