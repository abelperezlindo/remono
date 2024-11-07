module.exports = {
  middelware4get: (req, res, next) => {
    console.log('middleware4get');
    next();
  },
  middelware4post: (req, res, next) => {
    console.log('middleware4post');
    next();
  }
}