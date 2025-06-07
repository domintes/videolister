import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaCheck, FaTimes } from 'react-icons/fa';
import { useAtom } from 'jotai';
import { browserTabsAtom } from '../../store/atoms';
import { BrowserTab } from '../../types';
import { getBrowserTabs } from '../../services/electronService';
import './BrowserTabsImporter.css';

interface BrowserTabsImporterProps {
  onImportTabs: (tabs: BrowserTab[]) => void;
}

export const BrowserTabsImporter: React.FC<BrowserTabsImporterProps> = ({ onImportTabs }) => {
  const [browserTabs, setBrowserTabs] = useAtom(browserTabsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTabs, setSelectedTabs] = useState<BrowserTab[]>([]);
  
  const loadBrowserTabs = async () => {
    setIsLoading(true);
    try {
      const tabs = await getBrowserTabs();
      setBrowserTabs(tabs);
    } catch (error) {
      console.error('Błąd podczas pobierania kart przeglądarki:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleTabSelection = (tab: BrowserTab) => {
    const isSelected = selectedTabs.some(t => t.url === tab.url);
    
    if (isSelected) {
      setSelectedTabs(selectedTabs.filter(t => t.url !== tab.url));
    } else {
      setSelectedTabs([...selectedTabs, tab]);
    }
  };
  
  const handleImport = () => {
    onImportTabs(selectedTabs);
    setIsOpen(false);
    setSelectedTabs([]);
  };
  
  return (
    <div className="browser-tabs-importer">
      <motion.button 
        className="import-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && browserTabs.length === 0) {
            loadBrowserTabs();
          }
        }}
      >
        <FaDownload /> Importuj z przeglądarki
      </motion.button>
      
      {isOpen && (
        <motion.div 
          className="tabs-modal"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="tabs-modal-header">
            <h3>Importuj linki z przeglądarki</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          
          <div className="tabs-content">
            {isLoading ? (
              <div className="loading">Ładowanie kart...</div>
            ) : browserTabs.length === 0 ? (
              <div className="no-tabs">
                <p>Nie znaleziono otwartych kart lub nie można uzyskać dostępu do przeglądarki.</p>
                <button onClick={loadBrowserTabs}>Spróbuj ponownie</button>
              </div>
            ) : (
              <>
                <div className="tabs-list">
                  {browserTabs.map((tab, index) => (
                    <div 
                      key={index}
                      className={`tab-item ${selectedTabs.some(t => t.url === tab.url) ? 'selected' : ''}`}
                      onClick={() => toggleTabSelection(tab)}
                    >
                      <div className="tab-icon">
                        {tab.favIconUrl ? (
                          <img src={tab.favIconUrl} alt="" />
                        ) : (
                          <div className="default-icon"></div>
                        )}
                      </div>
                      <div className="tab-info">
                        <h4>{tab.title}</h4>
                        <p>{tab.url}</p>
                      </div>
                      <div className="tab-select">
                        {selectedTabs.some(t => t.url === tab.url) && <FaCheck />}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="tabs-actions">
                  <button 
                    className="select-all"
                    onClick={() => {
                      if (selectedTabs.length === browserTabs.length) {
                        setSelectedTabs([]);
                      } else {
                        setSelectedTabs([...browserTabs]);
                      }
                    }}
                  >
                    {selectedTabs.length === browserTabs.length ? 'Odznacz wszystkie' : 'Zaznacz wszystkie'}
                  </button>
                  
                  <button 
                    className="import-selected"
                    disabled={selectedTabs.length === 0}
                    onClick={handleImport}
                  >
                    Importuj zaznaczone ({selectedTabs.length})
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
