const path = require('path');
const fs = require('fs');
// Register template folders for modules.
const registerTemplateFolders = (modulesPath) => {
  const templatePaths = [];

  templatePaths.push(path.join(__dirname, '..', 'views'));
  fs.readdirSync(modulesPath).forEach(moduleName => {
    const templatesPath = path.join(modulesPath, moduleName, 'views');
    if (fs.existsSync(templatesPath)) {
      templatePaths.push(templatesPath);
      console.log(`Template path: ${templatesPath}`);
      console.log(`Template folder registered for module: ${moduleName}`);
    }
  });

  return templatePaths;
};

module.exports = registerTemplateFolders;