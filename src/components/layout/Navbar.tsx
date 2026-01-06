"use client";

import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-slate-800 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-green-500">
        Snobify
      </Link>

      <div className="flex gap-20">
        <Link
          href="/playlists"
          className="text-gray-300 hover:text-white transition"
        >
          Playlists
        </Link>
        <Link
          href="/search"
          className="text-gray-300 hover:text-white transition"
        >
          Search
        </Link>
        <Link
          href="/statistics"
          className="text-gray-300 hover:text-white transition"
        >
          Statistics
        </Link>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full overflow-hidden hover:ring-2 hover:ring-green-500 transition focus:outline-none">
          <Image
            src={session?.user?.image || "/default-avatar.png"}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 bg-zinc-700 border-zinc-600 text-gray-200"
        >
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard"
              className="cursor-pointer focus:bg-zinc-600"
            >
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="cursor-pointer focus:bg-zinc-600"
            >
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-600" />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="cursor-pointer focus:bg-zinc-600"
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
