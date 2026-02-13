// react
import { useState } from "react";
// atoms
import { useAtomValue } from "jotai";
import { currentUserAtom } from "~/data/userData";
import type { PostType } from "~/data/postData";
// icons
import { HeartIcon } from "lucide-react";
// shadcn/ui
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { CardFooter } from "~/components/ui/card";
// components
import { CommonAlert } from "../Common/ConfirmDialog";
// i18n
import { useTranslation } from "react-i18next";

interface CommunityPostFooterProps {
  post: PostType;
  setEditingPost: (post: PostType | null) => void;
  setShowForm: (show: boolean) => void;
  handleClickLikeButton: (post: PostType) => void;
  handleDelete: (post: PostType) => void;
  isNewPost: (post: PostType) => boolean;
}

export const CommunityPostFooter = ({
  post,
  setEditingPost,
  setShowForm,
  handleClickLikeButton,
  handleDelete,
  isNewPost,
}: CommunityPostFooterProps) => {
  const { t } = useTranslation();

  const currentUser = useAtomValue(currentUserAtom);

  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const handleClick = (post: PostType) => {
    handleClickLikeButton(post);
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 300);
  };

  return (
    <>
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleClick(post)}
        >
          <HeartIcon
            className={`w-4 h-4 ${isHeartAnimating ? "animate-ping" : ""}`}
            fill={post.isLiked ? "red" : "none"}
          />
          {post.likeCount}
        </Button>

        {(currentUser?.authority === "admin" ||
          currentUser?.authority === "instructor" ||
          currentUser?.uid === post.userId) && (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setEditingPost(post);
                setShowForm(true);
              }}
            >
              {t("common.edit")}
            </Button>
            <CommonAlert
              buttonLabel={t("common.delete")}
              triggerVariant="destructive"
              triggerDisabled={false}
              triggerSize="sm"
              title={t("community.community_post_delete_confirm")}
              titleWithIcon="warning"
              cancleButtonLabel={t("common.cancel")}
              confirmButtonLabel={t("common.delete")}
              onConfirm={() => handleDelete(post)}
            />
          </div>
        )}
      </CardFooter>
      {isNewPost(post) && (
        <Badge className="absolute top-0 left-0 animate-bounce">New</Badge>
      )}
    </>
  );
};

export default CommunityPostFooter;
