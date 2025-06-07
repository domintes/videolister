import React, { useEffect } from 'react';
import { Provider } from 'jotai';
import { MainLayout } from './pages/MainLayout/MainLayout';
import { loadAppData, saveAppData } from './services/electronService';
import { useAtom } from 'jotai';
import { playlistsAtom, tagsAtom } from './store/atoms';
import './App.css';

const AppContent: React.FC = () => {
  const [playlists, setPlaylists] = useAtom(playlistsAtom);
  const [tags, setTags] = useAtom(tagsAtom);
  
  // Wczytanie zapisanych danych przy uruchomieniu aplikacji
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await loadAppData();
        if (result?.success && result?.data) {
          const { playlists: savedPlaylists, tags: savedTags } = result.data;
          
          if (savedPlaylists?.length) setPlaylists(savedPlaylists);
          if (savedTags?.length) setTags(savedTags);
        }
      } catch (error) {
        console.error('Błąd podczas wczytywania danych:', error);
      }
    };
    
    loadData();
  }, [setPlaylists, setTags]);
  
  // Automatyczne zapisywanie danych przy zmianach
  useEffect(() => {
    if (playlists.length === 0 && tags.length === 0) return;
    
    const saveData = async () => {
      try {
        await saveAppData({ playlists, tags });
      } catch (error) {
        console.error('Błąd podczas zapisywania danych:', error);
      }
    };
    
    const timer = setTimeout(saveData, 500);
    return () => clearTimeout(timer);
  }, [playlists, tags]);
  
  return <MainLayout />;
};

function App() {
  return (
    <Provider>
      <div className="App">
        <AppContent />
      </div>
    </Provider>
  );
}

export default App;
