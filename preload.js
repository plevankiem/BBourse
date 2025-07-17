const { contextBridge, ipcRenderer } = require('electron');
const fs = require("fs");
const path = require('path');

contextBridge.exposeInMainWorld('electron', {
    sendPrices: (beers) => ipcRenderer.send('update-beer-prices', beers),
    getHistoricalPrices: () => ipcRenderer.invoke('get-historical-prices')
});
contextBridge.exposeInMainWorld("fileAPI", {
    saveBeers: (beers, pathname) => {
        const filePath = path.join(__dirname, pathname);
        fs.writeFileSync(filePath, JSON.stringify(beers, null, 2), "utf-8");
    },
    loadBeers: (pathname) => {
        const filePath = path.join(__dirname, pathname);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf-8");
            return JSON.parse(data);
        }
        return []; // retourne un tableau vide si le fichier n'existe pas
    }
});