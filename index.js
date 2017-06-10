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
			if(obj.pipeline){
				for(let i = 1; (i - 1) <= input.length; i++){
					delete obj.pipeline[input[i]]
				}
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
			if(obj.pipeline){
				const arr = []
				for(let i in obj.pipeline){
					arr.push(`${i}: ${obj.pipeline[i]}`)
				}
				return arr.join('\n')
			}
		})
		.then(list => {
			if(list) console.log(list)
		})
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
