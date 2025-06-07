// Definicje typów dla aplikacji

// Typ dla pojedynczego video
export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  source: string; // np. 'youtube', 'vimeo', itp.
  addedAt: Date;
  tags: string[];
}

// Typ dla playlisty
export interface Playlist {
  id: string;
  name: string;
  description?: string;
  videos: Video[];
  subPlaylists: Playlist[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Typ dla tagu użytkownika
export interface Tag {
  id: string;
  name: string;
  color: string;
}

// Typ dla zakładki przeglądarki
export interface BrowserTab {
  title: string;
  url: string;
  favIconUrl?: string;
}

// Typ dla stanu aplikacji
export interface AppState {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  tags: Tag[];
  browserTabs: BrowserTab[];
}
