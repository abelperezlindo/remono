// hooks.js
const hooks = {
  adminMiddlewares: {},
  clientMiddlewares: {},

  registerAdminMiddleware(moduleName, middleware) {
    this.middlewares[moduleName] = middleware;
  },
  registerClientMiddleware(moduleName, middleware) {
    this.middlewares[moduleName] = middleware;
  },

  getAdminMiddleware(moduleName) {
    return this.middlewares[moduleName];
  },
  getClientMiddleware(moduleName) {
    return this.middlewares[moduleName];
  }
};

module.exports = hooks;