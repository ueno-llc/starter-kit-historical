# UENO. Starter kits
This is a repository containing different starter kits each in their own branch.
Just git pull and checkout the branch that fits your need.

## master
Default starter kit contains:
 - webpack
   - hot-loader
   - babel-loader
   - css-loader
   - postcss+autoprefixer
   - file-loader
   - json-loader
 - react
 - react-router
 - eslint
 - stylelint

## universal
Adds server side rendering using express and react-dom.
 - extends `master`
 - react-dom
 - express

## redux
Adds redux and redux router for data layer.
 - extends `master`
 - redux
 - redux-router

## test
Adds tests and travis integration.
 - extends `master`
 - karma
 - mocha
 - chai
 - enzyme

## typescript
Adds typescript integration.
 - extends `master`
 - typescript
 - typings
 - tslint
 - webpack/ts-loader

## universal-redux
Use universal base and add thunk for server side redux.
 - extends `universal`
 - redux-thunk

## universal-test
 - extends `universal`
 - extends `test`

## universal-redux-test
Mother of all branches.
 - extends `universal`
 - extends `enzyme`
 - extends `test`
