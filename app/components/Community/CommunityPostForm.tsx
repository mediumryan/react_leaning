// react
import { useState } from "react";
// atoms
import { useAtomValue } from "jotai";
import { currentUserAtom } from "~/data/userData";
// types
import type { PostType } from "~/data/postData";
// shadcn/ui
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
// helpers
import { confirm } from "~/helper/confirm";
import { validateImageFile } from "~/helper/helper";
// firebase
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "~/lib/firebase";
import { toast } from "sonner";
// i18n
import { useTranslation } from "react-i18next";

interface PostFormProps {
  editPost: PostType | null;
  onClose: () => void;
  onSave: (
    post: Omit<PostType, "id" | "createdAt" | "likeCount" | "likedUsers"> & {
      userId: string;
    },
  ) => void;
}

const MAX_IMAGE_SIZE_MB = 0.5;
const ALLOWED_IMAGE_TYPES = ["jpeg", "png", "webp"];
const POST_FORM_TITLE_STYLE = "text-blue-500 mb-4";

export const CommunityPostForm = ({
  editPost,
  onClose,
  onSave,
}: PostFormProps) => {
  const { t } = useTranslation();

  const [title, setTitle] = useState(editPost?.title || "");
  const [content, setContent] = useState(editPost?.content || "");
  const [projectLink, setProjectLink] = useState(editPost?.projectLink || "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const currentUser = useAtomValue(currentUserAtom);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error(t("community.community_post_add_title_required"));
      return;
    }

    let imageUrl: string | null;

    // 🔥 이미지 업로드
    if (imageFile) {
      const imageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);

      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    } else {
      imageUrl = null;
    }

    onSave({
      title,
      content,
      projectLink,
      imageUrl,
      name: currentUser?.nickname || "Anonymous",
      userId: currentUser?.uid || "Anonymous",
    });

    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      await confirm({
        icon: 0,
        message: error,
        size: "sm",
      });
      e.target.value = ""; // 같은 파일 다시 선택 가능하게
      return;
    }

    setImageFile(file);
  };

  return (
    <div className="space-y-4">
      {/* 제목 */}
      <div className="space-y-1">
        <Label htmlFor="title" className={POST_FORM_TITLE_STYLE}>
          {t("community.community_post_add_title_label")}
        </Label>
        <Input
          id="title"
          placeholder={t("community.community_post_add_title_placeholder")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 내용 */}
      <div className="space-y-1">
        <Label htmlFor="content" className={POST_FORM_TITLE_STYLE}>
          {t("community.community_post_add_content_label")}
        </Label>
        <Textarea
          id="content"
          placeholder={t("community.community_post_add_content_placeholder")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
      </div>

      {/* 프로젝트 링크 */}
      <div className="space-y-1">
        <Label htmlFor="projectLink" className={POST_FORM_TITLE_STYLE}>
          {t("community.community_post_add_link_label")}
        </Label>
        <Input
          id="projectLink"
          placeholder="https://example.com"
          value={projectLink}
          onChange={(e) => setProjectLink(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image" className={POST_FORM_TITLE_STYLE}>
          {t("community.community_post_add_preview_label")}
        </Label>

        <Input
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
        />

        {/* helper text */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{t("community.community_post_add_upload_limit_label")}:</span>

          <Badge variant="secondary">
            {MAX_IMAGE_SIZE_MB}MB{" "}
            {t("community.community_post_add_upload_limit_mb")}
          </Badge>

          {ALLOWED_IMAGE_TYPES.map((type) => (
            <Badge key={type} variant="outline">
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button onClick={handleSave}>
          {editPost ? t("common.edit") : t("common.upload")}
        </Button>
      </div>
    </div>
  );
};

export default CommunityPostForm;
