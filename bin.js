#!/usr/bin/env node
const pipeline = require('./index')
const meow = require('meow')
const cli = meow(`
	Usage
	  $ ghp <input>
	input
	  push      Pushes to provided repo
	  rollback  Rolls back to commit ID
	  add       Adds a pipeline URL in the package. file
	  ls        Lists all pipeline URLs
`, {
	alias: {}
})
pipeline[cli.input](cli.flags)
