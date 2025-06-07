import React from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import { useAtom } from 'jotai';
import { playlistsAtom, createPlaylist } from '../../store/atoms';
import { Playlist } from '../../types';
import './PlaylistSidebar.css';

interface PlaylistSidebarProps {
  onSelectPlaylist: (playlist: Playlist) => void;
}

export const PlaylistSidebar: React.FC<PlaylistSidebarProps> = ({ onSelectPlaylist }) => {
  const [playlists, setPlaylists] = useAtom(playlistsAtom);
  
  const handleCreatePlaylist = () => {
    const newPlaylist = createPlaylist('Nowa playlista');
    setPlaylists([...playlists, newPlaylist]);
    onSelectPlaylist(newPlaylist);
  };
  
  // Rekursywne renderowanie playlist i ich podplaylist
  const renderPlaylists = (items: Playlist[], level = 0) => {
    return items.map((item) => (
      <div key={item.id} style={{ marginLeft: `${level * 16}px` }}>
        <motion.div 
          className="playlist-item"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectPlaylist(item)}
        >
          {item.name}
        </motion.div>
        {item.subPlaylists.length > 0 && renderPlaylists(item.subPlaylists, level + 1)}
      </div>
    ));
  };
  
  return (
    <div className="playlist-sidebar">
      <div className="sidebar-header">
        <h2>Playlisty</h2>
        <motion.button 
          className="add-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCreatePlaylist}
        >
          <FaPlus />
        </motion.button>
      </div>
      <div className="playlists-container">
        {renderPlaylists(playlists)}
      </div>
    </div>
  );
};
