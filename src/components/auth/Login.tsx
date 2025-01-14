"use client";
import { signIn } from "next-auth/react";
import { SpotifyIcon } from "@/components/icons/SpotifyIcon";
import { Footer } from "../layout/Footer";

export function LoginPage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family:var(--font-geist-sans)] bg-gray-900 text-white">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h1 className="text-4xl font-bold mb-8 text-white">Snobify</h1>

        <div className="flex flex-col items-center gap-6 p-8 rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
          <p className="text-gray-300 text-center max-w-md">
            Connect your Spotify account to get started.
          </p>

          <button
            onClick={() => signIn("spotify")}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-medium transition-colors"
          >
            <SpotifyIcon className="w-5 h-5" />
            Continue with Spotify
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
