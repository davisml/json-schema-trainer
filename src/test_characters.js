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
	console.log(JSON.stringify(schema))
	
	console.log("Training complete")
	
	for (let i = 0; i < responseItems.length; i++) {
		if (!ajv.validate(schema, responseItems[i])) {
			console.error("Training item failed to validate")
			console.log(ajv.errors)
			return
		}
	}

	console.log("All training items validated")
}

console.log("Fetch some JSON")

let allCharacters = []
let numberOfBooks = 2
let booksLoaded = 0

for (let i = 1; i <= numberOfBooks; i++) {
	Request(`https://anapioficeandfire.com/api/books/${ i }`).then((bookResponse) => {
		let {characters} = JSON.parse(bookResponse)

		Array.prototype.push.apply(allCharacters, characters)

		booksLoaded++

		if (booksLoaded == numberOfBooks) {
			_.forEach(allCharacters, (url) => {
				Request(url).then((response) => {
					const body = JSON.parse(response)
					
					responseItems.push(body)
					schemaTrainer.train(body)
					
					if (responseItems.length === characters.length) {
						testSchema(schemaTrainer.toJS())
					}
				}).catch((error) => {
					console.log("Fetch error")
					console.error(error)
					console.log(error.stack)
					throw error
				})
			})
		}
	})
}