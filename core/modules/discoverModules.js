// discoverModules.js
const fs = require('fs');
const path = require('path');

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

/*
const discoveredModules = discoverModules(path.join(__dirname, 'modules'));
Object.assign(tools, discoveredModules);
*/