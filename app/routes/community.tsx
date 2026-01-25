// components/PostList.tsx
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { HeartIcon, PlusIcon } from "lucide-react";

// shadcn/ui
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { postAtom, type PostType } from "~/data/postData";
import PostForm from "~/components/PostForm";
import { Navigate } from "react-router";
import { currentUserAtom } from "~/data/userData";

export default function Community() {
  const currentUser = useAtomValue(currentUserAtom);

  const [posts, setPosts] = useAtom(postAtom);
  const [editingPost, setEditingPost] = useState<PostType | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setPosts(posts.filter((p) => p.id !== id));
  };

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
          <div className="flex justify-end">
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                setEditingPost(null);
                setShowForm(true);
              }}
            >
              <PlusIcon className="w-4 h-4" />
              게시글 작성
            </Button>
          </div>

          {/* 게시글 피드 */}
          {posts.map((post) => (
            <Card key={post.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{post.title}</span>
                  <div className="text-sm flex flex-col items-end space-y-0.5">
                    <span>{post.name}</span>
                    <span>{post.createdAt.toLocaleDateString()}</span>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{post.content}</p>

                {post.projectLink && (
                  <a
                    href={post.projectLink}
                    target="_blank"
                    className="text-sm text-blue-600 underline"
                  >
                    프로젝트 링크
                  </a>
                )}

                {post.imageUrl && (
                  <div className="aspect-video overflow-hidden rounded-md">
                    <img
                      src={post.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <HeartIcon className="w-4 h-4" />
                  {post.like}
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingPost(post);
                      setShowForm(true);
                    }}
                  >
                    수정
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    삭제
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </main>
      </div>

      {/* 게시글 작성 / 수정 다이얼로그 */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "게시글 수정" : "게시글 작성"}
            </DialogTitle>
          </DialogHeader>

          <PostForm editPost={editingPost} onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
