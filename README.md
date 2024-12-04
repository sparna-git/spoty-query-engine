# spoty-query-engine

This is an attempt to compile a Comunica Query Engine by following the tutorial at https://comunica.dev/docs/modify/getting_started/


## Test the default query engine

- `npm init`
- Add dependency `npm install @comunica/query-sparql`
- Copy code in `query-sparql-engine.js`
- Make sure to use an "await" function
- Run code with `node query-sparql-engine.js`

## Test the use of a custom config

- Copy `query-sparql-engine.js` into `query-custom.js`
- Create a config file in `config/config.json` and copy inside it the default Comunica config file found at https://github.com/comunica/comunica/blob/master/engines/config-query-sparql/config/config-default.json (**/!\ do NOT use the one provided in the documentation**)
- Adapt the code:

```typescript
	const myEngine = await new QueryEngineFactory().create({
	    configPath: 'config/config.json', // Relative or absolute path 
	});
```

- run with `node query-custom.js`

## Test a link traversal config

- Make a copy of the config file from https://github.com/comunica/comunica-feature-link-traversal/blob/2d170e26821d6f242ac1aefd4b7a2e011c5c87ee/engines/config-query-sparql-link-traversal/config/config-solid-single-pod.json
- Added the dependency : :
	- `@comunica/config-query-sparql-link-traversal`
	- `@comunica/query-sparql-link-traversal`
	- `@comunica/config-query-sparql-solid`
	- `@comunica/query-sparql-link-traversal-solid`
- Make a copy of `query-custom.js` into `query-custom-link-traversal.js`
- Adapt the code:

```typescript
	const myEngine = await new QueryEngineFactory().create({
	    // configPath: 'config/config.json', // Relative or absolute path 
	    configPath: 'config/config-spoty.json', // Relative or absolute path 
	});

	const bindingsStream = await myEngine.queryBindings(`
	  SELECT ?s ?p ?o WHERE {
	    ?s ?p ?o
	  } LIMIT 10`, {
	  sources: ['https://fragments.dbpedia.org/2015/en'],
	});
```

- run with `node query-custom-link-traversal.js`


## Compile as an NPM package

- Follow documentation at https://comunica.dev/docs/modify/getting_started/custom_init/
- Copy the config file into config-default.json : `cp config/config-spoty.json config/config-default.json`
- Added compile script in `package.json`:

```json
{
  ...
  "scripts": {
    ...
    "build:engine": "comunica-compile-config config/config-default.json > engine-default.js",
    "build:lib": "tsc",
    "build": "npm run build:lib && npm run build:engine",
    "prepare": "npm run build"
  },
}
```

- Compile with `npm run build:engine`

- Create `lib` folder
- Add in `lib` folder `QueryEngine.ts`, `QueryEngineFactory.ts`, `index.ts` and `index-browser.ts` with the content as provided in the doc
- Added entries in the package.json file:

```json
"main": "lib/index.js",
  "types": "lib/index",
  "browser": {
    "./lib/index.js": "./lib/index-browser.js",
    "./lib/index.js.map": "./lib/index-browser.js.map"
  },
```

- Added .npmignore and .gitignore as documented
- Added `files` section in package.json as documented:

```json
"files": [
    "components",
    "config",
    "bin/**/*.d.ts",
    "bin/**/*.js",
    "bin/**/*.js.map",
    "lib/**/*.d.ts",
    "lib/**/*.js",
    "lib/**/*.js.map",
    "engine-default.js"
  ]
```

- added a `tsconfig.json` to allow Typescript compiling
- added Typescript dependency : `npm i typescript --save-dev`
- **/!\ downgrade Typescript version to 5.5.4 to avoid error with LRUCache**. See https://github.com/isaacs/node-lru-cache/issues/354#issuecomment-2351174972:

```json
  "devDependencies": {
    "typescript": "5.5.4"
  }
```