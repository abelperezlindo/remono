const fs = require('fs');
const path = require('path');
// Descover modules in a directory, and return a list of modules.
const discoverModules = function (directory) {
  if (directory) {
    const modules = {};
    const files = fs.readdirSync(directory);

    files.forEach(file => {
      const modulePath = path.join(directory, file);
      if (fs.statSync(modulePath).isDirectory()) {
        const moduleConfig = require(modulePath);
        modules[file] = moduleConfig;
      }
    });

    return modules;
  } else {
    return {};
  }
}

module.exports = { discoverModules };
