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
      <h1 className="text-3xl font-bold mb-8">Your Playlists</h1>
      
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
        {playlists.map((playlist) => (
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