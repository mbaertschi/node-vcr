# Boilerplate for nodejs npm package
<!-- Dependency Status -->
<a href="https://david-dm.org/mbaertschi/node-vcr">
  <img src="https://david-dm.org/mbaertschi/node-vcr.svg" alt="Dependency Status" />
</a>
<!-- devDependency Status -->
<a href="https://david-dm.org/mbaertschi/node-vcr?type=dev">
  <img src="https://david-dm.org/mbaertschi/node-vcr/dev-status.svg" alt="devDependency Status" />
</a>

## Tech-Stack
- [nodemon](https://github.com/remy/nodemon) development mode
- [jest](https://facebook.github.io/jest/) test environment
- [jsdoc](http://usejsdoc.org/) documentation
- [npm-check](https://www.npmjs.com/package/npm-check) for dependencies check
- [pre-commit](https://www.npmjs.com/package/pre-commit) for pre git commit hooks
- [babel](https://babeljs.io/) to compile to es2015

## Scripts
```bash
# start development mode with nodemon
yarn dev
# run tests with jest
yarn test
# start continous integration testing with jest
yarn ci
# generate the jsdoc documentation
yarn jsdoc
# run eslint
yarn lint
# check for dependendies updates
yarn deps
# build with babel
yarn build
```
