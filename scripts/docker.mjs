#!/usr/bin/env zx
const command = process.argv.slice(3)
if (!command) console.error("please type command: build, dev, test")

const BRANCH = await $`git rev-parse --abbrev-ref HEAD`
const SHA = await $`git rev-parse --short=7 HEAD`
const TAG = `${BRANCH.toString().trim()}-${SHA.toString().trim()}`

switch (command[0]) {
  case 'build':
    console.log('parpare building docker image')
    await $`TAG=${TAG} docker-compose build`
    break
  case 'dev':
    console.warn('start development env')
    await $`TAG=${TAG} docker-compose -p turbine -f docker-compose.yaml up -d`
    break
  case 'test':
    console.warn('Not implemented yet')
    break
  default:
    console.error('Unknown command')
}
