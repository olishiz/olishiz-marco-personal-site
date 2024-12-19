# Resume

> Personal Website

## Features

* [Vue.js](https://vuejs.org/) and [Webpack 2](https://webpack.js.org/) with HMR 
* ES6+ with [Babel](https://babeljs.io/)
* Unit test with [Jest](https://facebook.github.io/jest/)
* CSS and JS linting with [ESLint](http://eslint.org/) (airbnb preset) and [Stylelint](https://stylelint.io/)
* [Sass](http://sass-lang.com/) with [node-sass](https://github.com/sass/node-sass) 
* CSS [post-processing](https://github.com/postcss/postcss)
* [CSS Modules](https://github.com/css-modules/css-modules)
* Em based media-queries via [sass-mq](https://github.com/sass-mq/sass-mq)

## Requirements

* Node.js >= 6.9.0 (we strongly suggest to use something like [nvm](https://github.com/creationix/nvm))
* npm or [yarn](https://yarnpkg.com/lang/en/)
* REMEMBER TO USE: `nvm use 8.17.0` to build and run the development project!


## Installation

1) Clone this repo

2) From project root:

*  `yarn`

## Scripts

Either use `npm run <script>` or `yarn run <script>`

* `start`: start development mode
* `server`: run a static web server
* `test`: run jest
* `build`: generate a development build (will also lint files)
* `build:production`: generate a production build
* `eslint`: lint JS files
* `stylelint`: lint SCSS/CSS files
* `lint`: lint both styles and JS files


## Development 

To run the boilerplate in development mode (uses [webpack dev server](https://webpack.js.org/configuration/dev-server/)) run:

```
yarn start
```

## Notes:

1) Install nvm, then `nvm install 8.17.0`, then `nvm use 8.17.0`

2) Install yarn on global by running `npm install --global yarn`

3) Install node_modules by just using yarn package - `yarn` then serve it using `yarn start`

4) To build artifacts, run the following command `yarn build`

5) To push to GitHub pages, run the following command `cp -r public/* ../olishiz.github.io/` - make sure that locally, you have the repo cloned in your local directory
