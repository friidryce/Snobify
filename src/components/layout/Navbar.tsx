import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Menu, MenuItems, MenuItem, MenuButton } from "@headlessui/react";

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

      <Menu as="div" className="relative flex items-center">
        <MenuButton className="rounded-full overflow-hidden hover:ring-2 hover:ring-green-500 transition">
          <Image
            src={session?.user?.image || "/default-avatar.png"}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        </MenuButton>

        <MenuItems className="absolute right-0 top-12 w-48 bg-zinc-700 rounded-md shadow-lg py-1">
          <MenuItem>
            {({ active }) => (
              <Link
                href="/dashboard"
                className={`${
                  active ? "bg-zinc-600" : ""
                } block px-4 py-2 text-sm text-gray-200 hover:bg-zinc-600`}
              >
                Dashboard
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <Link
                href="/settings"
                className={`${
                  active ? "bg-zinc-600" : ""
                } block px-4 py-2 text-sm text-gray-200 hover:bg-zinc-600`}
              >
                Settings
              </Link>
            )}
          </MenuItem>
          <hr className="border-zinc-600 my-1" />
          <MenuItem>
            {({ active }) => (
              <button
                onClick={() => signOut()}
                className={`${
                  active ? "bg-zinc-600" : ""
                } px-4 py-2 text-sm text-gray-200 w-full text-left hover:bg-zinc-600 block`}
              >
                Sign out
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Menu>
    </nav>
  );
}
