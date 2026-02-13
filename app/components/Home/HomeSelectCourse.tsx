// react
import { useState } from "react";
// atoms
import { currentUserAtom, type Course } from "~/data/userData";
import { useAtom } from "jotai";
// shadcn/ui
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { toast } from "sonner";
// components
import { CommonAlert } from "../Common/ConfirmDialog";
// helpers
import { updateUserCourse } from "~/lib/firestore_utils";
// i18n
import { useTranslation } from "react-i18next";

export default function HomeSelectCourse() {
  const { t } = useTranslation();

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const courseOptions: Course[] = ["Beginner", "Intermediate", "Advanced"];

  const [selectedCourse, setSelectedCourse] = useState<Course>(
    currentUser?.course as Course | "Beginner",
  );

  const handleClickChangeCourse = async () => {
    if (!currentUser) return;

    try {
      // 1. Update Firestore first
      await updateUserCourse(currentUser.uid, selectedCourse);

      // 2. On success, update local Jotai state
      setCurrentUser({ ...currentUser, course: selectedCourse });

      toast.success("コースが変更されました");
    } catch (error) {
      console.error("Failed to update course:", error);
      toast.error("コースの変更に失敗しました。");
    }
  };

  return (
    <>
      <ButtonGroup orientation="vertical" className="my-4 gap-1">
        {courseOptions.map((course, index) => (
          <Button
            key={course}
            variant={selectedCourse === course ? "default" : "outline"}
            onClick={() => setSelectedCourse(course)}
            disabled={index === 1 || index === 2}
          >
            {course === "Beginner"
              ? t("course.Beginner")
              : course === "Intermediate"
                ? t("course.Intermediate")
                : t("course.Advanced")}
          </Button>
        ))}
      </ButtonGroup>

      <CommonAlert
        buttonLabel={t("common.change")}
        triggerVariant="ghost"
        triggerDisabled={currentUser?.course === selectedCourse}
        title="コース変更の確認"
        titleWithIcon="info"
        description={`コースを「${selectedCourse}」に変更しますか？`}
        onConfirm={handleClickChangeCourse}
      />
    </>
  );
}
