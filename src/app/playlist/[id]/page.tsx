"use client";
import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";

interface Artist {
  id: string;
  name: string;
}

interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
}

interface PlaylistTrack {
  track: Track;
  added_at: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  images: { url: string }[];
  owner: {
    display_name: string;
  };
  tracks: {
    total: number;
    items: PlaylistTrack[];
  };
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function PlaylistPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { data: session } = useSession();
  const resolvedParams = use(params);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!session?.accessToken) return;

      try {
        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${resolvedParams.id}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch playlist');
        
        const data = await response.json();
        setPlaylist(data);
      } catch (err) {
        setError('Failed to load playlist');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [resolvedParams.id, session?.accessToken]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      );
    }

    if (error || !playlist) {
      return (
        <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
          <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">
            {error || 'Playlist not found'}
          </div>
        </div>
      );
    }

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

          {playlist.tracks.items.map(({ track }, index) => (
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
                {track.album.name}
              </div>
              <div className="text-gray-400">
                {formatDuration(track.duration_ms)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      {renderContent()}
    </>
  );
} 