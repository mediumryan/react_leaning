import { Plus, Search, UserCog, Trash2 } from "lucide-react";
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
import { useEffect, useState } from "react"; // Import useEffect
import { currentUserAtom, usersAtom, type User } from "~/data/userData";
import UserForm from "~/components/UserForm";
import { useAtom, useAtomValue } from "jotai";
import { Navigate } from "react-router";
import {
  getAllUsers,
  addUserToFirestore,
  updateUserInFirestore,
  deleteUserFromFirestore,
} from "~/lib/firestore_utils"; // Import CUD functions

export default function UserManagementPage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial fetch
  const [error, setError] = useState<string | null>(null); // Error state for initial fetch

  const currentUser = useAtomValue(currentUserAtom);
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
        setError("사용자 정보를 불러오는데 실패했습니다.");
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
    if (!window.confirm("本当にこのユーザーを削除しますか？")) return;

    const prevUsers = users; // Store current state for potential rollback

    // Optimistic UI update
    setUsers((currentUsers) =>
      currentUsers ? currentUsers.filter((user) => user.uid !== id) : null,
    );

    try {
      await deleteUserFromFirestore(id);
      alert("ユーザーが正常に削除されました。");
    } catch (err: any) {
      console.error("ユーザー削除に失敗しました:", err);
      setError("ユーザー削除に失敗しました。");
      setUsers(prevUsers); // Rollback optimistic update
    }
  };

  const handleSave = async (user: User) => {
    const isNewUser = !users?.some((u) => u.uid === user.uid);
    const prevUsers = users; // Store current state for potential rollback

    // Optimistic UI update
    setUsers((currentUsers) => {
      if (!currentUsers) return [user]; // If no users, add this one
      const existingIndex = currentUsers.findIndex((u) => u.uid === user.uid);
      if (existingIndex !== -1) {
        // Update existing user
        const updated = [...currentUsers];
        updated[existingIndex] = user;
        return updated;
      } else {
        // Add new user
        return [...currentUsers, user];
      }
    });

    try {
      if (isNewUser) {
        await addUserToFirestore(user);
        alert("ユーザーが正常に追加されました。");
      } else {
        // For updates, send the UID and fields to update
        await updateUserInFirestore(user.uid, user);
        alert("ユーザー情報が正常に更新されました。");
      }
    } catch (err: any) {
      console.error("ユーザー情報の保存に失敗しました:", err);
      setError("ユーザー情報の保存に失敗しました。");
      setUsers(prevUsers); // Rollback optimistic update
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
    return (
      <div className="p-6 max-w-7xl mx-auto text-center text-lg">
        ユーザー情報を読み込み中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center text-red-500 text-lg">
        エラー: {error}
      </div>
    );
  }

  // Ensure users is not null before rendering the table content
  if (!users) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center text-lg">
        ユーザー情報が存在しません。
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">ユーザー管理</h1>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, nickname, email..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> ユーザーを追加
              </Button>
            </DialogTrigger>
            <UserForm onSave={handleSave} />
          </Dialog>
        </div>
      </div>

      <div className="rounded-xl border bg-background shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Nickname</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Authority</TableHead>
              <TableHead>EXP</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
