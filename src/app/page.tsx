"use client";
import { useSession } from "@/lib/auth-client";
import { useAuthLogger } from "@/hooks/useAuthLogger";
import { LoginPage } from "@/components/auth/Login";
import { Navbar } from "@/components/layout/Navbar";
import { useState, use, Suspense, useTransition, useEffect } from "react";
import { searchTracks } from "@/services/spotify";

function SearchResultsContent({ tracksPromise }: { tracksPromise: Promise<any[]> }) {
  const tracks = use(tracksPromise);
  
  return (
    <div className="absolute w-full mt-2 bg-zinc-800 rounded-lg shadow-lg max-h-96 overflow-y-auto z-10">
      {tracks.length === 0 ? (
        <div className="px-4 py-3 text-gray-400">No results found</div>
      ) : (
        tracks.map((result) => (
          <div
            key={result.id}
            className="px-4 py-3 hover:bg-zinc-700 cursor-pointer transition"
          >
            <div className="text-white">{result.name}</div>
            <div className="text-sm text-gray-400">
              {result.artists[0]?.name}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function SearchResults({ tracksPromise }: { tracksPromise: Promise<any[]> }) {
  return (
    <Suspense fallback={
      <div className="absolute w-full mt-2 bg-zinc-800 rounded-lg shadow-lg z-10">
        <div className="px-4 py-3 text-gray-400">Searching...</div>
      </div>
    }>
      <SearchResultsContent tracksPromise={tracksPromise} />
    </Suspense>
  );
}

export default function Home() {
  const { data: session, isPending } = useSession();
  const status = session ? "authenticated" : isPending ? "loading" : "unauthenticated";
  useAuthLogger(session);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tracksPromise, setTracksPromise] = useState<Promise<any[]> | null>(null);
  const [isSearchPending, startTransition] = useTransition();
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        // Start the server action fetch and store the promise locally
        startTransition(() => {
          setTracksPromise(searchTracks(searchQuery));
        });
      } else {
        setTracksPromise(null);
      }
    }, 150); // 150ms debounce for faster response

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <>
      {status !== "authenticated" ? (
        <LoginPage />
      ) : (
        <div className="min-h-screen bg-zinc-950 text-white">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-1/2 relative mt-6">
              <input
                type="text"
                placeholder="Search for songs, artists, or albums..."
                className="w-full px-4 py-3 bg-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
              />

              {/* Autocomplete dropdown */}
              {tracksPromise && (
                <SearchResults tracksPromise={tracksPromise} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
