const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWin;

// listen for ready
app.on('ready', function() {
    mainWindow = new BrowserWindow({});
    // load html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol:'file:',
        slashes: true
    }));

    // close all windows on quit
    mainWindow.on('closed', function() {
        app.quit();
    });
    // build menu from menu template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

// create new window to add an item
function addItemWindow() {
    addWin = new BrowserWindow({
        width: 300,
        height: 200,
        title: "Add Item"
    });
    // load html
    addWin.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol:'file:',
        slashes: true
    }));

    // garbage collection
    addWin.on('close', function(){
        addWin = null;
    });
}

// catch item:add
ipcMain.on('item:add', function(e, item) {
    // console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWin.close();
});

// remove items



// menu template

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {label: 'Add Item',
               accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
               click(){
                    addItemWindow();
               } 
            },
            {label: 'Clear All Items',
                click() {
                    mainWindow.webContents.send('item:clear');
                }    
            },
            {label: 'Quit', 
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click()
                    {app.quit();
            }},
        ]
    }
];

// if mac add empty menu object
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

if (process.env.node_env != 'production'){
    mainMenuTemplate.push({
        label: 'DevTools',
        submenu:[
            {
            label: 'Toggle DevTools',
            accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focustedWindow){
                    focustedWindow.toggleDevTools();
                }
            },
            {   
                label: 'Refresh Page',
                accelerator: process.platform == 'darwin'  ? 'Command+R' : 'Ctrl+R',
                role: 'reload'
            }
        
        ],

    });
}
