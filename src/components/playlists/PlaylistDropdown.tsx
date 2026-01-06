import Link from "next/link";
import { ThreeDotsIcon } from "@/components/icons/ThreeDotsIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PlaylistDropdownProps {
  playlistId: string;
}

export function PlaylistDropdown({ playlistId }: PlaylistDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 hover:bg-zinc-700 rounded-full transition-colors focus:outline-none">
        <ThreeDotsIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-zinc-800/95 backdrop-blur-sm border-zinc-700 text-gray-200 w-56"
      >
        <DropdownMenuItem asChild>
          <Link
            href={`/playlist/${playlistId}/generate-sub`}
            className="cursor-pointer focus:bg-zinc-700/80"
          >
            Generate a Sub-Playlist
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 