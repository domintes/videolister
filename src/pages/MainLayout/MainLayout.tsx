import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { playlistsAtom, currentPlaylistAtom } from '../../store/atoms';
import { PlaylistSidebar } from '../../components/PlaylistSidebar/PlaylistSidebar';
import { PlaylistContent } from '../../components/PlaylistContent/PlaylistContent';
import { TagsPanel } from '../../components/TagsPanel/TagsPanel';
import { BrowserTabsImporter } from '../../components/BrowserTabsImporter/BrowserTabsImporter';
import { Playlist, Video, BrowserTab } from '../../types';
import { createVideoFromUrl } from '../../store/atoms';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  const [playlists, setPlaylists] = useAtom(playlistsAtom);
  const [currentPlaylist, setCurrentPlaylist] = useAtom(currentPlaylistAtom);
  
  const handleSelectPlaylist = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
  };
  
  const handleImportBrowserTabs = (tabs: BrowserTab[]) => {
    if (!currentPlaylist) return;
    
    // Konwersja kart przeglądarki na obiekty Video
    const newVideos = tabs.map((tab) => createVideoFromUrl(tab.url, tab.title));
    
    // Dodanie nowych filmów do aktualnej playlisty
    const updatedPlaylists = playlists.map((playlist) => {
      if (playlist.id === currentPlaylist.id) {
        const updatedPlaylist = {
          ...playlist,
          videos: [...playlist.videos, ...newVideos],
          updatedAt: new Date(),
        };
        
        // Aktualizacja aktualnej playlisty
        setCurrentPlaylist(updatedPlaylist);
        
        return updatedPlaylist;
      }
      return playlist;
    });
    
    setPlaylists(updatedPlaylists);
  };
  
  return (
    <div className="main-layout">
      <aside className="sidebar">
        <PlaylistSidebar onSelectPlaylist={handleSelectPlaylist} />
      </aside>
      
      <main className="content-area">
        <div className="content-header">
          <TagsPanel />
          
          {currentPlaylist && (
            <div className="content-actions">
              <BrowserTabsImporter onImportTabs={handleImportBrowserTabs} />
            </div>
          )}
        </div>
        
        <PlaylistContent playlist={currentPlaylist} />
      </main>
    </div>
  );
};
