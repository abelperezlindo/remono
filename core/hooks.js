// Hooks definitions.
const hooks = {
  adminMiddlewares: {},
  clientMiddlewares: {},

  registerAdminMiddleware(moduleName, middleware) {
    this.adminMiddlewares[moduleName] = middleware;
  },
  registerClientMiddleware(moduleName, middleware) {
    this.clientMiddlewares[moduleName] = middleware;
  },

  getAdminMiddleware(moduleName) {
    return this.adminMiddlewares[moduleName];
  },
  getClientMiddleware(moduleName) {
    return this.clientMiddlewares[moduleName];
  }
};

module.exports = hooks;