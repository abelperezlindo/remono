// templateFolders.js
const path = require('path');
const fs = require('fs');

const registerTemplateFolders = (engine, modulesPath) => {
  const templatePaths = [];

  fs.readdirSync(modulesPath).forEach(moduleName => {
    const templatesPath = path.join(modulesPath, moduleName, 'views');
    if (fs.existsSync(templatesPath)) {
      templatePaths.push(templatesPath);
      console.log(`Template folder registered for module: ${moduleName}`);
    }
  });

  // Asegúrate de que engine.root sea un array
  if (!Array.isArray(engine.root)) {
    engine.root = [engine.root];
  }

  // Añade las rutas de las plantillas al motor de Liquid
  engine.root = [...engine.root, ...templatePaths];
};

module.exports = registerTemplateFolders;