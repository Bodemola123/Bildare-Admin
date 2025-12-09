"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, LockKeyhole } from "lucide-react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  if (!email || !password) {
    toast.error("Please fill in both email and password");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("https://bildare-backend.onrender.com/admin/login", {
      method: "POST",
      credentials: "include", // important so session is saved
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error || "Login failed");
      return;
    }

    // Success
    toast.success("Login successful!");
    setTimeout(() => {
      window.location.href = "/admin"; // redirect
    }, 700);

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      {/* Global Toaster */}
      

      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="flex flex-col bg-white shadow-xl rounded-3xl max-w-lg overflow-hidden">
          
          {/* Branding */}
          <div className="w-full h-40 relative bg-[#1F201C] flex justify-center items-center">
            <Image
              src="/SigninLogo.svg"
              alt="Login Logo"
              fill
              className="w-10 h-10"
            />
          </div>

          {/* Form */}
          <div className="flex flex-col gap-5 px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500 text-center">
              Sign in to your account
            </p>

            <div className="flex flex-col gap-4">
              {/* Email */}
              <div className="grid w-full gap-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 h-14 placeholder:text-gray-400 text-gray-800 w-full bg-gray-100 border border-gray-300 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <Mail className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Password */}
              <div className="grid w-full gap-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 h-14 placeholder:text-gray-400 text-gray-800 w-full bg-gray-100 border border-gray-300 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <LockKeyhole className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex cursor-pointer justify-center items-center gap-2 mt-4 w-full bg-primary text-white font-bold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Log in"
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="py-4 text-center text-gray-400 text-sm bg-gray-50">
            © 2025 Bildare. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}
