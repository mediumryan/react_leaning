// atoms
import type { PostType } from "~/data/postData";
// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CommunityPostFooter } from "./CommunityPostFooter";
import { useTranslation } from "react-i18next";

interface CommunityPostProps {
  posts: PostType[];
  handleClickLikeButton: (post: PostType) => void;
  handleDelete: (post: PostType) => void;
  setEditingPost: (post: PostType | null) => void;
  setShowForm: (show: boolean) => void;
  isNewPost: (post: PostType) => boolean;
}

export const CommunityPost = ({
  posts,
  handleClickLikeButton,
  handleDelete,
  setEditingPost,
  setShowForm,
  isNewPost,
}: CommunityPostProps) => {
  const { t } = useTranslation();

  return (
    <>
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
                className="text-sm text-blue-600 underline font-bold italic"
              >
                {t("community.community_post_link")}
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
          <CommunityPostFooter
            post={post}
            setEditingPost={setEditingPost}
            setShowForm={setShowForm}
            handleClickLikeButton={handleClickLikeButton}
            handleDelete={handleDelete}
            isNewPost={isNewPost}
          />
        </Card>
      ))}
    </>
  );
};

export default CommunityPost;
