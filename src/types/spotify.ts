// Spotify API Types

export interface Artist {
  id: string;
  name: string;
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album?: {
    name: string;
    images: { url: string }[];
  };
  duration_ms?: number;
}

export interface PlaylistTrack {
  track: Track;
  added_at?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  next: string | null;
}

export interface PlaylistImage {
  url: string;
}

export interface PlaylistOwner {
  display_name: string;
}

export interface PlaylistTracksInfo {
  total: number;
  items?: PlaylistTrack[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string | null;
  images: PlaylistImage[];
  owner: PlaylistOwner;
  tracks: PlaylistTracksInfo;
}

// Simplified playlist for list views
export interface PlaylistSummary {
  id: string;
  name: string;
  images: PlaylistImage[];
  tracks: {
    total: number;
  };
  owner: PlaylistOwner;
}

// API Response types
export interface PlaylistsApiResponse {
  items: PlaylistSummary[];
  next: string | null;
}

// Search result types
export interface SearchTrack extends Track {
  album: {
    name: string;
    images: { url: string }[];
  };
}

export interface SearchResponse {
  tracks?: {
    items: SearchTrack[];
  };
}

