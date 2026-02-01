import type { Notice } from "~/data/noticeData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Trash2, Pencil } from "lucide-react";
import { deleteNotice } from "~/lib/firestore_utils";
import { useAtomValue, useSetAtom } from "jotai";
import { currentUserAtom } from "~/data/userData";
import { confirm } from "~/helper/confirm";
import { refetchAtom } from "~/data/commonData";
import { Alert, AlertTitle } from "../ui/alert";

interface HomeNoticeDetailProps {
  selectedNotice: Notice | null;
  setSelectedNotice: (notice: Notice | null) => void;
}

export default function HomeNoticeDetail({
  selectedNotice,
  setSelectedNotice,
}: HomeNoticeDetailProps) {
  const currentUser = useAtomValue(currentUserAtom);
  const setRefetch = useSetAtom(refetchAtom);

  const handleDeleteNotice = async () => {
    if (!selectedNotice) return;

    const ok = await confirm({
      icon: 1,
      message: "このお知らせを削除しますか？",
      size: "sm",
    });

    if (!ok) return;

    try {
      await deleteNotice(selectedNotice.id);
      await confirm({
        icon: 1,
        message: "お知らせが削除されました。",
        size: "sm",
      }).then(() => {});

      await rendingAlert();

      setSelectedNotice(null);
      setRefetch((prev) => prev + 1);
    } catch (e) {
      await confirm({
        icon: 0,
        message: "お知らせの削除に失敗しました。",
        size: "sm",
      }).then(() => {});

      return;
    }
  };

  const rendingAlert = async () => {
    return (
      <Alert>
        <AlertTitle>お知らせが削除されました。</AlertTitle>
      </Alert>
    );
  };

  return (
    <Dialog
      open={!!selectedNotice}
      onOpenChange={() => setSelectedNotice(null)}
    >
      <DialogContent className="max-w-lg">
        {selectedNotice && (
          <>
            <DialogHeader>
              <DialogTitle>{selectedNotice.title}</DialogTitle>
            </DialogHeader>

            <div className="text-sm text-muted-foreground mb-4">
              {selectedNotice.createdAt.toLocaleDateString()}
            </div>

            <div className="whitespace-pre-wrap text-sm mb-6">
              {selectedNotice.content}
            </div>

            {/* 관리자 / 강사 전용 액션 */}
            {(currentUser?.authority === "admin" ||
              currentUser?.authority === "instructor") && (
              <DialogFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // 수정 다이얼로그 열기
                    console.log("edit notice");
                  }}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  修正
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteNotice}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  削除
                </Button>
              </DialogFooter>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
