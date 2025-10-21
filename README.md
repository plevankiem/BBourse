# 🪙 BBourse

Petit tuto pour faire tourner l’application en local.

---

## 1) Installer Node.js

Si c’est pas déjà fait, tu télécharges Node.js ici :  
👉 https://nodejs.org

> 🛠 Pendant l’installation, pense à cocher “Add to PATH” si c’est proposé.  
> Ça permet de l’utiliser dans ton terminal directement.

Ensuite tu vérifies que tout marche en tapant ces commandes dans ton terminal :

```bash
node -v
npm -v
```

## 2) VSCode

J’espère que t’as VS Code (sinon go le télécharger ici) :
👉 https://code.visualstudio.com/download

Une fois installé :
- Tu l’ouvres
- Tu fais “Open Folder”
- Et tu choisis le dossier où tu veux stocker le projet BBourse

## 3) Cloner le repo

Tu ouvres un terminal dans VS Code :
- Soit avec Ctrl + Shift + ù (ou `Ctrl + ```)
- Soit via le menu “Terminal > New Terminal”

Puis tu tapes :
```bash
git clone https://github.com/plevankiem/BBourse.git
```

Ensuite tu vas dans le dossier du projet :
```bash
cd BBourse
```

## 4) Installer ElectronJS

Toujours dans le terminal, tu tapes :
```bash
npm install
```
Ça va installer les modules nécessaires pour faire tourner l'app.
> 🧠 Si jamais y’a un fichier package-lock.json ou un dossier node_modules, c’est que ça a bien marché.

## 5) Lancer l'appli

Et maintenant, pour lancer l’app, tu fais simplement :
```bash
npm start
```

Normalement, tu devrais voir l'application. Si ça marche pas, fais plutôt
```bash
npx electron --no-sandbox main.js
```

## 6) Fermer l'app et reset les prix
Pour fermer l'app, tu as juste à appuyer sur la croix, ou à faire Ctrl + C dans ton terminal.
Quand tu relances l'app, les données ont été sauvegardées, donc si jamais tu veux reset les données, tu peux taper (après avoir fermé l'app) :
```bash
npm run reset
```

## Bonus: Les Chevaliers Du BB
Une glotte pour les gens qui ont touché à ce tutoriel.

Si une personne fait moins de 5s :
- Elle est en open sur KBB toute la soirée

Si une personne fait plus de 8s :
- Le plus gros buveur du binet est en open sur son trigramme toute la soirée
