const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  // Tworzenie okna głównego aplikacji
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    title: 'Multi Website Video Playlist',
  });  // Ładowanie aplikacji React
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3002'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // Otwórz DevTools w trybie deweloperskim
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Obsługa zamknięcia okna
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Utworzenie okna aplikacji po zainicjowaniu Electron
app.whenReady().then(() => {
  createWindow();

  // W macOS, ponowne utworzenie okna po kliknięciu w dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Zamknięcie aplikacji (oprócz macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Obsługa komunikacji IPC między procesami
ipcMain.handle('get-browser-tabs', async () => {
  // W przyszłości: implementacja pobierania kart z przeglądarki
  // Warto rozważyć rozwiązania specyficzne dla systemu lub API przeglądarek
  return { 
    success: true, 
    message: 'Feature to be implemented',
    data: [
      // Przykładowe dane, w rzeczywistości będzie to pochodzić z przeglądarki
      {
        title: 'YouTube - Przykładowy film',
        url: 'https://www.youtube.com/watch?v=example',
        favIconUrl: 'https://www.youtube.com/favicon.ico',
      },
      {
        title: 'Vimeo - Inny przykładowy film',
        url: 'https://vimeo.com/example',
        favIconUrl: 'https://vimeo.com/favicon.ico',
      }
    ]
  };
});

// Dodajmy obsługę zapisywania i ładowania danych
const fs = require('fs');

const DATA_FILE_PATH = path.join(app.getPath('userData'), 'appData.json');

ipcMain.handle('save-app-data', async (event, data) => {
  try {
    await fs.promises.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Błąd podczas zapisywania danych:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-app-data', async () => {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      return { success: true, data: null };
    }
    
    const data = await fs.promises.readFile(DATA_FILE_PATH, 'utf-8');
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    console.error('Błąd podczas wczytywania danych:', error);
    return { success: false, error: error.message };
  }
});
