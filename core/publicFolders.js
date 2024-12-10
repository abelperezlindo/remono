const path = require('path');
const express = require('express');

// Register public folders for modules.
const registerPublicFolders = (app, modulesPath) => {
  const fs = require('fs');

  fs.readdirSync(modulesPath).forEach(moduleName => {
    const publicPath = path.join(modulesPath, moduleName, 'public');
    if (fs.existsSync(publicPath)) {
      app.use(`/${moduleName}`, express.static(publicPath));
      console.log(`Public folder registered for module: ${moduleName}`);
    }
  });

};

module.exports = registerPublicFolders;