// react
import { useEffect, useState } from "react";
// react-router
import { Navigate } from "react-router";
// atoms
import { currentUserAtom, usersAtom, type User } from "~/data/userData";
import { useAtom, useAtomValue } from "jotai";
// shadcn/ui
import { Input } from "~/components/ui/input";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { toast } from "sonner";
// components
import UserForm from "~/components/Users/UserForm";
import { BackgroundSpinner } from "~/components/Common/BackgroundSpinner";
// icons
import { Search, UserCog, Trash2 } from "lucide-react";
// firebase
import {
  getAllUsers,
  updateUserInFirestore,
  deleteUserFromFirestore,
} from "~/lib/firestore_utils";
// i18n
import { useTranslation } from "react-i18next";

export default function UserManagementPage() {
  const { t } = useTranslation();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial fetch
  const [error, setError] = useState<string | null>(null); // Error state for initial fetch

  const [users, setUsers] = useAtom(usersAtom); // Standard atom usage
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (err: any) {
        console.error("Failed to fetch users:", err);
        setError(t("users.users_fetch_error"));
        setUsers(null); // Clear users on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [setUsers]); // Dependency array for useEffect

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.nickname.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("users.users_delete_confirm"))) return;

    const prevUsers = users; // Store current state for potential rollback

    // Optimistic UI update
    setUsers((currentUsers) =>
      currentUsers ? currentUsers.filter((user) => user.uid !== id) : null,
    );

    try {
      await deleteUserFromFirestore(id);
      toast.success(t("users.users_delete_success"));
    } catch (err: any) {
      toast.error(t("users.users_delete_fail"));
      setError(t("users.users_delete_fail"));
      setUsers(prevUsers); // Rollback optimistic update
    }
  };

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const handleSave = async (user: User) => {
    const isNewUser = !users?.some((u) => u.uid === user.uid);
    const prevUsers = users;

    // Optimistic UI update (리스트 갱신)
    setUsers((currentUsers) => {
      if (!currentUsers) return [user];
      const existingIndex = currentUsers.findIndex((u) => u.uid === user.uid);
      if (existingIndex !== -1) {
        const updated = [...currentUsers];
        updated[existingIndex] = user;
        return updated;
      } else {
        return [...currentUsers, user];
      }
    });

    if (user.uid === currentUser?.uid) {
      setCurrentUser(user);
    }

    try {
      if (isNewUser) {
        // await addUserToFirestore(user);
      } else {
        await updateUserInFirestore(user.uid, user);
        toast.success(t("users.users_edit_success"));
      }
    } catch (err: any) {
      toast.error(t("users.users_save_fail"));
      setUsers(prevUsers);

      // 에러 발생 시 currentUser도 롤백 (선택 사항)
      if (user.uid === currentUser?.uid) {
        setCurrentUser(currentUser);
      }
    } finally {
      setOpenAdd(false);
      setOpenEdit(false);
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (
    currentUser?.authority !== "admin" &&
    currentUser?.authority !== "instructor"
  ) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <BackgroundSpinner />;
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center text-red-500 text-lg">
        ERROR: {error}
      </div>
    );
  }

  // Ensure users is not null before rendering the table content
  if (!users) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center text-lg">
        {t("users.users_no_results")}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t("users.users_title")}</h1>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("users.users_search_placeholder")}
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            {/* <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> ユーザーを追加
              </Button>
            </DialogTrigger> */}
            <UserForm onSave={handleSave} />
          </Dialog>
        </div>
      </div>

      <div className="rounded-xl border bg-background shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("users.users_name_label")}</TableHead>
              <TableHead>{t("users.users_nickname_label")}</TableHead>
              <TableHead>{t("users.users_email_label")}</TableHead>
              <TableHead>{t("users.users_course_label")}</TableHead>
              <TableHead>{t("users.users_grade_label")}</TableHead>
              <TableHead>{t("users.users_authority_label")}</TableHead>
              <TableHead>{t("users.users_exp_label")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.map((user) => (
              <TableRow key={user.uid}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.nickname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.course}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {user.grade}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.authority === "admin"
                        ? "default"
                        : user.authority === "instructor"
                          ? "secondary"
                          : "outline"
                    }
                    className="capitalize"
                  >
                    {user.authority}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums">
                  {user.exp.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog
                      open={user === selectedUser}
                      onOpenChange={(open) =>
                        setSelectedUser(open ? user : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedUser(user)}
                        >
                          <UserCog className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <UserForm
                        user={user}
                        onSave={handleSave}
                        setOpen={setOpenEdit}
                      />
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(user.uid)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {(filteredUsers === undefined || filteredUsers.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
