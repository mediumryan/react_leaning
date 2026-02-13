// react
import { useState } from "react";
// atoms
import type { Authority, Course, Grade, User } from "~/data/userData";
// shadcn/ui
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
// i18n
import { useTranslation } from "react-i18next";

interface UserFormProps {
  user?: User;
  onSave: (user: User) => void;
  setOpen?: (open: boolean) => void;
}

function UserForm({ user, onSave, setOpen }: UserFormProps) {
  const { t } = useTranslation();

  const [name, setName] = useState(user?.name ?? "");
  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [course, setCourse] = useState<Course>(user?.course ?? "Beginner");
  const [grade, setGrade] = useState<Grade>(user?.grade ?? "Bronze");
  const [authority, setAuthority] = useState<Authority>(
    user?.authority ?? "user",
  );
  const [exp, setExp] = useState<number>(user?.exp ?? 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      uid: user?.uid ?? Date.now().toString(),
      name,
      nickname,
      email,
      course,
      grade,
      exp,
      authority,
      contentStatus: user?.contentStatus ?? new Set(),
    });

    setOpen?.(false);
  };

  return (
    <DialogContent className="sm:max-w-120">
      <form onSubmit={handleSubmit} className="space-y-4">
        <DialogHeader>
          <DialogTitle>{user ? t("users.users_edit_title") : ""}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("users.users_name_label")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">{t("users.users_nickname_label")}</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("users.users_email_label")}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="course">{t("users.users_course_label")}</Label>
          <select
            id="course"
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={course}
            onChange={(e) => setCourse(e.target.value as Course)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="grade">{t("users.users_grade_label")}</Label>
            <select
              id="grade"
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={grade}
              onChange={(e) => setGrade(e.target.value as Grade)}
            >
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
              <option value="Diamond">Diamond</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="authority">
              {t("users.users_authority_label")}
            </Label>
            <select
              id="authority"
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={authority}
              onChange={(e) => setAuthority(e.target.value as Authority)}
            >
              <option value="user">User</option>
              <option value="operator">Operator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exp">{t("users.users_exp_label")}</Label>
            <Input
              id="exp"
              type="number"
              min={0}
              value={exp}
              onChange={(e) => setExp(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">{t("common.save")}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export default UserForm;
