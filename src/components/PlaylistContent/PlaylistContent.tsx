import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTags, FaLayerGroup } from 'react-icons/fa';
import { useAtom } from 'jotai';
import { playlistsAtom, createVideoFromUrl } from '../../store/atoms';
import { Playlist, Video } from '../../types';
import './PlaylistContent.css';

interface PlaylistContentProps {
  playlist: Playlist | null;
}

export const PlaylistContent: React.FC<PlaylistContentProps> = ({ playlist }) => {
  const [playlists, setPlaylists] = useAtom(playlistsAtom);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  
  if (!playlist) {
    return (
      <div className="empty-state">
        <h2>Wybierz playlistę lub stwórz nową</h2>
      </div>
    );
  }
  
  const handleAddVideo = () => {
    if (!newVideoUrl.trim()) return;
    
    const newVideo = createVideoFromUrl(newVideoUrl);
    
    // Aktualizacja stanu z nowym video
    const updatedPlaylists = playlists.map(p => {
      if (p.id === playlist.id) {
        return {
          ...p,
          videos: [...p.videos, newVideo],
          updatedAt: new Date()
        };
      }
      return p;
    });
    
    setPlaylists(updatedPlaylists);
    setNewVideoUrl('');
  };
  
  const handleRemoveVideo = (videoId: string) => {
    const updatedPlaylists = playlists.map(p => {
      if (p.id === playlist.id) {
        return {
          ...p,
          videos: p.videos.filter(v => v.id !== videoId),
          updatedAt: new Date()
        };
      }
      return p;
    });
    
    setPlaylists(updatedPlaylists);
  };
  
  return (
    <div className="playlist-content">
      <div className="content-header">
        <h1>{playlist.name}</h1>
        <div className="header-actions">
          <motion.button 
            className="action-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Edytuj playlistę"
          >
            <FaEdit />
          </motion.button>
          <motion.button 
            className="action-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Zarządzaj tagami"
          >
            <FaTags />
          </motion.button>
          <motion.button 
            className="action-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Dodaj sub-playlistę"
          >
            <FaLayerGroup />
          </motion.button>
        </div>
      </div>
      
      {playlist.description && (
        <p className="playlist-description">{playlist.description}</p>
      )}
      
      <div className="add-video-form">
        <input 
          type="text" 
          value={newVideoUrl}
          onChange={(e) => setNewVideoUrl(e.target.value)}
          placeholder="Wklej URL do wideo..."
          onKeyPress={(e) => e.key === 'Enter' && handleAddVideo()}
        />
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddVideo}
        >
          <FaPlus /> Dodaj
        </motion.button>
      </div>
      
      <div className="videos-grid">
        {playlist.videos.length === 0 ? (
          <div className="no-videos">
            <p>Brak filmów w tej playliście. Dodaj pierwszy film powyżej!</p>
          </div>
        ) : (
          playlist.videos.map((video) => (
            <motion.div 
              key={video.id}
              className="video-card"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="thumbnail">
                {video.thumbnailUrl ? (
                  <img src={video.thumbnailUrl} alt={video.title} />
                ) : (
                  <div className="placeholder-thumbnail">
                    {video.source}
                  </div>
                )}
              </div>
              <div className="video-info">
                <h3>{video.title}</h3>
                <p className="video-source">{video.source}</p>
                <div className="video-actions">
                  <button onClick={() => window.open(video.url, '_blank')}>
                    Otwórz
                  </button>
                  <button onClick={() => handleRemoveVideo(video.id)} className="delete-btn">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
