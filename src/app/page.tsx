"use client";
import { useSession } from "next-auth/react";
import { useAuthLogger } from "@/hooks/useAuthLogger";
import { LoginPage } from "@/components/auth/Login";
import { Navbar } from "@/components/layout/Navbar";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  useAuthLogger(session);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<{ [value: string]: any }>({});
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchAutocompleteOptions = async (value: string) => {
    setLoading(true);

    if (cache[value]) {
      setSearchResults(cache[value]);
      setLoading(false);
      return;
    }

    // fetch Spotify API
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          value
        )}&type=track&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      const data = await response.json();

      setCache((oldCache) => ({
        ...oldCache,
        [value]: data.tracks.items,
      }));

      setSearchResults(data.tracks.items);
    } catch (err) {
      // TODO: Display error message
      console.error("Error fetching search results: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (searchQuery) {
        fetchAutocompleteOptions(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300); // Adjust the delay as needed

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  return (
    <>
      {status !== "authenticated" ? (
        <LoginPage />
      ) : (
        <div className="min-h-screen bg-zinc-950 text-white">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-1/2 relative">
              <input
                type="text"
                placeholder="Search for songs, artists, or albums..."
                className="w-full px-4 py-3 bg-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
              />

              {/* Autocomplete dropdown */}
              <div className=" w-full mt-2 bg-zinc-800 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="px-4 py-3 hover:bg-zinc-700 cursor-pointer transition"
                  >
                    <div className="text-white">{result.name}</div>
                    <div className="text-sm text-gray-400">
                      {result.artists[0].name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
