// react
import { useState } from "react";
// atoms
import { useAtom, useAtomValue } from "jotai";
import { currentUserAtom } from "~/data/userData";
import { noticeAtom, type Notice } from "~/data/noticeData";
// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
// components
import HomeNoticeDetail from "./HomeNoticeDetail";
import HomeNoticeDialog from "./HomeNoticeDialog";
import { BackgroundSpinner } from "../Common/BackgroundSpinner";
// i18n
import { useTranslation } from "react-i18next";

export default function HomeNotice() {
  const { t } = useTranslation();

  const currentUser = useAtomValue(currentUserAtom);

  const [{ data: notices, isPending }] = useAtom(noticeAtom);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const [open, setOpen] = useState(false);

  if (isPending) return <BackgroundSpinner />;

  return (
    <>
      <Card className="w-1/3 max-w-1/3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Notice</CardTitle>

          {/* 공지 추가 모달 - 관리자 및 강사만 접근 가능 */}
          {(currentUser?.authority === "admin" ||
            currentUser?.authority === "instructor") && (
            <HomeNoticeDialog
              open={open}
              setOpen={setOpen}
              isAdd={true}
              titleProps=""
              contentProps=""
              isImportantProps={false}
            />
          )}
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-50 pr-4">
            <div className="space-y-3">
              {notices?.map((notice) => (
                <Card
                  key={notice.id}
                  onClick={() => setSelectedNotice(notice)}
                  className="cursor-pointer rounded-md border p-3 hover:bg-muted"
                >
                  <div className="flex items-center gap-2">
                    {notice.isImportant && (
                      <Badge variant="destructive">
                        {t("notice.notice_important")}
                      </Badge>
                    )}
                    {notice.isNew && <Badge variant="secondary">NEW</Badge>}
                  </div>

                  <div className="font-medium">{notice.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {notice.createdAt.toLocaleDateString()}
                  </div>
                </Card>
              ))}

              {notices?.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-10">
                  {t("notice.notice_empty")}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 공지 상세 모달 */}
      <HomeNoticeDetail
        selectedNotice={selectedNotice}
        setSelectedNotice={setSelectedNotice}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
