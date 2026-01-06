"use client";
import { use } from "react";
import Image from "next/image";
import type { Playlist } from "@/types/spotify";

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function PlaylistContent({ playlistPromise }: { playlistPromise: Promise<Playlist> }) {
  const playlist = use(playlistPromise);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Playlist Header */}
      <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end gap-6">
            <Image
              src={playlist.images[0]?.url || '/default-playlist.png'}
              alt={playlist.name}
              width={232}
              height={232}
              className="rounded-lg shadow-xl"
            />
            <div>
              <p className="text-sm font-medium mb-2">PLAYLIST</p>
              <h1 className="text-5xl font-bold mb-6">{playlist.name}</h1>
              {playlist.description && (
                <p className="text-gray-300 mb-4">{playlist.description}</p>
              )}
              <p className="text-sm text-gray-400">
                Created by {playlist.owner.display_name} • {playlist.tracks.total} songs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-zinc-800 text-sm text-gray-400">
          <div className="w-8">#</div>
          <div>TITLE</div>
          <div>ALBUM</div>
          <div>DURATION</div>
        </div>

        {playlist.tracks.items?.map(({ track }, index) => (
          <div
            key={track.id}
            className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 hover:bg-zinc-800/50 rounded-md group"
          >
            <div className="w-8 text-gray-400 group-hover:text-white">
              {index + 1}
            </div>
            <div className="min-w-0">
              <div className="truncate text-white">{track.name}</div>
              <div className="truncate text-sm text-gray-400">
                {track.artists.map(a => a.name).join(", ")}
              </div>
            </div>
            <div className="truncate text-gray-400">
              {track.album?.name || 'Unknown Album'}
            </div>
            <div className="text-gray-400">
              {track.duration_ms ? formatDuration(track.duration_ms) : '--:--'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

