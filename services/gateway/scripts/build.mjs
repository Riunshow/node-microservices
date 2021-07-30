#!/usr/bin/env zx
const fs = require("fs/promises")
const { resolve } = require("path")

const packageFile = require('../package.json')
const PATH_ROOT = resolve(__dirname, '../')
let copyFile = {...packageFile}
try {
    console.log('clearing build folder')
    await $`rm -rf ../dist`
    console.log('building...')
    await $`tsc`
    console.log('writing package.json')
    await fs.writeFile(`${PATH_ROOT}/dist/package.json`, JSON.stringify(copyFile))
}catch (p) {
    console.error(p)
}
