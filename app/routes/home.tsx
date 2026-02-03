// react-router
import { Navigate, useNavigate } from "react-router";
import type { Route } from "./+types/home";
// atoms
import { useAtom, useAtomValue } from "jotai";
import { currentUserAtom } from "~/data/userData";
import { contentsQueryAtom } from "~/data/contentData";
// shadcn/ui
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import { Separator } from "~/components/ui/separator";
// components
import HomeSelectCourse from "~/components/Home/HomeSelectCourse";
import HomeNotice from "~/components/Home/HomeNotice";
// icons
import { FaReact } from "react-icons/fa";
import { BookOpen, MessagesSquare } from "lucide-react";
// styles
import { H1_STYLE, H3_STYLE } from "~/style/commonStyle";
import { SEPERATOR_STYLE } from "~/style/homeStyle";
// helpers
import { getFirstContentId } from "~/helper/helper";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Learning by Ryan" },
    { name: "React Learning", content: "Welcome to React Learning App!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const currentUser = useAtomValue(currentUserAtom);
  // const [{ data: contents }] = useAtom(contentsQueryAtom);
  const contents = useAtomValue(contentsQueryAtom);

  const handleClick = () => {
    if (contents) {
      const firstContentId = getFirstContentId(contents);
      if (firstContentId) {
        navigate(`/contents/${firstContentId}`);
      }
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!contents) {
    return (
      <main className="p-8 flex flex-col justify-center items-center gap-2">
        <p>コンテンツを読み込み中...</p>
      </main>
    );
  }

  return (
    <main className="p-8 flex flex-col justify-center items-center gap-2">
      {/* 메인화면 - 헤더 */}
      <h1 className={`${H1_STYLE}` + " flex items-center gap-3 tracking-wide"}>
        <FaReact id="react-icon" className="text-blue-600 animate-spin" />
        <span>React Learning</span>
      </h1>

      <Separator className={SEPERATOR_STYLE} />

      {/* 메인화면 - 환영인사 & 강의코스 선택 */}
      {currentUser && (
        <>
          <h3 className={`${H3_STYLE}`}>ようこそ {currentUser?.name}さん!</h3>
          <HomeSelectCourse />
        </>
      )}

      <Separator className={SEPERATOR_STYLE} />

      {/* 메인화면 - 공지사항 */}
      <HomeNotice />

      <Separator className={SEPERATOR_STYLE} />

      {/* 메인화면 - 버튼그룹 */}
      <ButtonGroup className="gap-2">
        <Button onClick={handleClick}>
          <BookOpen className="w-4 h-4 mr-2" />
          <span>React学習</span>
        </Button>
        <Button onClick={() => navigate("/community")}>
          <MessagesSquare className="w-4 h-4 mr-2" />
          <span>コミュニティ</span>
        </Button>
      </ButtonGroup>
    </main>
  );
}
