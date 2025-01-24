import { Menu } from "@headlessui/react";
import Link from "next/link";
import { ThreeDotsIcon } from "@/components/icons/ThreeDotsIcon";

interface PlaylistDropdownProps {
  playlistId: string;
}

export function PlaylistDropdown({ playlistId }: PlaylistDropdownProps) {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="p-2 hover:bg-zinc-700 rounded-full transition-colors">
        <ThreeDotsIcon />
      </Menu.Button>

      <Menu.Items 
        className="absolute right-0 mt-2 bg-zinc-800/95 backdrop-blur-sm rounded-md shadow-xl ring-1 ring-white/10 focus:outline-none z-10 w-56 border border-zinc-700"
      >
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <Link
                href={`/playlist/${playlistId}/generate-sub`}
                className={`${
                  active ? 'bg-zinc-700/80' : ''
                } block px-4 py-2 text-sm text-gray-200`}
              >
                Generate a Sub-Playlist
              </Link>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
} 