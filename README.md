# organic-dna-repo-loader

Utility module for loading repo dna accordingly to stem skeleton 2.1 structure.

Features:


- [x] loading of repo's root `/dna` folder
- [x] automatically recognizing and loading repo's cells having `dna` folder in them
- [x] mounting cell's dna `index` as its root dna branch
- [x] resolves refrences once all DNA folders are loaded into memory
- [x] based on [`organic-dna-loader@1.8.0`](https://github.com/node-organic/organic-dna-loader)
- [x] defers DNA loading to existing implementation under `cells/node_modules/lib/load-root-dna` as per stem skeleton 2.1 concept.

## usage

### install

```
$ npm i organic-dna-repo-loader
```

### api

#### loadDNA(root, mode):Promise<DNA>

Loads `<root>/dna` and any cell dna found with glob pattern `<root>/cells/**/dna` into memory by apply `mode` on the loaded DNA chunks before resolving.

* `root` : String, a full path to folder containing `dna` and `cells` folders
* `mode` : String, *optional* mode or combination of modes to instruct DNA folding, see [organic-dna-cellmodes](https://github.com/node-organic/organic-dna-cellmodes) for more info.

### example

```
//       /sample-repo
//       | - cells/cell1/dna/index.yaml
//       | - dna/branch.json
//       | - dna/common.yaml

const loadDNA = require('organic-dna-repo-loader')
const dna = await loadDNA(process.cwd() + '/sample-repo')

expect(dna).toDeepEqual({
  branch: {
    property: "value"
  },
  cells: {
    cell1: {
      build: {
        myProperty: "value"
      }
    }
  },
  common: {
    property: "value"
  }
})
```
