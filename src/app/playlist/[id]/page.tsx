import { use, Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { fetchPlaylist } from "@/services/spotify";
import { PlaylistContent } from "./playlist-content";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
}

export default function PlaylistPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params);
  const playlistPromise = fetchPlaylist(resolvedParams.id);

  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <PlaylistContent playlistPromise={playlistPromise} />
      </Suspense>
    </>
  );
}
