"use client";
import { useState, useEffect, use, useTransition } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { searchPlaylistArtists, generateFilteredPlaylist, fetchPlaylists } from "@/services/spotify";
import { generateSubPlaylistName } from "@/utils/playlist";
import { Navbar } from "@/components/layout/Navbar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type FilterType = "artists" | "genres";
type FilterItem = { id: string; name: string };

export default function GenerateSubPlaylistPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const router = useRouter();
  const { data } = useSession();
  const resolvedParams = use(params);
  const [isPending, startTransition] = useTransition();
  const [isSearchPending, startSearchTransition] = useTransition();
  const [filterType, setFilterType] = useState<FilterType>("artists");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<FilterItem[]>([]);
  const [suggestions, setSuggestions] = useState<FilterItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [originalPlaylistName, setOriginalPlaylistName] = useState<string>("");

  // Fetch original playlist name
  useEffect(() => {
    const fetchPlaylistName = async () => {
      const token = data?.session.token;
      if (!token) return;

      startTransition(async () => {
        try {
          const response = await fetch(
            `https://api.spotify.com/v1/playlists/${resolvedParams.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) throw new Error('Failed to fetch playlist');
          
          const data = await response.json();
          setOriginalPlaylistName(data.name);
        } catch (err) {
          setError('Failed to fetch playlist details');
        }
      });
    };

    if (data?.session) {
      fetchPlaylistName();
    }
  }, [resolvedParams.id, data?.session]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const token = data?.session.token;
    if (!token) {
      setSuggestions([]);
      return;
    }

    startSearchTransition(async () => {
      try {
        const artists = await searchPlaylistArtists(resolvedParams.id, query);
        setSuggestions(artists);
      } catch (err) {
        setError('Failed to fetch suggestions');
      }
    });
  };

  const handleFilterSelect = (filter: FilterItem) => {
    if (!selectedFilters.some(f => f.id === filter.id)) {
      setSelectedFilters([...selectedFilters, filter]);
    }
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleFilterRemove = (filterId: string) => {
    setSelectedFilters(selectedFilters.filter(f => f.id !== filterId));
  };

  const handleGeneratePlaylist = () => {
    const token = data?.session.token;
    const userId = localStorage.getItem("userId");

    if (!token || selectedFilters.length === 0 || !userId) {
      console.log('Generation cancelled: Missing required data', {
        hasAccessToken: !!token,
        selectedFiltersCount: selectedFilters.length,
        hasUserId: !!userId
      });
      return;
    }
    
    startTransition(async () => {
      setError(null);
      console.log('Starting playlist generation process...', {
        originalPlaylistId: resolvedParams.id,
        selectedArtists: selectedFilters.map(f => f.name)
      });

      try {
        // Get existing playlist names
        console.log('Fetching existing playlists...');
        const playlists = await fetchPlaylists();
        const existingNames = playlists.map(p => p.name);
        
        // Generate new playlist name
        const newPlaylistName = generateSubPlaylistName(existingNames, originalPlaylistName);
        console.log('Generated new playlist name:', newPlaylistName);

        // Create the filtered playlist
        console.log('Creating filtered playlist...');
        const newPlaylistId = await generateFilteredPlaylist(
          resolvedParams.id,
          newPlaylistName,
          selectedFilters.map(f => f.id),
          userId,
        );

        console.log('Playlist created successfully!', { newPlaylistId });
        // Navigate to the new playlist
        router.push(`/playlist/${newPlaylistId}`);
      } catch (err) {
        console.error('Failed to generate playlist:', err);
        setError('Failed to generate playlist');
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-zinc-900 text-white">
        <div className="max-w-2xl mx-auto py-12 px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Generate Sub-Playlist</h1>
          
          {/* Filter Type Selection */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-center">Choose Filter Type</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setFilterType("artists")}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  filterType === "artists"
                    ? "bg-green-500 text-white"
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                }`}
              >
                Filter by Artists
              </button>
              <button
                onClick={() => setFilterType("genres")}
                disabled
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  filterType === "genres"
                    ? "bg-green-500 text-white"
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                } opacity-50 cursor-not-allowed`}
              >
                Filter by Genres
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Select {filterType === "artists" ? "Artists" : "Genres"}
            </h2>
            
            {/* Search Input with Combobox */}
            <div className="relative mb-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
                  placeholder={`Search for ${filterType === "artists" ? "artists" : "genres"}...`}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  autoComplete="off"
                />
                {(suggestions.length > 0 || isSearchPending || (suggestions.length === 0 && searchQuery !== '')) && (
                  <div className="absolute w-full mt-1 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 max-h-60 overflow-y-auto z-10">
                    <Command className="bg-zinc-800 border-0">
                      <CommandList>
                        {isSearchPending ? (
                          <div className="px-4 py-2 text-sm text-gray-400">
                            Searching...
                          </div>
                        ) : suggestions.length === 0 && searchQuery !== '' ? (
                          <CommandEmpty className="text-gray-400 py-4">
                            No results found
                          </CommandEmpty>
                        ) : (
                          <CommandGroup>
                            {suggestions.map((suggestion) => (
                              <CommandItem
                                key={suggestion.id}
                                value={suggestion.name}
                                onSelect={() => handleFilterSelect(suggestion)}
                                className="text-gray-200 data-[selected=true]:bg-zinc-700 data-[selected=true]:text-white cursor-pointer"
                              >
                                {suggestion.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Filters */}
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-full"
                >
                  <span className="text-sm text-gray-200">{filter.name}</span>
                  <button
                    onClick={() => handleFilterRemove(filter.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-red-500 bg-red-500/10 p-4 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={handleGeneratePlaylist}
              disabled={isPending || selectedFilters.length === 0}
              className={`px-8 py-3 rounded-full font-medium transition-colors ${
                isPending || selectedFilters.length === 0
                  ? "bg-zinc-700 text-gray-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isPending ? "Generating..." : "Generate Sub-Playlist"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 