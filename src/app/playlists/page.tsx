"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: {
    total: number;
  };
  owner: {
    display_name: string;
  };
}

export default function PlaylistsPage() {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!session?.accessToken) return;

      try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch playlists');
        }

        const data = await response.json();
        setPlaylists(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchPlaylists();
    }
  }, [session]);

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
      
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 bg-red-500/10 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {playlists
          .filter((playlist) =>
            playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((playlist) => (
          <Link 
            href={`/playlist/${playlist.id}`} 
            key={playlist.id}
            className="flex items-center gap-4 p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <Image
              src={playlist.images[0]?.url || '/default-playlist.png'}
              alt={playlist.name}
              width={64}
              height={64}
              className="rounded-md"
            />
            <div>
              <h2 className="font-semibold">{playlist.name}</h2>
              <p className="text-sm text-gray-400">
                {playlist.tracks.total} tracks • By {playlist.owner.display_name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
} 