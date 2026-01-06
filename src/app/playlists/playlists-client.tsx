"use client";
import { useState, use } from "react";
import Image from "next/image";
import { PlaylistDropdown } from "@/components/playlists/PlaylistDropdown";
import { useRouter } from "next/navigation";
import type { PlaylistSummary } from "@/types/spotify";

export function PlaylistsClient({ playlistsPromise }: { playlistsPromise: Promise<PlaylistSummary[]> }) {
  const playlists = use(playlistsPromise);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handlePlaylistClick = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Playlists</h1>
        <div className="relative">
          <div
            className={`
              flex items-center rounded-lg transition-all duration-300 ease-in-out
              ${isSearchExpanded ? "w-64 h-10 bg-zinc-800 pr-4" : "w-10 h-10 p-2"}
              ${!isSearchExpanded && isHovered ? "bg-zinc-800" : ""}
              ${!isSearchExpanded && !isHovered ? "bg-transparent" : ""}
              focus-within:ring-2 focus-within:ring-green-500
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <input
              type="text"
              placeholder="Search playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => {
                if (!searchQuery) {
                  setIsSearchExpanded(false);
                }
              }}
              className={`
                bg-transparent outline-none transition-all duration-300 ease-in-out
                ${isSearchExpanded ? 'w-full ml-2 opacity-100 py-2' : 'w-0 opacity-0'}
              `}
            />
            <div
              className={`
                text-gray-400 transition-all duration-300
                ${isSearchExpanded ? 'pointer-events-none' : 'cursor-pointer'}
              `}
              onClick={() => {
                setIsSearchExpanded(true);
                setTimeout(() => document.querySelector('input')?.focus(), 100);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4">
        {playlists
          .filter((playlist) =>
            playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((playlist) => (
          <div 
            key={playlist.id} 
            className="flex items-center gap-4 p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            onClick={() => handlePlaylistClick(playlist.id)}
          >
            <div className="flex items-center gap-4 flex-grow">
              <Image
                src={playlist.images[0]?.url || '/default-playlist.png'}
                alt={playlist.name}
                width={64}
                height={64}
                className="rounded-md"
              />
              <div>
                <h2 className="font-semibold text-left">{playlist.name}</h2>
                <p className="text-sm text-gray-400 text-left">
                  {playlist.tracks.total} tracks • By {playlist.owner.display_name}
                </p>
              </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <PlaylistDropdown playlistId={playlist.id} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

