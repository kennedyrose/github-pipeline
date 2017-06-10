'use strict'
const exec = require('child_process').exec
const fs = require('fs-extra')

// Add a remote
exports.add = (input, opt) => {
	getPackage()
		.then(obj => {
			if(!obj.pipeline) obj.pipeline = {}
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
			if(obj.pipeline) delete obj.pipeline[input[1]]
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
			if(obj.pipeline){
				const arr = []
				for(let i in obj.pipeline){
					arr.push(`${i}: ${obj.pipeline[i]}`)
				}
				return arr.join('\n')
			}
		})
		.then(console.log)
		.catch(console.error)
}

exports.push = () => {

}

exports.rollback = () => {

}

function getPackage(){
	return fs.readJson('./package.json')
}
function savePackage(obj){
	return fs.outputJson('./package.json', obj, {
		spaces: '\t'
	})
}
