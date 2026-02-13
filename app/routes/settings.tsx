import React, { useState } from "react";
import { useAtomValue } from "jotai";
import { currentUserAtom } from "~/data/userData";
import { getGradeInfo, getProgress } from "~/helper/helper";
import { H1_STYLE } from "~/style/commonStyle";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Settings } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { SEPERATOR_STYLE } from "~/style/homeStyle";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import { Progress } from "~/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useTranslation } from "react-i18next";
import SettingsEditForm from "~/components/Settings/SettingsEditForm";
import { Button } from "~/components/ui/button";

const LABEL_WRAPPER_STYLE = "flex items-center justify-between gap-1 mb-2";

export default function SettingsPage() {
  const { t } = useTranslation();

  const currentUser = useAtomValue(currentUserAtom);

  const [showForm, setShowForm] = useState(false);

  const gradeInfo = getGradeInfo(currentUser?.grade || "Bronze");

  const nextGradeColor =
    gradeInfo.nextGrade === "Max"
      ? "text-black"
      : getGradeInfo(gradeInfo.nextGrade).color;

  return (
    <main className="p-8 flex flex-col justify-center items-center gap-2">
      {/* 타이틀 */}
      <h1 className={`${H1_STYLE}` + " flex items-center gap-3 tracking-wide"}>
        <Settings id="react-icon" className="text-blue-600" />
        <span>My Info</span>
      </h1>

      <Separator className={SEPERATOR_STYLE} />

      <Card className="relative w-full max-w-sm p-6 mt-20">
        <div className="flex items-center gap-4">
          <Avatar className={cn("w-10 h-10 ")}>
            <AvatarFallback className="bg-black text-white select-none">
              <span className="">
                {currentUser?.name
                  ? currentUser?.name.charAt(0).toUpperCase()
                  : "?"}
              </span>
            </AvatarFallback>
          </Avatar>

          <Label className="text-lg">
            {currentUser?.name} ({currentUser?.nickname})
          </Label>
        </div>
        {/* email */}
        <div className={LABEL_WRAPPER_STYLE}>
          <Label className="text-lg italic text-blue-500">Email</Label>
          <Label className="">{currentUser?.email}</Label>
        </div>
        {/* course */}
        <div className={LABEL_WRAPPER_STYLE}>
          <Label className="text-lg italic text-blue-500">Course</Label>
          <Label className="">{currentUser?.course}</Label>
        </div>
        <div className={LABEL_WRAPPER_STYLE}>
          <Label className="text-lg italic text-blue-500">Grade</Label>
          <div className="flex flex-col items-end">
            <Label className={gradeInfo.color}>{currentUser?.grade}</Label>
            <Label className="text-xs">
              Next :{" "}
              <span className={nextGradeColor}>{gradeInfo.nextGrade}</span>
            </Label>
          </div>
        </div>
        <div className={LABEL_WRAPPER_STYLE}>
          <Progress
            className="flex-4"
            value={getProgress(
              currentUser?.grade || "Bronze",
              currentUser?.exp || 0,
            )}
          />
          <span className="flex-1 text-xs text-slate-400 text-right">
            {currentUser?.exp} / {gradeInfo.maxExp}
          </span>
        </div>
        {/* 유저 메달 */}
        {currentUser && (
          <img
            src={gradeInfo.badge}
            alt="user medal"
            className="min-w-40 h-20 absolute top-0 -right-20"
          />
        )}
      </Card>

      <Separator className={SEPERATOR_STYLE} />

      <div className="flex items-center justify-center w-full">
        {/* 유저 정보 수정 다이얼로그 */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button variant="outline">{t("common.edit")}</Button>
          </DialogTrigger>
          <DialogContent
            aria-describedby={t("settings.settings_dialog_description")}
          >
            <DialogHeader>
              <DialogTitle>{t("settings.settings_edit_title")}</DialogTitle>
            </DialogHeader>

            <SettingsEditForm setShowForm={setShowForm} />
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
