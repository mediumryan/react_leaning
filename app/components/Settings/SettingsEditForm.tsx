import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAtom } from "jotai";
import { currentUserAtom, type Course, type User } from "~/data/userData";
import { useState } from "react";
import { updateUserInFirestore } from "~/lib/firestore_utils";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface SettingsEditFormProps {
  setShowForm: (open: boolean) => void;
}

export const SettingsEditForm = ({ setShowForm }: SettingsEditFormProps) => {
  const { t } = useTranslation();

  const [currentUser, setCurrentUser] = useAtom<User | null>(currentUserAtom);

  const [name, setName] = useState(currentUser?.name ?? "");
  const [nickname, setNickname] = useState(currentUser?.nickname ?? "");
  const [course, setCourse] = useState<Course>(
    currentUser?.course ?? "Beginner",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = {
      uid: currentUser?.uid ?? Date.now().toString(),
      name,
      nickname,
      email: currentUser?.email ?? "",
      course,
      grade: currentUser?.grade ?? "Bronze",
      exp: currentUser?.exp ?? 0,
      authority: currentUser?.authority ?? "user",
      contentStatus: currentUser?.contentStatus ?? new Set(),
    };

    await updateUserInFirestore(user.uid, user);
    toast.success(t("users.users_edit_success"));

    setShowForm(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("settings.settings_edit_name_label")}</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nickname">
            {t("settings.settings_edit_nickname_label")}
          </Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="course">
          {t("settings.settings_edit_course_label")}
        </Label>
        <select
          id="course"
          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
          value={course}
          onChange={(e) => setCourse(e.target.value as Course)}
        >
          <option value="Beginner">{t("course.Beginner")}</option>
          <option value="Intermediate" disabled>
            {t("course.Intermediate")}
          </option>
          <option value="Advanced" disabled>
            {t("course.Advanced")}
          </option>
        </select>
      </div>
      <div className="flex gap-2 w-full justify-end items-center">
        <Button variant="default" type="submit" className="">
          {t("common.edit")}
        </Button>
        <Button
          variant="outline"
          type="button"
          className=""
          onClick={() => {
            setShowForm(false);
          }}
        >
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
};

export default SettingsEditForm;
