// react
import { useEffect, useState } from "react";
// react-router
import { Navigate } from "react-router";
// atoms
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import { currentUserAtom } from "~/data/userData";
import { refetchAtom } from "~/data/commonData";
import { postOrderAtom, postsAtom, type PostType } from "~/data/postData";
// shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { toast } from "sonner";
// components
import { BackgroundSpinner } from "~/components/Common/BackgroundSpinner";
import { CommunityHeader } from "~/components/Community/CommunityHeader";
import { CommunityPost } from "~/components/Community/CommunityPost";
import CommunityPostForm from "~/components/Community/CommunityPostForm";
// helpers
import { addPost, deletePost, likePost, updatePost } from "~/data/postApi";
// i18n
import { useTranslation } from "react-i18next";

function Community() {
  const currentUser = useAtomValue(currentUserAtom);
  const setRefetch = useSetAtom(refetchAtom);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [editingPost, setEditingPost] = useState<PostType | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [postOrder, setPostOrder] = useAtom(postOrderAtom);

  const [{ data: initialPosts, isPending }] = useAtom(postsAtom);

  const { t } = useTranslation();

  useEffect(() => {
    if (!initialPosts) return;

    const sortPosts = async () => {
      await Promise.resolve();

      let sortedPosts = [...initialPosts];

      if (postOrder === "new") {
        sortedPosts.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
      } else if (postOrder === "popular") {
        sortedPosts.sort((a, b) => b.likeCount - a.likeCount);
      }

      setPosts(sortedPosts);
    };

    sortPosts();
  }, [initialPosts, postOrder]);

  const handleDelete = async (post: PostType) => {
    try {
      await deletePost(post);
      setRefetch((c) => c + 1);

      toast.success("ポストが削除されました");
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const handleSave = async (
    post: Omit<PostType, "id" | "createdAt" | "likeCount" | "likedUsers"> & {
      userId: string;
    },
  ) => {
    if (editingPost) {
      await updatePost(editingPost.id, editingPost, post);
    } else {
      await addPost(post, post.userId || "Anonymous");
    }

    setRefetch((c) => c + 1);
    toast.success(`ポストが${editingPost ? "更新" : "作成"}されました`);
  };

  const isNewPost = (post: PostType) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return post.createdAt >= oneWeekAgo;
  };

  const handleClickLikeButton = async (post: PostType) => {
    if (!currentUser) return;

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1,
              isLiked: !p.isLiked,
            }
          : p,
      ),
    );

    try {
      await likePost(post.id, currentUser.uid);
    } catch (err) {
      console.error("Like update failed, reverting:", err);
      // On error, refetch from the server to get the correct state
      setRefetch((c) => c + 1);
    }
  };

  if (isPending) return <BackgroundSpinner />;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    /* 전체 배경 + 양옆 여백 */
    <div className="min-h-screen w-full bg-muted/40">
      <div className="flex justify-center">
        {/* 중앙 쇼츠 피드 */}
        <main className="w-full max-w-xl md:max-w-2xl px-4 py-10 space-y-10">
          {/* 상단 액션 바 */}
          <CommunityHeader
            postOrder={postOrder}
            setPostOrder={setPostOrder}
            setEditingPost={setEditingPost}
            setShowForm={setShowForm}
          />
          {/* 게시글 피드 */}
          <CommunityPost
            posts={posts}
            handleClickLikeButton={handleClickLikeButton}
            handleDelete={handleDelete}
            setEditingPost={setEditingPost}
            setShowForm={setShowForm}
            isNewPost={isNewPost}
          />
        </main>
      </div>

      {/* 게시글 작성 / 수정 다이얼로그 */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          aria-describedby={t("community.community_post_add_label")}
        >
          <DialogHeader>
            <DialogTitle>
              {editingPost
                ? t("community.community_post_edit_label")
                : t("community.community_post_add_label")}
            </DialogTitle>
          </DialogHeader>

          <CommunityPostForm
            editPost={editingPost}
            onClose={() => setShowForm(false)}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CommunityPage() {
  return <Community />;
}
