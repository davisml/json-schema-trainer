import Request from 'request-promise-native'
import http from 'http'
import SchemaTrainer from './SchemaTrainer'
import AJV from 'ajv'
import _ from 'underscore'

const acronyms = ['SGML', 'OMG', 'LOL', 'LMAO', 'BMI', 'TMI', 'XML', 'WTF', 'a', 'bluh', '&']
const schemaTrainer = new SchemaTrainer
const ajv = new AJV

let responseItems = []

function testSchema(schema) {
	console.log(JSON.stringify(schema, null, 4))
	// console.log(responseItems[0])
	
	console.log("Training complete")
	
	for (let i = 0; i < responseItems.length; i++) {
		if (!ajv.validate(schema, responseItems[i])) {
			console.error("Training item failed to validate")
			console.log(ajv.errors)
			console.log(responseItems[i])
			return
		}
	}

	console.log("All " + responseItems.length + " training items validated")
}


console.log("Fetch some JSON")

const shows = ['girls', 'mad', 'amazing', 'unknown']

shows.forEach((show) => {
	const url = `http://api.tvmaze.com/search/shows?q=${ show }`
	
	Request(url).then((response) => {
		const body = JSON.parse(response)
		responseItems.push(body)
		schemaTrainer.train(body)

		if (responseItems.length === shows.length) {
			testSchema(schemaTrainer.toJS())
		}
	}).catch((error) => {
		console.error(error)
		// response
	})
})


// console.log("Fetch some JSON")

// const itemPath = 'https://hacker-news.firebaseio.com/v0/item'

// Request(`https://hacker-news.firebaseio.com/v0/topstories.json`).then((response) => {
// 	const topStories = JSON.parse(response)

// 	if (topStories.length > 50) {
// 		topStories.length = 50
// 	}

// 	_.forEach(topStories, (id) => {
// 		const url = `${ itemPath }/${ id }.json`

// 		Request(url).then((response) => {
// 			const body = JSON.parse(response)
			
// 			responseItems.push(body)
// 			schemaTrainer.train(body)
			
// 			if (responseItems.length === topStories.length) {
// 				testSchema(schemaTrainer.toJS())
// 			}
// 		}).catch((error) => {
// 			console.log("Fetch error")
// 			console.error(error)
// 			console.log(error.stack)
// 			throw error
// 		})
// 	})
// })