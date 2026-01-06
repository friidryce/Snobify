"use client";
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { LoginPage } from "@/components/auth/Login";
import { useSession } from "@/lib/auth-client";

export default function PlaylistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
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