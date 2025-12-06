// app/admin/users/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import Modal from "./modal";
import { Users } from "lucide-react";


interface User {
  user_id: number;
  email: string;
  username: string;
  role: string;
  is_verified: boolean;
  profile: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://bildare-backend.onrender.com/admin/users");
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      const res = await fetch("https://bildare-backend.onrender.com/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      if (res.ok) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast("Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      toast("Something went wrong");
    } finally {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Compute chart data
    const totalUsers = users.length;
  const verifiedUsers = users.filter((u) => u.is_verified).length;
  // Compute role percentages
  const roleCounts: Record<string, number> = {
    creator: 0,
    designer: 0,
    developer: 0,
    product: 0,
    user: 0,
  };
  users.forEach((u) => {
    const role = u.role.toLowerCase();
    if (roleCounts[role] !== undefined) roleCounts[role]++;
  });

  const rolePercentages = Object.entries(roleCounts).map(([role, count]) => ({
    role,
    count,
    percentage: totalUsers ? Math.round((count / totalUsers) * 100) : 0,
  }));



  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-white rounded-lg shadow flex flex-col items-center">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl font-bold mt-2">{users.length}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Users by Role</h2>
          <div className="flex flex-col gap-2">
            {rolePercentages.map(({ role, percentage }) => (
              <div key={role} className="flex items-center justify-between">
                <span className="capitalize">{role}</span>
                <span className="font-semibold">{percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow flex flex-col items-center">
          <h2 className="text-lg font-semibold">Verified Users</h2>
          <p className="text-3xl font-bold mt-2">{verifiedUsers}</p>
        </div>
      </div>

      {/* Table */}
{/* Table */}
<div className="bg-white p-4 rounded-lg shadow">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold">All Users</h3>
    <Button onClick={fetchUsers}>Refresh</Button>
  </div>

  {loading ? (
    <div className="text-center py-20">Loading...</div>
  ) : users.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
      <Users className="w-12 h-12 mb-4 opacity-50" /> {/* Icon */}
      <p className="text-lg">No users found</p>
      <p className="text-sm">Add new users to see them here.</p>
    </div>
  ) : (
    <div className="overflow-y-auto max-h-[400px] border border-gray-200 rounded">
      <Table className="min-w-full">
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>
                <Avatar>
                  {user.profile.avatar_url ? (
                    <AvatarImage src={user.profile.avatar_url} />
                  ) : (
                    <AvatarFallback className="capitalize">{user.username[0]}</AvatarFallback>
                  )}
                </Avatar>
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.role}</TableCell>
              <TableCell>{user.is_verified ? "Yes" : "No"}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDeleteId(user.user_id);
                    setModalOpen(true);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )}
</div>


      {/* Delete Modal */}
      {modalOpen && deleteId !== null && (
        <Modal
          title="Confirm Delete"
          description="This action is irreversible. Are you sure you want to delete this user?"
          onClose={() => setModalOpen(false)}
          onConfirm={() => handleDelete(deleteId)}
        />
      )}
    </div>
  );
}
