import { BrowserTab } from '../types';

// Bezpieczne importowanie modułu electron
const electron = window.require ? window.require('electron') : null;
const ipcRenderer = electron ? electron.ipcRenderer : null;

// Funkcja do sprawdzania, czy jesteśmy w kontekście Electron
export const isElectron = () => {
  return window && window.process && window.process.type === 'renderer';
};

// Funkcja do pobierania kart z aktualnie otwartej przeglądarki
export const getBrowserTabs = async (): Promise<BrowserTab[]> => {
  try {
    if (!isElectron() || !ipcRenderer) {
      console.warn('Funkcja getBrowserTabs wywołana poza kontekstem Electron');
      return getMockBrowserTabs();
    }
    
    const response = await ipcRenderer.invoke('get-browser-tabs');
    
    if (response.success) {
      return response.data || getMockBrowserTabs();
    }
    
    throw new Error('Nie udało się pobrać kart przeglądarki');
  } catch (error) {
    console.error('Błąd podczas pobierania kart przeglądarki:', error instanceof Error ? error.message : error);
    return getMockBrowserTabs();
  }
};

// Funkcja pomocnicza do generowania przykładowych danych
const getMockBrowserTabs = (): BrowserTab[] => {
  return [
    {
      title: 'YouTube - Przykładowy film',
      url: 'https://www.youtube.com/watch?v=example',
      favIconUrl: 'https://www.youtube.com/favicon.ico',
    },
    {
      title: 'Vimeo - Inny przykładowy film',
      url: 'https://vimeo.com/example',
      favIconUrl: 'https://vimeo.com/favicon.ico',
    },
    {
      title: 'DailyMotion - Jeszcze inny film',
      url: 'https://www.dailymotion.com/video/example',
      favIconUrl: 'https://www.dailymotion.com/favicon.ico',
    }
  ];
};

// Funkcja do zapisywania danych aplikacji lokalnie
export const saveAppData = async (data: any): Promise<boolean> => {
  try {
    if (!isElectron() || !ipcRenderer) {
      console.warn('Funkcja saveAppData wywołana poza kontekstem Electron');
      // W środowisku deweloperskim możemy używać localStorage jako fallback
      localStorage.setItem('app_data', JSON.stringify(data));
      return true;
    }
    
    const response = await ipcRenderer.invoke('save-app-data', data);
    return response.success || false;
  } catch (error) {
    console.error('Błąd podczas zapisywania danych:', error instanceof Error ? error.message : error);
    return false;
  }
};

// Funkcja do wczytywania danych aplikacji
export const loadAppData = async (): Promise<any> => {  try {
    if (!isElectron() || !ipcRenderer) {
      console.warn('Funkcja loadAppData wywołana poza kontekstem Electron');
      // W środowisku deweloperskim możemy używać localStorage jako fallback
      const savedData = localStorage.getItem('app_data');
      return savedData ? { success: true, data: JSON.parse(savedData) } : { success: false };
    }
    
    return await ipcRenderer.invoke('load-app-data');
  } catch (error) {
    console.error('Błąd podczas wczytywania danych:', error);
    
    // Sprawdzenie typu error i bezpieczne wyciągnięcie message
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
    return { success: false, error: errorMessage };
  }
};
