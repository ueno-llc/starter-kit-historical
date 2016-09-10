[![Travis](https://travis-ci.org/ueno-llc/starter-kit.svg)](https://travis-ci.org/ueno-llc/starter-kit)
[![Dependencies](https://david-dm.org/ueno-llc/starter-kit.svg)](https://david-dm.org/ueno-llc/starter-kit)
[![devDependencies](https://david-dm.org/ueno-llc/starter-kit/dev-status.svg)](https://david-dm.org/ueno-llc/starter-kit#info=devDependencies&view=table)

# UENO. Starter kit

Starter kit with server side rendering, eslint, less, stylelint and enzyme tests.

**Before working on a new project**

Change stuff in `app.json` and `package.json`.

## Install

```bash
$ npm install
```

## Run dev
```bash
$ npm run dev
```

## Run release
```bash
$ npm start
```

# Configuration make

### `target`
Specify which platform to target, currently accepts `"web"` (client), and `"node"` (server).

### `hot`
Boolean value to enable hot reloading on the client. Only works in development mode.

### `entry`
Path to an entry point for packaging. Will output the same name into `./build`.

### `debug`
Enable or disable debug mode. The production will always overwrite with `false`.

### `devtool`
Set the devtool sourcemapping. Defaults to `cheap-module-eval-source-map` for client and `eval-source-map` for server.

### `eslint`
Enable or disable eslinting of the javascript on runtime. Only in debug mode.
