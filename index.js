const loadDNA = require('organic-dna-loader')
const glob = require('fast-glob')
const path = require('path')
const {createBranch} = require('organic-dna-branches')
const exists = require('path-exists')

const loadCellsDNA = async function (dna, mode, repoPath) {
  const cellDNAPaths = await glob(path.join(repoPath, 'cells/**/dna'), {
    ignore: ['**/node_modules/**/*'],
    onlyDirectories: true
  })
  for (let i = 0; i < cellDNAPaths.length; i++) {
    let cellDNAPath = cellDNAPaths[i]
    let cellDNA = await loadDNA({
      dnaSourcePath: cellDNAPath,
      dnaMode: mode,
      skipResolve: true
    })
    let cellDnaBranch = cellDNAPath.replace(repoPath + path.sep, '')
      .replace(new RegExp(path.sep + 'dna$'), '')
      .replace(new RegExp(path.sep, 'g'), '.')
    createBranch(dna, cellDnaBranch, cellDNA.index || cellDNA)
  }
}

module.exports = async function ({root, mode, skipExistingLoaderUsage = false}) {
  // check for provided existing loader accordingly to stem skeleton v2.1
  let existingLoadDNAPath = path.join(root, 'cells/node_modules/lib/load-root-dna.js')
  if (await exists(existingLoadDNAPath) && !skipExistingLoaderUsage) {
    // loader exists, so use it instead of current implementation
    let existingLoader = require(existingLoadDNAPath)
    return existingLoader(mode)
  }

  return loadDNA({
    dnaSourcePath: path.join(root, 'dna'),
    dnaMode: mode,
    beforeResolve: async function (dna) {
      await loadCellsDNA(dna, mode, root)
    }
  })
}
