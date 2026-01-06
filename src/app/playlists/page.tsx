import { Suspense } from "react";
import { fetchPlaylists } from "@/services/spotify";
import { PlaylistsClient } from "./playlists-client";

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
}

export default function PlaylistsPage() {
  const playlistsPromise = fetchPlaylists();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <PlaylistsClient playlistsPromise={playlistsPromise} />
    </Suspense>
  );
}
