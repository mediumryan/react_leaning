// react
import { useState } from "react";
// atoms
import { useAtomValue } from "jotai";
import { currentUserAtom } from "~/data/userData";
import type { PostType } from "~/data/postData";
// icons
import { HeartIcon } from "lucide-react";
// shadcn/ui
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CardFooter } from "../ui/card";
// components
import { CommonAlert } from "../ConfirmDialog";

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
              修正
            </Button>
            <CommonAlert
              buttonLabel="削除"
              triggerVariant="destructive"
              triggerDisabled={false}
              triggerSize="sm"
              title="投稿を削除しますか？"
              titleWithIcon="warning"
              cancleButtonLabel="いいえ"
              confirmButtonLabel="削除"
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
