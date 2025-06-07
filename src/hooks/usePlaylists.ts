import { useAtom } from 'jotai';
import { playlistsAtom, currentPlaylistAtom, createVideoFromUrl } from '../store/atoms';
import { Playlist, Video } from '../types';

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useAtom(playlistsAtom);
  const [currentPlaylist, setCurrentPlaylist] = useAtom(currentPlaylistAtom);
  
  // Dodaj film do playlisty
  const addVideoToPlaylist = (playlistId: string, videoUrl: string, videoTitle?: string) => {
    const newVideo = createVideoFromUrl(videoUrl, videoTitle);
    
    const updatedPlaylists = playlists.map(p => {
      if (p.id === playlistId) {
        return {
          ...p,
          videos: [...p.videos, newVideo],
          updatedAt: new Date()
        };
      }
      
      // Sprawdź też subPlaylisty (funkcja rekursywna)
      if (p.subPlaylists.length > 0) {
        return {
          ...p,
          subPlaylists: updateSubPlaylists(p.subPlaylists, playlistId, newVideo)
        };
      }
      
      return p;
    });
    
    setPlaylists(updatedPlaylists);
    
    // Aktualizacja aktualnie wybranej playlisty jeśli potrzebne
    if (currentPlaylist && currentPlaylist.id === playlistId) {
      const updatedCurrentPlaylist = updatedPlaylists.find(p => p.id === playlistId);
      if (updatedCurrentPlaylist) {
        setCurrentPlaylist(updatedCurrentPlaylist);
      }
    }
    
    return newVideo;
  };
  
  // Funkcja pomocnicza do rekursywnego aktualizowania subPlaylist
  const updateSubPlaylists = (subPlaylists: Playlist[], targetId: string, newVideo: Video): Playlist[] => {
    return subPlaylists.map(sp => {
      if (sp.id === targetId) {
        return {
          ...sp,
          videos: [...sp.videos, newVideo],
          updatedAt: new Date()
        };
      }
      
      if (sp.subPlaylists.length > 0) {
        return {
          ...sp,
          subPlaylists: updateSubPlaylists(sp.subPlaylists, targetId, newVideo)
        };
      }
      
      return sp;
    });
  };
  
  // Usuń film z playlisty
  const removeVideoFromPlaylist = (playlistId: string, videoId: string) => {
    const updatedPlaylists = playlists.map(p => {
      if (p.id === playlistId) {
        return {
          ...p,
          videos: p.videos.filter(v => v.id !== videoId),
          updatedAt: new Date()
        };
      }
      
      // Sprawdź też subPlaylisty (funkcja rekursywna)
      if (p.subPlaylists.length > 0) {
        return {
          ...p,
          subPlaylists: removeVideoFromSubPlaylists(p.subPlaylists, playlistId, videoId)
        };
      }
      
      return p;
    });
    
    setPlaylists(updatedPlaylists);
    
    // Aktualizacja aktualnie wybranej playlisty jeśli potrzebne
    if (currentPlaylist && currentPlaylist.id === playlistId) {
      const updatedCurrentPlaylist = updatedPlaylists.find(p => p.id === playlistId);
      if (updatedCurrentPlaylist) {
        setCurrentPlaylist(updatedCurrentPlaylist);
      }
    }
  };
  
  // Funkcja pomocnicza do rekursywnego usuwania video z subPlaylist
  const removeVideoFromSubPlaylists = (subPlaylists: Playlist[], targetId: string, videoId: string): Playlist[] => {
    return subPlaylists.map(sp => {
      if (sp.id === targetId) {
        return {
          ...sp,
          videos: sp.videos.filter(v => v.id !== videoId),
          updatedAt: new Date()
        };
      }
      
      if (sp.subPlaylists.length > 0) {
        return {
          ...sp,
          subPlaylists: removeVideoFromSubPlaylists(sp.subPlaylists, targetId, videoId)
        };
      }
      
      return sp;
    });
  };
  
  // Dodaj subplaylistę do playlisty
  const addSubplaylist = (parentId: string, name: string, description?: string) => {
    // Implementacja podobna do powyższych funkcji, ale tworząca i dodająca nową playlistę
  };
  
  return {
    playlists,
    currentPlaylist,
    setCurrentPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    addSubplaylist
  };
};

export default usePlaylists;
