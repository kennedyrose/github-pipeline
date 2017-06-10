'use strict'
const fs = require('fs-extra')
const exec = require('child_process').exec

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
		.then(obj => {
			return execPromise(`git remote add ${remote} "${obj.pipeline[remoteName]}"`)
		})
		.then(execPromise(`git fetch ${remote}`))
		.then(execPromise(`git checkout --track -b ghp-${remote} ${remote}/master`))
		.then(execPromise(`git merge master --squash --allow-unrelated-histories -Xtheirs`))
		.then(execPromise(`git reset HEAD CNAME`))
		.then(execPromise(`git reset HEAD docs/CNAME`))
		.then(execPromise(`git commit -m 'Github Pipeline deploy'`))
		.then(execPromise(`git push ${remote} +ghp-${remote}:master`))
		.then(execPromise(`git checkout master`))
		.then(execPromise(`git branch -D ghp-${remote}`))
		.then(console.log)
		.catch(console.error)
}

// Rolls back remote to previous commit
exports.rollback = () => {
	getPackage()
		.then(obj => {

		})
}

function execPromise(str){
	return new Promise((resolve, reject) => {
		exec(str, (err, stdout, stderr) => {
			if(err) return reject(err)
			if(stderr) return reject(stderr)
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
