// react
import { useState } from 'react';
// atoms
import { useSetAtom } from 'jotai';
import { refetchAtom } from '~/data/commonData';
// shadcn/ui
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Checkbox } from '~/components/ui/checkbox';
import { toast } from 'sonner';
// icons
import { Pencil, Plus } from 'lucide-react';
// helpers
import { addNotice, editNotice } from '~/lib/firestore_utils';
// i18n
import { useTranslation } from 'react-i18next';
import type { Notice } from '~/data/noticeData';

interface HomeNoticeDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAdd: boolean;
  titleProps: string;
  contentProps: string;
  isImportantProps: boolean;
  noticeId?: string;
  onCloseDetail?: (notice: Notice | null) => void;
}

export default function HomeNoticeDialog({
  open,
  setOpen,
  isAdd,
  titleProps,
  contentProps,
  isImportantProps,
  noticeId,
  onCloseDetail,
}: HomeNoticeDialogProps) {
  const { t } = useTranslation();

  const [title, setTitle] = useState(isAdd ? '' : titleProps);
  const [content, setContent] = useState(isAdd ? '' : contentProps);
  const [isImportant, setIsImportant] = useState(
    isAdd ? false : isImportantProps,
  );
  const [loading, setLoading] = useState(false);

  const setRefetch = useSetAtom(refetchAtom);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.success(t('notice.notice_title_detail'));
      return;
    }

    try {
      setLoading(true);
      if (isAdd) {
        await addNotice(title, content, true, isImportant);
        toast(t('notice.notice_add_success'));
      } else {
        if (noticeId) {
          await editNotice(noticeId, { title, content, isImportant });
          toast(t('notice.notice_edit_success'));
        } else {
          console.error('Notice ID is missing for editing.');
          toast.error(t('notice.notice_edit_fail')); // Assuming you have an error toast for this case
        }
      }
      onCloseDetail && onCloseDetail(null);
      setOpen(false);
      setTitle('');
      setContent('');
      setIsImportant(false);
      setRefetch((prev) => prev + 1);
    } catch (e) {
      toast(t('notice.notice_add_fail'));
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          {isAdd ? (
            <Plus className="w-4 h-4" />
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-1" />
              {t('common.edit')}
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isAdd ? t('notice.notice_add') : t('notice.notice_edit')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">{t('notice.notice_title')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('notice.notice_title_detail')}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="content">{t('notice.notice_content')}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('notice.notice_content_detail')}
              rows={6}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="important"
              checked={isImportant}
              onCheckedChange={(checked) => setIsImportant(checked === true)}
            />
            <Label htmlFor="important">{t('notice.notice_important')}</Label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {t('common.register')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
