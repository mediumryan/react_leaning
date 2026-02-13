// atoms
import type { PostType } from "~/data/postData";
// shadcn/ui
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
// icons
import { PlusIcon } from "lucide-react";
// i18n
import { useTranslation } from "react-i18next";

interface CommunityHeaderProps {
  postOrder: "new" | "popular";
  setPostOrder: (order: "new" | "popular") => void;
  setEditingPost: (post: PostType | null) => void;
  setShowForm: (show: boolean) => void;
}

export const CommunityHeader = ({
  postOrder,
  setPostOrder,
  setEditingPost,
  setShowForm,
}: CommunityHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center">
      <ButtonGroup className="gap-0.5">
        <Button
          onClick={() => setPostOrder("new")}
          variant={postOrder === "new" ? "default" : "secondary"}
        >
          {t("community.community_button_new")}
        </Button>
        <Button
          onClick={() => setPostOrder("popular")}
          variant={postOrder === "popular" ? "default" : "secondary"}
        >
          {t("community.community_button_popular")}
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
        {t("community.community_button_add_post")}
      </Button>
    </div>
  );
};
