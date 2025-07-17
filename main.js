const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./beer-market.db');
let win;

const beer1 = "Cuvée";
const beer2 = "Lagunitas";
const beer3 = "Blanche";
const beer4 = "Kasteel";
const beer5 = "Chouffe";
const beer6 = "Chimay";

// Initialisation de la base de données
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS price_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beer_name TEXT,
    price REAL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Vérifier si la table contient des données
  db.get("SELECT COUNT(*) AS count FROM price_history", (err, row) => {
    if (err) {
      console.error("Erreur lors de la vérification de la table :", err.message);
      return;
    }

    // Si la table est vide, insérer des prix initiaux
    if (row.count === 0) {
      db.run(`INSERT INTO price_history (beer_name, price) VALUES ('${beer1}', 3.5)`, () => {
        db.run(`INSERT INTO price_history (beer_name, price) VALUES ('${beer2}', 3.5)`, () => {
          db.run(`INSERT INTO price_history (beer_name, price) VALUES ('${beer3}', 3.5)`, () => {
            db.run(`INSERT INTO price_history (beer_name, price) VALUES ('${beer4}', 3.5)`, () => {
              db.run(`INSERT INTO price_history (beer_name, price) VALUES ('${beer5}', 3.5)`, () => {
                db.run(`INSERT INTO price_history (beer_name, price) VALUES ('${beer6}', 3.5)`, () => {
                  console.log("Données initiales insérées dans l'ordre dans la table price_history.");
                });
              });
            });
          });
        });
      });
    } else {
      console.log("La table price_history contient déjà des données.");
    }
  });
});

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  win = new BrowserWindow({
    width: width,
    height: height,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

async function getHistoricalPrices () {
  return new Promise((resolve, reject) => {
    db.all("SELECT (id - 1) / 6 AS id_mod, beer_name, price FROM price_history ORDER BY id_mod", (err, rows) => {
        if (err) {
            reject(err);
        } else {
            resolve(rows);  // Send back the data as an array of objects
        }
    });
});
}

ipcMain.handle('get-historical-prices', getHistoricalPrices);
ipcMain.on('update-beer-prices', (event, beers) => {
    updatePricesInDatabase(beers);
});

/**
 * Enregistre les nouveaux prix des bières dans la table price_history, avec un horodatage pour l'historique.
 * @param {Array} beers - Un tableau d'objets contenant name et price pour chaque bière
 */
function updatePricesInDatabase(beers) {
  db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      beers.forEach((beer) => {
          db.run(
              `INSERT INTO price_history (beer_name, price) VALUES (?, ?)`,
              [beer.name, beer.price],
              function (err) {
                  if (err) {
                      console.error(`Erreur lors de l'ajout du prix pour ${beer.name} : ${err.message}`);
                  } else {
                      console.log(`Prix de la bière "${beer.name}" enregistré à ${beer.price} €`);
                  }
              }
          );
      });

      db.run("COMMIT", (err) => {
          if (err) {
              console.error("Erreur lors de la transaction de mise à jour, rollback en cours : ", err.message);
              db.run("ROLLBACK");
          } else {
              console.log("Tous les prix ont été enregistrés avec succès dans l'historique !");
          }
      });
  });
}