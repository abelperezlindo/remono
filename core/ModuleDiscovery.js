// ModuleDiscovery.js
const fs = require('fs');
const path = require('path');

function discoverModules(directory) {
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
}

/*
const discoveredModules = discoverModules(path.join(__dirname, 'modules'));
Object.assign(tools, discoveredModules);
*/