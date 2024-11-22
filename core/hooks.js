// hooks.js
const hooks = {
  middlewares: {},

  registerMiddleware(moduleName, middleware) {
    this.middlewares[moduleName] = middleware;
  },

  getMiddleware(moduleName) {
    return this.middlewares[moduleName];
  }
};

module.exports = hooks;