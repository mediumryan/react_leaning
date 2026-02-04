// react-router
import { Link, useNavigate, useParams } from "react-router";
// atoms
import { useAtom, useAtomValue } from "jotai";
import { currentUserAtom } from "~/data/userData";
import { contentsQueryAtom } from "~/data/contentData";
// icons
import {
  BookOpen,
  House,
  LogOut,
  MessagesSquare,
  UsersRound,
} from "lucide-react";
// shadcn/ui
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
// helpers
import { getFirstContentId, getUserMedal } from "~/helper/helper";
import { cn } from "~/lib/utils";
// firebase
import { logout } from "~/lib/auth";
import { useEffect, useState } from "react";

export function HeaderMenu() {
  const params = useParams();

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  // const [{ data: contents }] = useAtom(contentsQueryAtom);
  const contents = useAtomValue(contentsQueryAtom);

  const [open, setOpen] = useState(false);

  const handleClickNavigate = (path: string) => {
    navigate(`/${path}`);
  };

  const handleClickSignOut = () => {
    if (confirm("ログアウトしますか？")) {
      logout();
      setCurrentUser(null);
      navigate("/login");
    }
  };

  // close menu when url has changed
  useEffect(() => {
    setOpen(false);
  }, [params]);

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
      <PopoverContent className="flex flex-col gap-4 items-center justify-center w-12">
        <House
          className="cursor-pointer"
          onClick={() => handleClickNavigate("")}
        />
        <BookOpen
          className="cursor-pointer"
          onClick={() => {
            const firstContentId = getFirstContentId(contents ?? []);
            handleClickNavigate(`contents/${firstContentId}`);
          }}
        />
        <UsersRound
          className={`${currentUser?.authority === "user" ? "hidden" : ""} cursor-pointer`}
          onClick={() => handleClickNavigate("users")}
        />
        <MessagesSquare
          className="cursor-pointer"
          onClick={() => handleClickNavigate("community")}
        />
        <LogOut className="cursor-pointer" onClick={handleClickSignOut} />
        {currentUser && (
          <img
            src={getUserMedal(currentUser.grade)}
            alt="user medal"
            className="min-w-40 h-20 absolute -bottom-20"
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
