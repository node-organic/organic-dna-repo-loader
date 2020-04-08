const test = require('ava')
const loadDNA = require('./index')
const path = require('path')

test('example', async function (t) {
  let dna = await loadDNA({
    root: path.join(__dirname, 'sample-repo')
  })
  t.deepEqual(JSON.parse(JSON.stringify(dna)), {
    branch: {
      property: 'value'
    },
    cells: {
      cell1: {
        build: {
          myProperty: 'value'
        }
      }
    },
    common: {
      property: 'value'
    }
  })
})

test('example with predefined cell routes', async function (t) {
  let dna = await loadDNA({
    root: path.join(__dirname, 'sample-repo-with-cell-paths')
  })
  t.deepEqual(JSON.parse(JSON.stringify(dna)), {
    branch: {
      property: 'value'
    },
    cells: {
      index: {
        cellsInfo: 'v1',
        cellPaths: ['cells/cell1']
      },
      cell1: {
        build: {
          myProperty: 'value'
        }
      }
    },
    common: {
      property: 'value'
    }
  })
})
