// react
import { useEffect, useState } from "react";
// react-router
import { Link, useParams } from "react-router";
// atoms
import { useAtom, useAtomValue } from "jotai";
import { currentUserAtom } from "~/data/userData";
import { contentsQueryAtom } from "~/data/contentData";
// icons
import { BookOpen, PlayCircle, CheckCircle2, Check } from "lucide-react";
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
} from "./ui/sidebar";
import { Progress } from "./ui/progress";
// helpers
import {
  groupContentBySection,
  isCompleteCourse,
  mappingTitlebySection,
} from "~/helper/helper";

export function AppSidebar() {
  const contentId = useParams().id;
  const currentUser = useAtomValue(currentUserAtom);
  const [{ data: contents }] = useAtom(contentsQueryAtom);

  const [progress, setProgress] = useState(0);

  const CONTENT = contents ? groupContentBySection(contents) : [];

  useEffect(() => {
    const contentLength = contents?.length || 0;
    if (!currentUser || !contents) return;
    const completedCount = currentUser?.contentStatus?.size || 0;
    const calculatedProgress = Math.floor(
      (completedCount / contentLength) * 100,
    );
    setProgress(calculatedProgress);
  }, [currentUser, contents]);

  if (!contents) {
    return (
      <Sidebar className="flex items-center justify-center">
        <p>ローディング中...</p>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="">
      <SidebarHeader className="p-4">
        <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight">
          <FaReact id="react-icon" className="text-blue-600 animate-spin" />
          <span>{currentUser?.course} Class</span>
        </h2>

        <div className="flex items-center gap-2">
          <Progress value={progress} className="w-full" />
          <p className="text-xs text-muted-foreground">{progress}%</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {CONTENT.map((section) => (
          <SidebarGroup key={`section${section[0].section}`}>
            <SidebarGroupLabel className="px-2 mb-1 text-blue-400 font-semibold text-sm ">
              {mappingTitlebySection(section[0].section)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.map((content) => (
                  <SidebarMenuItem key={content.id} className="px-2">
                    <Link to={`/contents/${content.id}`}>
                      <SidebarMenuButton
                        className={`${
                          contentId === content.id
                            ? "bg-blue-400 text-white"
                            : ""
                        } `}
                      >
                        {/* <content.icon className="mr-2 h-4 w-4" /> */}
                        <span className="text-xs">{content.title}</span>
                        <Check
                          className={`${
                            isCompleteCourse(content, currentUser)
                              ? "block"
                              : "hidden"
                          } ml-auto h-4 w-4 text-white bg-blue-400 rounded-full`}
                        />
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
