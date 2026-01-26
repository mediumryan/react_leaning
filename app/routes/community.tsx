import { Suspense, useEffect, useState } from 'react';
// atoms
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { postsAtom, refetchAtom, type PostType } from '~/data/postData';
// shadcn/ui
import { Button } from '~/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { ButtonGroup } from '~/components/ui/button-group';
import { Badge } from '~/components/ui/badge';
// icons
import { HeartIcon, PlusIcon } from 'lucide-react';
// components
import PostForm from '~/components/PostForm';
// helpers
import { confirm } from '~/helper/confirm';
import { Skeleton } from '~/components/ui/skeleton';
import { addPost, deletePost, updatePost } from '~/data/postApi';

function Community() {
  const initialPosts = useAtomValue(postsAtom);
  const setRefetch = useSetAtom(refetchAtom);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [editingPost, setEditingPost] = useState<PostType | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [postOrder, setPostOrder] = useState<'new' | 'popular'>('new');

  useEffect(() => {
    if (initialPosts) {
      setPosts(
        [...initialPosts].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        ),
      );
    }
  }, [initialPosts]);

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      icon: 1,
      message: '削除しますか？',
      size: 'sm',
    });

    if (!ok) return;
    await deletePost(id);
    setRefetch((c) => c + 1);
  };

  const handleSave = async (
    post: Omit<PostType, 'id' | 'createdAt' | 'like' | 'likedUsers'>,
  ) => {
    if (editingPost) {
      await updatePost(editingPost.id, post);
    } else {
      await addPost(post);
    }
    setRefetch((c) => c + 1);
  };

  const handleClickShowNewPost = () => {
    setPosts(
      [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    );
    setPostOrder('new');
  };

  const handleClickShowPopularPost = () => {
    setPosts([...posts].sort((a, b) => b.like - a.like));
    setPostOrder('popular');
  };

  const isNewPost = (post: PostType) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return post.createdAt >= oneWeekAgo;
  };

  return (
    /* 전체 배경 + 양옆 여백 */
    <div className="min-h-screen w-full bg-muted/40">
      <div className="flex justify-center">
        {/* 중앙 쇼츠 피드 */}
        <main className="w-full max-w-xl md:max-w-2xl px-4 py-10 space-y-10">
          {/* 상단 액션 바 */}
          <div className="flex justify-between items-center">
            <ButtonGroup className="gap-0.5">
              <Button
                onClick={handleClickShowNewPost}
                className={postOrder === 'new' ? 'bg-blue-500 text-white' : ''}
              >
                最新
              </Button>
              <Button
                onClick={handleClickShowPopularPost}
                className={
                  postOrder === 'popular' ? 'bg-blue-500 text-white' : ''
                }
              >
                人気
              </Button>
            </ButtonGroup>
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                setEditingPost(null);
                setShowForm(true);
              }}
            >
              <PlusIcon className="w-4 h-4" />
              ポスト作成
            </Button>
          </div>

          {/* 게시글 피드 */}
          {posts.map((post) => (
            <Card key={post.id} className="shadow-sm relative">
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
                    プロジェクトリンク
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
                    修正
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    削除
                  </Button>
                </div>
              </CardFooter>
              {isNewPost(post) && (
                <Badge className="absolute top-0 left-0 animate-bounce">
                  New
                </Badge>
              )}
            </Card>
          ))}
        </main>
      </div>

      {/* 게시글 작성 / 수정 다이얼로그 */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'ポスト修正' : 'ポスト作成'}
            </DialogTitle>
          </DialogHeader>

          <PostForm
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
  return (
    <Suspense
      fallback={
        <div className="p-12 flex flex-col gap-4">
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-full h-40" />
        </div>
      }
    >
      <Community />
    </Suspense>
  );
}
