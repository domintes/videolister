import { atom } from 'jotai';
import { Playlist, Tag, BrowserTab, Video } from '../types';
import { nanoid } from 'nanoid';

// Podstawowe atomy stanu
export const playlistsAtom = atom<Playlist[]>([]);
export const currentPlaylistAtom = atom<Playlist | null>(null);
export const tagsAtom = atom<Tag[]>([]);
export const browserTabsAtom = atom<BrowserTab[]>([]);

// Atom pochodny dla filtrowanych playlist według tagów
export const filteredPlaylistsAtom = atom(
  (get) => {
    const playlists = get(playlistsAtom);
    const selectedTags = get(selectedTagsAtom);

    if (selectedTags.length === 0) {
      return playlists;
    }

    return playlists.filter((playlist) => 
      selectedTags.some((tag) => playlist.tags.includes(tag.id))
    );
  }
);

export const selectedTagsAtom = atom<Tag[]>([]);

// Funkcje pomocnicze
export const createPlaylist = (name: string, description: string = '') => {
  const newPlaylist: Playlist = {
    id: nanoid(),
    name,
    description,
    videos: [],
    subPlaylists: [],
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  return newPlaylist;
};

export const createTag = (name: string, color: string = '#3b82f6') => {
  const newTag: Tag = {
    id: nanoid(),
    name,
    color,
  };
  
  return newTag;
};

export const createVideoFromUrl = (url: string, title: string = '') => {
  // Logika do wykrywania źródła video na podstawie URL
  let source = 'unknown';
  let thumbnailUrl = '';
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    source = 'youtube';
    // Logika do ekstrakcji ID i generowania miniaturki dla YouTube
  } else if (url.includes('vimeo.com')) {
    source = 'vimeo';
    // Logika dla Vimeo
  } else if (url.includes('dailymotion.com')) {
    source = 'dailymotion';
    // Logika dla Dailymotion
  }
  
  const newVideo: Video = {
    id: nanoid(),
    title: title || url,
    url,
    thumbnailUrl,
    source,
    addedAt: new Date(),
    tags: [],
  };
  
  return newVideo;
}
