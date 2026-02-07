// atoms
import { useAtomValue, useSetAtom } from 'jotai';
import { currentUserAtom } from '~/data/userData';
import { type Notice } from '~/data/noticeData';
import { refetchAtom } from '~/data/commonData';
// shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
// icons
import { Trash2 } from 'lucide-react';
// helpers
import { deleteNotice } from '~/lib/firestore_utils';
// i18n
import { useTranslation } from 'react-i18next';
import { CommonAlert } from '../ConfirmDialog';
import { toast } from 'sonner';
import HomeNoticeDialog from './HomeNoticeDialog';

interface HomeNoticeDetailProps {
  selectedNotice: Notice | null;
  setSelectedNotice: (notice: Notice | null) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HomeNoticeDetail({
  selectedNotice,
  setSelectedNotice,
  open,
  setOpen,
}: HomeNoticeDetailProps) {
  const { t } = useTranslation();

  const currentUser = useAtomValue(currentUserAtom);
  const setRefetch = useSetAtom(refetchAtom);

  const handleDeleteNotice = async () => {
    if (!selectedNotice) return;

    try {
      await deleteNotice(selectedNotice.id);
      toast.success(t('notice.notice_delete_success'));

      setSelectedNotice(null);
      setRefetch((prev) => prev + 1);
    } catch (e) {
      toast.error(t('notice.notice_delete_fail'));
      console.error(e);
      return;
    }
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
            {(currentUser?.authority === 'admin' ||
              currentUser?.authority === 'instructor') && (
              <DialogFooter className="flex justify-end gap-2">
                <HomeNoticeDialog
                  open={open}
                  setOpen={setOpen}
                  isAdd={false}
                  titleProps={selectedNotice.title}
                  contentProps={selectedNotice.content}
                  isImportantProps={selectedNotice.isImportant ?? false}
                  noticeId={selectedNotice.id}
                  onCloseDetail={setSelectedNotice}
                />
                <CommonAlert
                  buttonLabel={
                    <>
                      <Trash2 className="w-4 h-4 mr-1" />
                      {t('common.delete')}
                    </>
                  }
                  triggerVariant="destructive"
                  triggerDisabled={false}
                  triggerSize="sm"
                  title={t('notice.notice_delete_confirm')}
                  titleWithIcon="warning"
                  cancleButtonLabel={t('common.cancel')}
                  confirmButtonLabel={t('common.delete')}
                  onConfirm={handleDeleteNotice}
                />
              </DialogFooter>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
