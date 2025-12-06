"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AiOutlineReload } from "react-icons/ai";
import { Users } from "lucide-react";

interface User {
  user_id: number;
  username: string;
  email: string;
  role: string;
}

interface ActiveUsersResponse {
  activeCount: number;
  activeUsers: User[];
}

export default function AdminPage() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalCreators, setTotalCreators] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch total users and creators
  const fetchUsers = async () => {
    try {
      const res = await fetch("https://bildare-backend.onrender.com/admin/users");
      const data: User[] = await res.json();
      setTotalUsers(data.length);

      const creators = data.filter((user) => user.role.toLowerCase() === "creator");
      setTotalCreators(creators.length);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  // Fetch active users
  const fetchActiveUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://bildare-backend.onrender.com/session/active-users");
      const data: ActiveUsersResponse = await res.json();
      setActiveUsers(data.activeUsers);
    } catch (error) {
      console.error("Failed to fetch active users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchActiveUsers();
  }, []);

  return (
    <div className="p-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Total Creators</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalCreators}</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeUsers.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Users Table */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Active Users</h2>
        <Button onClick={fetchActiveUsers} disabled={loading} className="flex items-center gap-2">
          {loading ? <AiOutlineReload /> :"Refresh" }
          
        </Button>
      </div>

<Card className="bg-white">
  <CardContent>
    {activeUsers.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Users className="w-12 h-12 mb-4 opacity-50" /> {/* Icon */}
        <p className="text-lg">No active users</p>
        <p className="text-sm">Active users will appear here once they log in.</p>
      </div>
    ) : (
      <div className="overflow-y-auto max-h-[400px] border border-gray-200 rounded">
        <Table className="min-w-full">
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeUsers.map((user) => (
              <TableRow key={`${user.user_id}-${user.email}`}>
                <TableCell>{user.user_id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}
  </CardContent>
</Card>

    </div>
  );
}
