# UENO. Starter kits
This is a repository containing different starter kits each in their own branch. Just git clone and checkout the branch that fits your need.

You can also mix branches with merge if you feel comfortable resolving conflicts.

# List of branches

 - [Base](#master)
 - [Base+Universal](#universal)
 - [Base+Universal+Test](#universal-test)
 - [Base+Universal+Test+Redux](#universal-redux-test)
 - [Universal](#universal)
 - [Redux](#redux)
 - [Test](#test)
 - [Typescript](#typescript)

## master
Good kit for apps without any data layer when you don't want server side rendering.

The kit contains:
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

## test
Adds tests and travis integration.
 - extends `master`
 - karma
 - mocha
 - chai
 - enzyme

## redux
Adds redux and redux router for data layer.
 - extends `master`
 - redux
 - redux-router

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
