"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiDashboardFill } from "react-icons/ri";
import { HiOutlineUserCircle } from "react-icons/hi";
// import { PiUsersThreeLight, PiGear } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";
import { MdMenuOpen } from "react-icons/md";
import { toast } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = async () => {
  try {
    const res = await fetch("https://bildare-backend.onrender.com/admin/logout", {
      method: "POST",
      credentials: "include", // VERY IMPORTANT for session logout
    });

    if (!res.ok) {
      throw new Error("Logout failed");
    }

    toast.success("Logged out");

    setTimeout(() => {
      window.location.href = "/"; // back to login page
    }, 300);

  } catch (err) {
    console.error(err);
    toast.error("Logout failed");
  }
};

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col justify-between py-6 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } bg-white shadow-lg h-screen`}
      >
        {/* Top: Logo + toggle */}
        <div className="flex flex-col gap-8">
          <div className={`flex items-center ${isOpen ? "justify-between px-4" : "justify-center"}`}>
            {isOpen && <h1 className="text-xl font-bold text-primary">Bildare Admin</h1>}
            <button onClick={toggleSidebar} className="p-2">
              <MdMenuOpen className="text-2xl" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-2 px-2">
            <Link
              href="/admin"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                pathname === "/admin" ? "bg-primary/20 text-primary" : "text-gray-600 hover:bg-gray-100"
              } ${isOpen ? "justify-start" : "justify-center"}`}
            >
              <RiDashboardFill className="text-2xl" />
              {isOpen && <span>Home</span>}
            </Link>

            <Link
              href="/admin/users"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                pathname.includes("/users") ? "bg-primary/20 text-primary" : "text-gray-600 hover:bg-gray-100"
              } ${isOpen ? "justify-start" : "justify-center"}`}
            >
              <HiOutlineUserCircle className="text-2xl" />
              {isOpen && <span>Users</span>}
            </Link>

            {/* <Link
              href="/admin/creators"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                pathname.includes("/creators") ? "bg-primary/20 text-primary" : "text-gray-600 hover:bg-gray-100"
              } ${isOpen ? "justify-start" : "justify-center"}`}
            >
              <PiUsersThreeLight className="text-2xl" />
              {isOpen && <span>Creators</span>}
            </Link>

            <Link
              href="/admin/settings"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                pathname.includes("/settings") ? "bg-primary/20 text-primary" : "text-gray-600 hover:bg-gray-100"
              } ${isOpen ? "justify-start" : "justify-center"}`}
            >
              <PiGear className="text-2xl" />
              {isOpen && <span>Settings</span>}
            </Link> */}
          </nav>
        </div>

        {/* Bottom: Logout */}
        <div className="px-2 mb-4">
<button
  onClick={handleLogout}
  className={`flex w-full items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-100 transition-colors ${
    isOpen ? "justify-start" : "justify-center"
  }`}
>
  <IoIosLogOut className="text-2xl rotate-180" />
  {isOpen && <span>Logout</span>}
</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen bg-gray-100 p-6">
        {/* children wrapper: fill main space */}
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
