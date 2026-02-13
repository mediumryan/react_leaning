// react
import { useState } from "react";
// react-router
import { Link, useNavigate } from "react-router";
// atoms
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { authLoadingAtom, currentUserAtom } from "~/data/userData";
import { contentsAtom } from "~/data/contentData";
// icons
import {
  BookOpen,
  House,
  Languages,
  LogOut,
  MessagesSquare,
  Settings,
  UsersRound,
} from "lucide-react";
// shadcn/ui
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "../ui/button";
// components
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CommonAlert } from "./ConfirmDialog";
// helpers
import { getFirstContentId, getGradeInfo } from "~/helper/helper";
import { cn } from "~/lib/utils";
// firebase
import { logout } from "~/lib/auth";
// i18n
import { useTranslation } from "react-i18next";

export function HeaderMenu() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const contents = useAtomValue(contentsAtom);

  const gradeInfo = getGradeInfo(currentUser?.grade || "Bronze");

  const [open, setOpen] = useState(false);

  const handleClickSignOut = () => {
    if (confirm("ログアウトしますか？")) {
      logout();
      setCurrentUser(null);
      navigate("/login");
    }
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="fixed top-3 right-8 w-10 h-10 z-50">
          <Avatar className={cn("w-10 h-10 cursor-pointer")}>
            <AvatarFallback className="bg-black text-white select-none">
              <span className="">
                {currentUser?.name
                  ? currentUser?.name.charAt(0).toUpperCase()
                  : "?"}
              </span>
            </AvatarFallback>
          </Avatar>
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4 items-center justify-center w-16">
        {/* 홈 메뉴 버튼 */}
        <Link to="/" onClick={closeMenu}>
          <Button variant="ghost">
            <House />
          </Button>
        </Link>
        {/* 콘텐츠 메뉴 버튼 */}
        <Link
          to={`/contents/${getFirstContentId(contents ?? [])}`}
          prefetch="intent"
          onClick={() => {
            closeMenu();
          }}
        >
          <Button variant="ghost">
            <BookOpen />
          </Button>
        </Link>
        {/* 유저 메뉴 버튼 (관리자만 보이게) */}
        <Link to="/users" onClick={closeMenu}>
          <Button
            variant="ghost"
            className={`${currentUser?.authority === "user" ? "hidden" : ""}`}
          >
            <UsersRound />
          </Button>
        </Link>
        {/* 커뮤니티 메뉴 버튼 */}
        <Link to="/community" onClick={closeMenu} prefetch="intent">
          <Button variant="ghost">
            <MessagesSquare />
          </Button>
        </Link>
        {/* 언어 선택 버튼 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost">
              <Languages />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full bg-black/50" align="end">
            <LanguageSwitcher />
          </PopoverContent>
        </Popover>

        <Link to="/settings" onClick={closeMenu}>
          <Button variant="ghost">
            <Settings />
          </Button>
        </Link>

        {/* 로그아웃 버튼 */}
        <CommonAlert
          buttonLabel={<LogOut />}
          triggerVariant="ghost"
          triggerDisabled={false}
          triggerSize="sm"
          title={t("auth.logout_confirm")}
          titleWithIcon="warning"
          cancleButtonLabel={t("common.cancel")}
          confirmButtonLabel={t("common.yes")}
          onConfirm={handleClickSignOut}
        />

        {/* 유저 메달 */}
        {currentUser && (
          <img
            src={gradeInfo.badge}
            alt="user medal"
            className="min-w-40 h-20 absolute -bottom-20"
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
