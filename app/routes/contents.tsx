import { Content } from '@radix-ui/react-dialog';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AppSidebar } from '~/components/app-sidebar';
import ContentFooter from '~/components/ContentFooter';
import Contents from '~/components/Contents';
import GoTopButton from '~/components/GoTopButton';
import { HeaderMenu } from '~/components/header-menu';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar';
import { CONTENT_DATA, contentStatusAtom } from '~/data/data';

export default function LectureLayout() {
  const lectureId = useParams().id;

  const data = CONTENT_DATA;

  const [contentStatus, setContentStatus] = useAtom(contentStatusAtom);

  const [headerTitle, setHeaderTitle] = useState('');

  useEffect(() => {
    if (isNaN(Number(lectureId))) return;
    // lectureId와 강의 데이터 중 course값이 일치하는 항목의 title값을 찾아 헤더 타이틀로 설정한다.
    for (const section of data) {
      const found = section.sub_contents.find(
        (item) => item.course === Number(lectureId),
      );
      if (found) {
        setHeaderTitle(found.title);
        break;
      }
    }
  }, [lectureId]);

  return (
    <SidebarProvider>
      <div
        id="content-scroll"
        className="relative flex h-screen w-full overflow-scroll"
      >
        {/* 1. 왼쪽 강의 네비게이션 (전체 넓이의 1/5 수준으로 설정 가능) */}
        <AppSidebar />

        {/* 2. 오른쪽 강의 내용 영역 */}
        <SidebarInset className="flex flex-1 flex-col">
          {/* 상단바: 모바일용 사이드바 토글 및 현재 강의 제목 */}
          <header className="sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 z-10 bg-white">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="font-semibold">{headerTitle}</div>
            </div>
          </header>

          {/* 메인 강의 콘텐츠 스크롤 영역 */}
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
