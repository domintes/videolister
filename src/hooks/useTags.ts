import { useAtom } from 'jotai';
import { tagsAtom, playlistsAtom, selectedTagsAtom, createTag } from '../store/atoms';
import { Tag, Playlist } from '../types';

export const useTags = () => {
  const [tags, setTags] = useAtom(tagsAtom);
  const [selectedTags, setSelectedTags] = useAtom(selectedTagsAtom);
  const [playlists, setPlaylists] = useAtom(playlistsAtom);
  
  // Dodaj nowy tag
  const addTag = (name: string, color: string = '#3b82f6') => {
    const newTag = createTag(name, color);
    setTags([...tags, newTag]);
    return newTag;
  };
  
  // Usuń tag
  const removeTag = (tagId: string) => {
    // Usuń tag z listy tagów
    setTags(tags.filter(tag => tag.id !== tagId));
    
    // Usuń też ten tag z wybranych, jeśli tam jest
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
    
    // Usuń ten tag ze wszystkich playlist, które go używają
    const updatedPlaylists = playlists.map(playlist => ({
      ...playlist,
      tags: playlist.tags.filter(id => id !== tagId),
      videos: playlist.videos.map(video => ({
        ...video,
        tags: video.tags.filter(id => id !== tagId)
      })),
      subPlaylists: removeTagFromSubPlaylists(playlist.subPlaylists, tagId)
    }));
    
    setPlaylists(updatedPlaylists);
  };
  
  // Funkcja pomocnicza do rekursywnego usuwania tagu z subPlaylist
  const removeTagFromSubPlaylists = (subPlaylists: Playlist[], tagId: string): Playlist[] => {
    return subPlaylists.map(sp => ({
      ...sp,
      tags: sp.tags.filter(id => id !== tagId),
      videos: sp.videos.map(video => ({
        ...video, 
        tags: video.tags.filter(id => id !== tagId)
      })),
      subPlaylists: sp.subPlaylists.length > 0 
        ? removeTagFromSubPlaylists(sp.subPlaylists, tagId) 
        : sp.subPlaylists
    }));
  };
  
  // Dodaj tag do playlisty
  const addTagToPlaylist = (playlistId: string, tagId: string) => {
    const updatedPlaylists = playlists.map(p => {
      if (p.id === playlistId) {
        // Dodaj tag tylko jeśli jeszcze go tam nie ma
        if (!p.tags.includes(tagId)) {
          return {
            ...p,
            tags: [...p.tags, tagId],
            updatedAt: new Date()
          };
        }
      }
      
      // Sprawdź też w podplaylistach
      if (p.subPlaylists.length > 0) {
        return {
          ...p,
          subPlaylists: addTagToSubPlaylists(p.subPlaylists, playlistId, tagId)
        };
      }
      
      return p;
    });
    
    setPlaylists(updatedPlaylists);
  };
  
  // Funkcja pomocnicza dla dodawania tagu do subPlaylist
  const addTagToSubPlaylists = (subPlaylists: Playlist[], targetId: string, tagId: string): Playlist[] => {
    return subPlaylists.map(sp => {
      if (sp.id === targetId) {
        // Dodaj tag tylko jeśli jeszcze go tam nie ma
        if (!sp.tags.includes(tagId)) {
          return {
            ...sp,
            tags: [...sp.tags, tagId],
            updatedAt: new Date()
          };
        }
      }
      
      // Sprawdź też w podplaylistach
      if (sp.subPlaylists.length > 0) {
        return {
          ...sp,
          subPlaylists: addTagToSubPlaylists(sp.subPlaylists, targetId, tagId)
        };
      }
      
      return sp;
    });
  };
  
  // Przełącz wybór tagu (zaznacz/odznacz)
  const toggleTagSelection = (tag: Tag) => {
    if (selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Pobierz playlisty przefiltrowane według wybranych tagów
  const getFilteredPlaylists = () => {
    if (selectedTags.length === 0) {
      return playlists;
    }
    
    // Funkcja sprawdzająca czy playlista ma którykolwiek z wybranych tagów
    const hasSelectedTag = (playlist: Playlist): boolean => {
      const hasDirectTag = selectedTags.some(tag => 
        playlist.tags.includes(tag.id)
      );
      
      if (hasDirectTag) return true;
      
      // Sprawdź też w podplaylistach
      if (playlist.subPlaylists.length > 0) {
        return playlist.subPlaylists.some(hasSelectedTag);
      }
      
      return false;
    };
    
    return playlists.filter(hasSelectedTag);
  };
  
  return {
    tags,
    selectedTags,
    addTag,
    removeTag,
    addTagToPlaylist,
    toggleTagSelection,
    getFilteredPlaylists
  };
};

export default useTags;
