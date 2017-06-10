#!/usr/bin/env node
const pipeline = require('./index')
const meow = require('meow')
const cli = meow(`
	Usage
	  $ ghp <input>
	input
	  add       Adds a pipeline URL in the package.json file
	  remove    Removes a pipeline URL in the package.json file
	  push      Pushes to provided repo
	  rollback  Rolls back to commit ID
	  ls        Lists all pipeline URLs

`, {
	alias: {}
})
pipeline[cli.input[0]](cli.input, cli.flags)
