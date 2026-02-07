// react
import { useEffect, useRef, useState } from "react";
// react-router
import { Link, useParams } from "react-router";
// atoms
import { useAtomValue } from "jotai";
import { currentUserAtom } from "~/data/userData";
import { contentsAtom } from "~/data/contentData";
// icons
import { BookOpen, CheckCircle2 } from "lucide-react";
import { FaReact } from "react-icons/fa";
// shadcn/ui
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Progress } from "~/components/ui/progress";
// helpers
import {
  groupContentBySection,
  isCompleteCourse,
  mappingTitlebySection,
} from "~/helper/helper";
import { cn } from "~/lib/utils";

export function AppSidebar() {
  const lectureId = useParams().id;

  const sideBarItemRef = useRef<HTMLLIElement>(null);

  const currentUser = useAtomValue(currentUserAtom);

  const [progress, setProgress] = useState(0);

  const contents = useAtomValue(contentsAtom);

  const headerD = groupContentBySection(contents);

  useEffect(() => {
    const contentLength = contents?.length || 0;
    if (!currentUser || !contents) return;
    const completedCount = currentUser?.contentStatus?.size || 0;
    const calculatedProgress = Math.floor(
      (completedCount / contentLength) * 100,
    );
    setProgress(calculatedProgress);
  }, [currentUser, contents]);

  useEffect(() => {
    if (!sideBarItemRef.current) return;

    sideBarItemRef.current.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: "smooth",
    });
  }, [lectureId]);

  return (
    <Sidebar className="">
      <SidebarHeader className="p-4">
        <Link to="/">
          <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight">
            <FaReact id="react-icon" className="text-blue-600 animate-spin" />
            <span>{currentUser?.course} Class</span>
          </h2>
        </Link>
        <div className="flex items-center gap-2">
          <Progress value={progress} className="w-full" />
          <p className="text-xs text-muted-foreground">{progress}%</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {headerD.map((section) => (
          <SidebarGroup key={`section${section[0].section}`}>
            <SidebarGroupLabel className="px-2 mb-1 text-blue-400 font-semibold text-sm ">
              {mappingTitlebySection(section[0].section)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.map((content) => (
                  <SidebarMenuItem
                    key={content.id}
                    ref={lectureId === content.id ? sideBarItemRef : null}
                    className="px-2"
                  >
                    <Link to={`/contents/${content.id}`}>
                      <SidebarMenuButton
                        className={`${
                          lectureId === content.id
                            ? "bg-blue-400 text-white"
                            : ""
                        } `}
                      >
                        {content.type === 0 ? (
                          <BookOpen
                            fill={
                              isCompleteCourse(content, currentUser)
                                ? "#51a2ff"
                                : "none"
                            }
                            className={cn(
                              "w-4 h-4 mr-2",
                              isCompleteCourse(content, currentUser)
                                ? "text-gray-200"
                                : "",
                            )}
                          />
                        ) : (
                          <CheckCircle2
                            fill={
                              isCompleteCourse(content, currentUser)
                                ? "#51a2ff"
                                : "none"
                            }
                            className={cn(
                              "w-4 h-4 mr-2",
                              isCompleteCourse(content, currentUser)
                                ? "text-gray-200"
                                : "",
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            "text-xs",
                            isCompleteCourse(content, currentUser) &&
                              "opacity-50",
                          )}
                        >
                          {content.title}
                        </span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
