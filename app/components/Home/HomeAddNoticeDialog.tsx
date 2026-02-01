import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";

import { addNotice } from "~/lib/firestore_utils";
import { confirm } from "~/helper/confirm";
import { useSetAtom } from "jotai";
import { refetchAtom } from "~/data/commonData";

export default function HomeAddNoticeDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [loading, setLoading] = useState(false);

  const setRefetch = useSetAtom(refetchAtom);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      await confirm({
        icon: 1,
        message: "タイトルと内容を入力してください。",
        size: "sm",
      });
      return;
    }

    try {
      setLoading(true);

      await addNotice(title, content, true, isImportant);
      await confirm({
        icon: 0,
        message: "お知らせが登録されました。",
        size: "sm",
      });
      setOpen(false);
      setTitle("");
      setContent("");
      setIsImportant(false);
      setRefetch((prev) => prev + 1);
    } catch (e) {
      await confirm({
        icon: 2,
        message: "お知らせの登録に失敗しました。",
        size: "sm",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>공지사항 작성</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지 제목을 입력하세요"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="공지 내용을 입력하세요"
              rows={6}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="important"
              checked={isImportant}
              onCheckedChange={(checked) => setIsImportant(checked === true)}
            />
            <Label htmlFor="important">중요 공지</Label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
