// react
import { useState } from "react";
// atoms
import { currentUserAtom, type Course } from "~/data/userData";
import { useAtom } from "jotai";
// shadcn/ui
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
// helpers
import { updateUserCourse } from "~/lib/firestore_utils";

export default function HomeSelectCourse() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const courseOptions: Course[] = ["Beginner", "Intermediate", "Advanced"];

  const [selectedCourse, setSelectedCourse] = useState<Course>(
    currentUser?.course as Course | "Beginner",
  );

  const handleClickChangeCourse = async () => {
    if (!currentUser) return;
    if (confirm(`コースを「${selectedCourse}」に変更しますか？`)) {
      try {
        // 1. Update Firestore first
        await updateUserCourse(currentUser.uid, selectedCourse);

        // 2. On success, update local Jotai state
        setCurrentUser({ ...currentUser, course: selectedCourse });

        alert("コースが変更されました");
      } catch (error) {
        console.error("Failed to update course:", error);
        alert("コースの変更に失敗しました。");
      }
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
              ? "Beginner - 初心者コース"
              : course === "Intermediate"
                ? "Intermediate - 中級者コース（準備中）"
                : "Advanced - 上級者コース（準備中）"}
          </Button>
        ))}
      </ButtonGroup>
      <Button variant="ghost" onClick={handleClickChangeCourse} disabled>
        変更
      </Button>
    </>
  );
}
