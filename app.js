const { app, BrowserWindow, Menu } = require('electron');
const DiscordRPC = require('discord-rpc');

// Define your Discord application ID
const discordAppId = 'YOUR_APPLICATION_ID';

// Initialize Discord RPC
DiscordRPC.register(discordAppId);
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load your initial URL
  mainWindow.loadURL('https://swatchseries.is/movie');

  // Register page load event
  mainWindow.webContents.on('did-navigate', () => {
    updatePresence();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // Initialize Discord RPC
  rpc.login({ clientId: discordAppId }).catch(console.error);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

async function updatePresence() {
  if (!rpc || !mainWindow) {
    return;
  }

  const url = mainWindow.webContents.getURL();
  let activity = {
    details: 'Exploring SwatchSeries Movies', // Replace with a more specific description
    state: 'Idle', // Use "Idle" or "Browsing" depending on your preference
    largeImageKey: 'https://raw.githubusercontent.com/Zirmith/swatchseries-rpc/main/icons/unnamed.png', // Define this in your Discord Developer Portal
    startTimestamp: new Date(),
  };

  // Customize the activity based on the URL
  if (url.includes('swatchseries.is/movie')) {
    activity.state = 'Browsing SwatchSeries Movies';
  } else if (url.includes('example.com')) {
    activity.state = 'Browsing Example Website';
  } // Add more conditions as needed for different websites

  rpc.setActivity(activity).catch(console.error);
}

rpc.on('ready', () => {
  // Set initial activity immediately
  updatePresence();

  // Update activity when the user navigates to a new page
  mainWindow.webContents.on('did-navigate-in-page', updatePresence);

  // Handle window close event
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});


app.on('ready', () => {
    createWindow();
  
    // Start Discord RPC connection
    rpc.login({ clientId: discordAppId }).catch((error) => {
      console.error('Failed to login to Discord:', error);
    });
  });
  
  // Quit when all windows are closed (except on macOS)
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
  // Create a new window when the app is activated (macOS)
  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
  