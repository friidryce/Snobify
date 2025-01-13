import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "@headlessui/react";

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
        <Menu.Button className="rounded-full overflow-hidden hover:ring-2 hover:ring-green-500 transition">
          <Image
            src={session?.user?.image || "/default-avatar.png"}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        </Menu.Button>

        <Menu.Items className="absolute right-0 top-12 w-48 bg-zinc-700 rounded-md shadow-lg py-1">
          <Menu.Item>
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
          </Menu.Item>
          <Menu.Item>
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
          </Menu.Item>
          <hr className="border-zinc-600 my-1" />
          <Menu.Item>
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
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </nav>
  );
}
