# 🪙 BBourse

Petit tuto pour faire tourner l’application en local.

---

## 1) Installer Node.js

Si c’est pas déjà fait évidemment, tu télécharges Node.js ici :  
👉 https://nodejs.org

> 🛠 Pendant l’installation, pense à cocher “Add to PATH” si c’est proposé.  
> Ça permet de l’utiliser dans ton terminal directement.

Ensuite tu vérifies que tout roule avec ces commandes :

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
git clone https://github.com/Kewij/BBourse.git
```

Ensuite tu vas dans le dossier du projet :
```bash
cd BBourse
```

## 4) Installer ElectronJS

Toujours dans le terminal, tu tapes :
```bash
npm install electron --save-dev
```
Ça va installer Electron dans le projet.
> 🧠 Si jamais y’a un fichier package-lock.json ou un dossier node_modules, c’est que ça a bien marché.

## 5) Lancer l'appli

Et maintenant, pour lancer l’app, tu fais simplement :
```bash
npm start
```

## 6) Acti tradi
Une glotte pour toutes celles et ceux qui ont touché à ce tutoriel.

Si une personne fait moins de 5s :
- Elle est en open sur KBB toute la soirée

Si une personne fait plus de 8s :
- Elle prend un Jacques Mayol
