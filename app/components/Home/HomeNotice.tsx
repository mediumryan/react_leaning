import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { useAtom, useAtomValue } from "jotai";
import { currentUserAtom } from "~/data/userData";
import { noticeAtom, type Notice } from "~/data/noticeData";
import HomeAddNoticeDialog from "./HomeAddNoticeDialog";
import { BackgroundSpinner } from "../BackgroundSpinner";
import HomeNoticeDetail from "./HomeNoticeDetail";

export default function HomeNotice() {
  const currentUser = useAtomValue(currentUserAtom);

  const [{ data: notices, isPending }] = useAtom(noticeAtom);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  if (isPending) return <BackgroundSpinner />;

  return (
    <>
      <Card className="w-1/3 max-w-1/3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Notice</CardTitle>

          {/* 공지 추가 모달 - 관리자 및 강사만 접근 가능 */}
          {(currentUser?.authority === "admin" ||
            currentUser?.authority === "instructor") && <HomeAddNoticeDialog />}
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-50 pr-4">
            <ul className="space-y-3">
              {notices?.map((notice) => (
                <li
                  key={notice.id}
                  onClick={() => setSelectedNotice(notice)}
                  className="cursor-pointer rounded-md border p-3 hover:bg-muted"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {notice.isImportant && (
                      <Badge variant="destructive">중요</Badge>
                    )}
                    {notice.isNew && <Badge variant="secondary">NEW</Badge>}
                  </div>

                  <div className="font-medium">{notice.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {notice.createdAt.toLocaleDateString()}
                  </div>
                </li>
              ))}

              {notices?.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-10">
                  등록된 공지사항이 없습니다.
                </div>
              )}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 공지 상세 모달 */}
      <HomeNoticeDetail
        selectedNotice={selectedNotice}
        setSelectedNotice={setSelectedNotice}
      />
    </>
  );
}
