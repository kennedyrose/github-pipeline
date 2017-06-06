#!/usr/bin/env node
const pipeline = require('./index')
const meow = require('meow')
const cli = meow(`
	Usage
	  $ ghp
`, {
	alias: {}
})
pipeline(cli.input, cli.flags)
