'use client';
import { signIn } from "next-auth/react";
import { SpotifyIcon } from "@/components/icons/SpotifyIcon";

export function SpotifyLoginButton() {
  return (
    <button
      onClick={() => signIn('spotify')}
      className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-medium transition-colors"
    >
      <SpotifyIcon className="w-5 h-5" />
      Continue with Spotify
    </button>
  );
} 