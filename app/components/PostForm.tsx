// react
import { useState } from "react";
// types
import type { PostType } from "~/data/postData";
// shadcn/ui
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
// helpers
import { confirm } from "~/helper/confirm";

interface PostFormProps {
  editPost: PostType | null;
  onClose: () => void;
  onSave: (
    post: Omit<PostType, "id" | "createdAt" | "like" | "likedUsers">,
  ) => void;
}

export default function PostForm({ editPost, onClose, onSave }: PostFormProps) {
  const [title, setTitle] = useState(editPost?.title || "");
  const [content, setContent] = useState(editPost?.content || "");
  const [projectLink, setProjectLink] = useState(editPost?.projectLink || "");
  const [imageUrl, setImageUrl] = useState(editPost?.imageUrl || "");

  const handleSave = async () => {
    if (!title.trim()) {
      await confirm({
        icon: 0,
        message: "タイトルを入力してください。",
        size: "sm",
      });
      return;
    }

    onSave({
      title,
      content,
      projectLink,
      imageUrl,
      name: "Anonymous", // or get from auth
    });

    onClose();
  };

  return (
    <div className="space-y-4">
      {/* 제목 */}
      <div className="space-y-1">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 내용 */}
      <div className="space-y-1">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          placeholder="게시글 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
      </div>

      {/* 프로젝트 링크 */}
      <div className="space-y-1">
        <Label htmlFor="projectLink">프로젝트 링크</Label>
        <Input
          id="projectLink"
          placeholder="https://"
          value={projectLink}
          onChange={(e) => setProjectLink(e.target.value)}
        />
      </div>

      {/* 이미지 URL */}
      <div className="space-y-1">
        <Label htmlFor="imageUrl">이미지 URL</Label>
        <Input
          id="imageUrl"
          placeholder="이미지 URL (선택)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button onClick={handleSave}>{editPost ? "수정" : "저장"}</Button>
      </div>
    </div>
  );
}
