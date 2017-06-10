'use strict'
const fs = require('fs-extra')
const childProcess = require('child_process')
const exec = childProcess.exec
const spawn = childProcess.spawn

// Add a remote
exports.add = (input, opt) => {
	getPackage()
		.then(obj => {
			obj.pipeline[input[1]] = input[2]
			return obj
		})
		.then(savePackage)
		.catch(console.error)
}

// Remove a remote
exports.remove = exports.rm = (input, opt) => {
	getPackage()
		.then(obj => {
			for(let i = 1; (i - 1) <= input.length; i++){
				delete obj.pipeline[input[i]]
			}
			if(!Object.keys(obj.pipeline).length) delete obj.pipeline
			return obj
		})
		.then(savePackage)
		.catch(console.error)
}

// List all remotes
exports.list = exports.ls = () => {
	getPackage()
		.then(obj => {
			const arr = []
			for(let i in obj.pipeline){
				arr.push(`${i}: ${obj.pipeline[i]}`)
			}
			return arr.join('\n')
		})
		.then(str => {
			if(str) console.log(str)
		})
		.catch(console.error)
}

// Pushes latest commit to remote
exports.push = input => {
	let remote = input[1]
	getPackage()
		.then(obj => execPromiseSilent(`git remote add ghp-remote-${remote} "${obj.pipeline[remote]}"`))
		.then(() => execPromiseSilent(`git fetch ghp-remote-${remote}`))
		.then(() => execPromiseSilent(`git checkout --track -b ghp-branch-${remote} ghp-remote-${remote}/master`))
		.then(() => execPromiseSilent(`git merge master --squash --allow-unrelated-histories -Xtheirs`))
		.then(() => execPromiseSilent(`git reset HEAD CNAME`))
		.then(() => execPromiseSilent(`git reset HEAD docs/CNAME`))
		.then(() => execPromiseSilent(`git commit -m 'Github Pipeline deploy'`))
		.then(() => execPromiseSilent(`git push ghp-remote-${remote} +ghp-branch-${remote}:master`))
		.then(() => execPromiseSilent(`git checkout master`))
		.then(() => execPromiseSilent(`git branch -D ghp-branch-${remote}`))
		.catch(err => {
			console.log('ERROR: ' + err)
		})
}

// Rolls back remote to previous commit
exports.rollback = () => {
	getPackage()
		.then(obj => {

		})
}

function execPromise(str){
	return new Promise((resolve, reject) => {
		console.log('Executing: ' + str)
		exec(str, (err, stdout, stderr) => {
			console.log('Returned...')
			if(err) return reject(err)
			if(stderr) return reject(stderr)
			if(stdout) console.log(stdout)
			resolve(stdout)
		})
	})
}
function execPromiseSilent(str){
	return new Promise((resolve, reject) => {
		console.log('Executing: ' + str)
		exec(str, (err, stdout, stderr) => {
			console.log('Returned...')
			resolve(stdout)
		})
	})
}

function getPackage(){
	return new Promise((resolve, reject) => {
		fs.readJson('./package.json', (err, obj) => {
			if(!obj) obj = {}
			if(!obj.pipeline) obj.pipeline = {}
			resolve(obj)
		})
	})
}
function savePackage(obj){
	return fs.outputJson('./package.json', obj, {
		spaces: '\t'
	})
}
