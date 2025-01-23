"use client";
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { LoginPage } from "@/components/auth/Login";
import { useSession } from "next-auth/react";

export default function PlaylistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status !== "authenticated") {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 