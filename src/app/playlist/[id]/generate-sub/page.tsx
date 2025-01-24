"use client";
import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RadioGroup, Combobox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { searchPlaylistArtists, generateFilteredPlaylist, getUserPlaylists } from "@/services/spotify";
import { generateSubPlaylistName } from "@/utils/playlist";
import { Navbar } from "@/components/layout/Navbar";

type FilterType = "artists" | "genres";
type FilterItem = { id: string; name: string };

export default function GenerateSubPlaylistPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const resolvedParams = use(params);
  const [filterType, setFilterType] = useState<FilterType>("artists");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<FilterItem[]>([]);
  const [suggestions, setSuggestions] = useState<FilterItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalPlaylistName, setOriginalPlaylistName] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  // Fetch original playlist name
  useEffect(() => {
    const fetchPlaylistName = async () => {
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
        setOriginalPlaylistName(data.name);
      } catch (err) {
        setError('Failed to fetch playlist details');
      }
    };

    fetchPlaylistName();
  }, [resolvedParams.id, session?.accessToken]);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim() || !session?.accessToken) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const artists = await searchPlaylistArtists(
        resolvedParams.id,
        query,
        session.accessToken
      );
      setSuggestions(artists);
    } catch (err) {
      setError('Failed to fetch suggestions');
    } finally {
      setIsSearching(false);
    }
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

  const handleGeneratePlaylist = async () => {
    if (!session?.accessToken || selectedFilters.length === 0 || !session.user?.id) {
      console.log('Generation cancelled: Missing required data', {
        hasAccessToken: !!session?.accessToken,
        selectedFiltersCount: selectedFilters.length,
        hasUserId: !!session?.user?.id
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    console.log('Starting playlist generation process...', {
      originalPlaylistId: resolvedParams.id,
      selectedArtists: selectedFilters.map(f => f.name)
    });

    try {
      // Get existing playlist names
      console.log('Fetching existing playlists...');
      const playlists = await getUserPlaylists(session.accessToken);
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
        session.user.id,
        session.accessToken
      );

      console.log('Playlist created successfully!', { newPlaylistId });
      // Navigate to the new playlist
      router.push(`/playlist/${newPlaylistId}`);
    } catch (err) {
      console.error('Failed to generate playlist:', err);
      setError('Failed to generate playlist');
    } finally {
      setIsLoading(false);
    }
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
            <RadioGroup value={filterType} onChange={setFilterType} className="flex justify-center gap-4">
              <RadioGroup.Option value="artists">
                {({ checked }) => (
                  <button
                    className={`px-6 py-3 rounded-full font-medium transition-colors ${
                      checked
                        ? "bg-green-500 text-white"
                        : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                    }`}
                  >
                    Filter by Artists
                  </button>
                )}
              </RadioGroup.Option>
              <RadioGroup.Option value="genres" disabled>
                {({ checked }) => (
                  <button
                    className={`px-6 py-3 rounded-full font-medium transition-colors ${
                      checked
                        ? "bg-green-500 text-white"
                        : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                    } opacity-50 cursor-not-allowed`}
                  >
                    Filter by Genres
                  </button>
                )}
              </RadioGroup.Option>
            </RadioGroup>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Select {filterType === "artists" ? "Artists" : "Genres"}
            </h2>
            
            {/* Search Input with Combobox */}
            <div className="relative mb-4">
              <Combobox<FilterItem>
                value={{ id: '', name: '' }}
                onChange={(item: FilterItem) => {
                  if (item && item.id !== '') {
                    handleFilterSelect(item);
                  }
                }}
                nullable={false}
              >
                <div className="relative">
                  <Combobox.Input
                    className="w-full px-4 py-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
                    placeholder={`Search for ${filterType === "artists" ? "artists" : "genres"}...`}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    displayValue={() => searchQuery}
                    autoComplete="off"
                  />
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setSuggestions([])}
                  >
                    <Combobox.Options className="absolute w-full mt-1 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 max-h-60 overflow-y-auto z-10">
                      {isSearching ? (
                        <div className="px-4 py-2 text-sm text-gray-400">
                          Searching...
                        </div>
                      ) : suggestions.length === 0 && searchQuery !== '' ? (
                        <div className="px-4 py-2 text-sm text-gray-400">
                          No results found
                        </div>
                      ) : (
                        suggestions.map((suggestion) => (
                          <Combobox.Option
                            key={suggestion.id}
                            value={suggestion}
                            className={({ active }) =>
                              `px-4 py-2 cursor-pointer ${
                                active ? 'bg-zinc-700 text-white' : 'text-gray-200'
                              }`
                            }
                          >
                            {suggestion.name}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </Transition>
                </div>
              </Combobox>
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

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={handleGeneratePlaylist}
              disabled={isLoading || selectedFilters.length === 0}
              className={`px-8 py-3 rounded-full font-medium transition-colors ${
                isLoading || selectedFilters.length === 0
                  ? "bg-zinc-700 text-gray-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isLoading ? "Generating..." : "Generate Sub-Playlist"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 