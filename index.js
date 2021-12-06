const loadDNA = require('organic-dna-loader')
const glob = require('fast-glob')
const path = require('path')
const {createBranch} = require('organic-dna-branches')
const exists = require('file-exists')

const loadCellsDNA = async function (dna, mode, repoPath) {
  let cellDNAPaths
  if (dna.cells && dna.cells.index && dna.cells.index.cellsInfo === 'v1') {
    cellDNAPaths = dna.cells.index.cellPaths.map(function (v) {
      return path.join(repoPath, v, 'dna')
    })
  } else {
    cellDNAPaths = await glob(path.join(repoPath, 'cells/**/dna'), {
      ignore: ['**/node_modules/**/*'],
      onlyDirectories: true
    })
  }
  for (let i = 0; i < cellDNAPaths.length; i++) {
    let cellDNAPath = cellDNAPaths[i]
    let cellDNA = await loadDNA({
      dnaSourcePath: cellDNAPath,
      dnaMode: mode,
      skipResolve: true
    })
    let cellDnaBranch = cellDNAPath
    if (repoPath !== '/') {
      // replace repo prefix only if it is different than root folder
      cellDnaBranch = cellDnaBranch.replace(repoPath + path.sep, '')
    } else {
      // replace repo prefix ('/')
      cellDnaBranch = cellDnaBranch.replace(repoPath, '')
    }
    cellDnaBranch = cellDnaBranch
      .replace(new RegExp(path.sep + 'dna$'), '')
      .replace(new RegExp(path.sep, 'g'), '.')
    if (cellDNA.index) {
      Object.assign(cellDNA, cellDNA.index)
      delete cellDNA.index
    }
    createBranch(dna, cellDnaBranch, cellDNA)
  }
}

module.exports = async function ({root, mode, skipExistingLoaderUsage = false}) {
  // check for provided existing loader accordingly to stem skeleton v2.1
  let existingLoadDNAPath = path.join(root, 'cells/node_modules/lib/load-root-dna.js')
  if (await exists(existingLoadDNAPath) && !skipExistingLoaderUsage) {
    console.warn('found stem-skeleton 2.1 root dna loader, newer versions will deprecate this in flavor of stem-skeleton 3')
    // loader exists, so use it instead of current implementation
    let existingLoader = require(existingLoadDNAPath)
    return existingLoader(mode)
  }
  // stem-skeleton 3.x.x support
  existingLoadDNAPath = path.join(root, 'packages/lib/load-root-dna.js')
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
