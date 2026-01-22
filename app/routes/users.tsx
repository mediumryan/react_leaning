'use client';

import { Plus, Search, UserCog, Trash2 } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Dialog, DialogTrigger } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { useState } from 'react';
import { INITIAL_USERS, type User } from '~/data/userData';
import UserForm from '~/components/UserForm';

export default function UserManagementPage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.nickname.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleSave = (user: User) => {
    // 유저 아이디가 존재한다면 수정, 그렇지 않다면 신규 추가
    setUsers((prev) => {
      const existingIndex = prev.findIndex((u) => u.id === user.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = user;
        return updated;
      } else {
        return [...prev, user];
      }
    });
    setOpenAdd(false);
    setOpenEdit(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>

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
                <Plus className="h-4 w-4 mr-2" /> Add User
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
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
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
                      user.authority === 'admin'
                        ? 'default'
                        : user.authority === 'operator'
                          ? 'secondary'
                          : 'outline'
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
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredUsers.length === 0 && (
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
